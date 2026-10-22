import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest'
import request from 'supertest'
import type { Express } from 'express'
import mongoose from 'mongoose'
import { createApp } from '../app.js'
import Odontogram from '../models/odontogram.js'
import { connectTestDB, clearTestDB, disconnectTestDB } from './helpers/mongodb.js'
import { createPatient, registerDoctor } from './helpers/patients.js'
import { resetExternalMocks } from './helpers/mocks.js'

/**
 * Current odontogram controller / isDoctor behavior (do not change product code for these):
 * - Routes: GET/PUT /api/v1/odontograms/:id where :id is the patient id
 * - GET: Odontogram.find({ patient: id }) -> 200 array (even when one or zero docs)
 * - PUT: finds by patient; allowlists teeth/problemas/tejidosBlandos; 400 if none or missing odontogram
 * - Authz via protectRoute + isDoctor: 401 no auth; 403 foreign patient; 404 missing patient
 */

let app: Express

describe('Odontogram API', () => {
    beforeAll(async () => {
        await connectTestDB()
        app = createApp()
    })

    afterAll(async () => {
        await disconnectTestDB()
    })

    beforeEach(async () => {
        await clearTestDB()
        resetExternalMocks()
    })

    describe('GET /api/v1/odontograms/:id', () => {
        it('returns 401 without auth', async () => {
            const id = new mongoose.Types.ObjectId().toString()
            const res = await request(app).get(`/api/v1/odontograms/${id}`)

            expect(res.status).toBe(401)
            expect(res.body).toEqual({ message: 'Unauthorized, no token' })
        })

        it('returns 403 for a foreign patient', async () => {
            const doctorA = await registerDoctor(app, 'odo-get-a')
            const doctorB = await registerDoctor(app, 'odo-get-b')
            const patient = await createPatient(doctorB.agent)

            const res = await doctorA.agent.get(`/api/v1/odontograms/${patient._id}`)
            expect(res.status).toBe(403)
            expect(res.body).toEqual({ message: 'Forbidden. Not authorized' })
        })

        it('returns 404 when patient is missing', async () => {
            const { agent } = await registerDoctor(app, 'odo-get-404')
            const missingId = new mongoose.Types.ObjectId().toString()

            const res = await agent.get(`/api/v1/odontograms/${missingId}`)
            expect(res.status).toBe(404)
            expect(res.body).toEqual({ message: 'Id or Patient not found' })
        })

        it('returns array of odontograms for own patient', async () => {
            const { agent } = await registerDoctor(app, 'odo-get-ok')
            const patient = await createPatient(agent)

            const res = await agent.get(`/api/v1/odontograms/${patient._id}`)
            expect(res.status).toBe(200)
            expect(Array.isArray(res.body)).toBe(true)
            expect(res.body).toHaveLength(1)
            expect(String(res.body[0].patient)).toBe(String(patient._id))
            expect(res.body[0].teeth).toHaveLength(32)
        })
    })

    describe('PUT /api/v1/odontograms/:id', () => {
        it('returns 401 without auth', async () => {
            const id = new mongoose.Types.ObjectId().toString()
            const res = await request(app)
                .put(`/api/v1/odontograms/${id}`)
                .send({ problemas: ['Caries'] })

            expect(res.status).toBe(401)
            expect(res.body).toEqual({ message: 'Unauthorized, no token' })
        })

        it('returns 403 for a foreign patient', async () => {
            const doctorA = await registerDoctor(app, 'odo-put-a')
            const doctorB = await registerDoctor(app, 'odo-put-b')
            const patient = await createPatient(doctorB.agent)

            const res = await doctorA.agent
                .put(`/api/v1/odontograms/${patient._id}`)
                .send({ problemas: ['Caries'] })
            expect(res.status).toBe(403)
            expect(res.body).toEqual({ message: 'Forbidden. Not authorized' })
        })

        it('returns 404 when patient is missing', async () => {
            const { agent } = await registerDoctor(app, 'odo-put-404')
            const missingId = new mongoose.Types.ObjectId().toString()

            const res = await agent
                .put(`/api/v1/odontograms/${missingId}`)
                .send({ problemas: ['Caries'] })
            expect(res.status).toBe(404)
            expect(res.body).toEqual({ message: 'Id or Patient not found' })
        })

        it('returns 400 when odontogram record is missing', async () => {
            const { agent } = await registerDoctor(app, 'odo-put-no-odo')
            const patient = await createPatient(agent)
            await Odontogram.deleteMany({ patient: patient._id })

            const res = await agent
                .put(`/api/v1/odontograms/${patient._id}`)
                .send({ problemas: ['Caries'] })
            expect(res.status).toBe(400)
            expect(res.body).toEqual({ message: 'No odontogram found' })
        })

        it('persists teeth (and other field) updates for own patient', async () => {
            const { agent } = await registerDoctor(app, 'odo-put-ok')
            const patient = await createPatient(agent)

            const before = await Odontogram.findOne({ patient: patient._id }).lean()
            expect(before).not.toBeNull()
            const teeth = structuredClone(before!.teeth)
            teeth[0] = {
                ...teeth[0],
                description: 'Caries oclusal',
                center: 'Red',
            }

            const res = await agent.put(`/api/v1/odontograms/${patient._id}`).send({
                teeth,
                problemas: ['Caries'],
            })
            expect(res.status).toBe(200)
            expect(res.body.problemas).toEqual(['Caries'])
            expect(res.body.teeth[0].description).toBe('Caries oclusal')
            expect(res.body.teeth[0].center).toBe('Red')
            expect(res.body.teeth).toHaveLength(32)

            const after = await Odontogram.findOne({ patient: patient._id }).lean()
            expect(after!.problemas).toEqual(['Caries'])
            expect(after!.teeth[0]?.description).toBe('Caries oclusal')
            expect(after!.teeth[0]?.center).toBe('Red')
        })

        it('does not reassign patient via PUT body', async () => {
            const { agent } = await registerDoctor(app, 'odo-put-mass')
            const patient = await createPatient(agent)
            const otherPatientId = new mongoose.Types.ObjectId().toString()

            const res = await agent.put(`/api/v1/odontograms/${patient._id}`).send({
                patient: otherPatientId,
                problemas: ['Caries'],
            })
            expect(res.status).toBe(200)
            expect(res.body.problemas).toEqual(['Caries'])
            expect(String(res.body.patient)).toBe(String(patient._id))

            const after = await Odontogram.findOne({ patient: patient._id }).lean()
            expect(after).not.toBeNull()
            expect(String(after!.patient)).toBe(String(patient._id))
            expect(after!.problemas).toEqual(['Caries'])
        })
    })
})
