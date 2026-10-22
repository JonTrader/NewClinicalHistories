import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest'
import request from 'supertest'
import type { Express } from 'express'
import mongoose from 'mongoose'
import { createApp } from '../app.js'
import Evolution from '../models/evolution.js'
import { connectTestDB, clearTestDB, disconnectTestDB } from './helpers/mongodb.js'
import { createPatient, registerDoctor } from './helpers/patients.js'
import { resetExternalMocks } from './helpers/mocks.js'

/**
 * Current evolution controller / isDoctor behavior (do not change product code for these):
 * - Routes: GET/PUT /api/v1/evolutions/:id where :id is the patient id
 * - GET: Evolution.find({ patient: id }) -> 200 array
 * - PUT: appends { body } to update array (does not replace); requires string body
 * - PUT: 400 "Body can't be empty" if body falsy; 400 "Body must be a string" if non-string
 * - PUT: 404 "Evolution record not found" if no evolution for patient
 * - Authz via protectRoute + isDoctor: 401 no auth; 403 foreign patient; 404 missing patient
 */

let app: Express

describe('Evolution API', () => {
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

    describe('GET /api/v1/evolutions/:id', () => {
        it('returns 401 without auth', async () => {
            const id = new mongoose.Types.ObjectId().toString()
            const res = await request(app).get(`/api/v1/evolutions/${id}`)

            expect(res.status).toBe(401)
            expect(res.body).toEqual({ message: 'Unauthorized, no token' })
        })

        it('returns 403 for a foreign patient', async () => {
            const doctorA = await registerDoctor(app, 'evo-get-a')
            const doctorB = await registerDoctor(app, 'evo-get-b')
            const patient = await createPatient(doctorB.agent)

            const res = await doctorA.agent.get(`/api/v1/evolutions/${patient._id}`)
            expect(res.status).toBe(403)
            expect(res.body).toEqual({ message: 'Forbidden. Not authorized' })
        })

        it('returns 404 when patient is missing', async () => {
            const { agent } = await registerDoctor(app, 'evo-get-404')
            const missingId = new mongoose.Types.ObjectId().toString()

            const res = await agent.get(`/api/v1/evolutions/${missingId}`)
            expect(res.status).toBe(404)
            expect(res.body).toEqual({ message: 'Id or Patient not found' })
        })

        it('returns array of evolutions for own patient', async () => {
            const { agent } = await registerDoctor(app, 'evo-get-ok')
            const patient = await createPatient(agent)

            const res = await agent.get(`/api/v1/evolutions/${patient._id}`)
            expect(res.status).toBe(200)
            expect(Array.isArray(res.body)).toBe(true)
            expect(res.body).toHaveLength(1)
            expect(String(res.body[0].patient)).toBe(String(patient._id))
            expect(res.body[0].update).toHaveLength(1)
            expect(res.body[0].update[0].body).toBe('Paciente creado')
        })
    })

    describe('PUT /api/v1/evolutions/:id', () => {
        it('returns 401 without auth', async () => {
            const id = new mongoose.Types.ObjectId().toString()
            const res = await request(app)
                .put(`/api/v1/evolutions/${id}`)
                .send({ body: 'Nueva nota' })

            expect(res.status).toBe(401)
            expect(res.body).toEqual({ message: 'Unauthorized, no token' })
        })

        it('returns 403 for a foreign patient', async () => {
            const doctorA = await registerDoctor(app, 'evo-put-a')
            const doctorB = await registerDoctor(app, 'evo-put-b')
            const patient = await createPatient(doctorB.agent)

            const res = await doctorA.agent
                .put(`/api/v1/evolutions/${patient._id}`)
                .send({ body: 'Nueva nota' })
            expect(res.status).toBe(403)
            expect(res.body).toEqual({ message: 'Forbidden. Not authorized' })
        })

        it('returns 404 when patient is missing', async () => {
            const { agent } = await registerDoctor(app, 'evo-put-404')
            const missingId = new mongoose.Types.ObjectId().toString()

            const res = await agent
                .put(`/api/v1/evolutions/${missingId}`)
                .send({ body: 'Nueva nota' })
            expect(res.status).toBe(404)
            expect(res.body).toEqual({ message: 'Id or Patient not found' })
        })

        it('returns 400 when body is empty', async () => {
            const { agent } = await registerDoctor(app, 'evo-put-empty')
            const patient = await createPatient(agent)

            const res = await agent.put(`/api/v1/evolutions/${patient._id}`).send({})
            expect(res.status).toBe(400)
            expect(res.body).toEqual({ message: "Body can't be empty" })

            const emptyString = await agent
                .put(`/api/v1/evolutions/${patient._id}`)
                .send({ body: '' })
            expect(emptyString.status).toBe(400)
            expect(emptyString.body).toEqual({ message: "Body can't be empty" })
        })

        it('returns 400 when body is not a string', async () => {
            const { agent } = await registerDoctor(app, 'evo-put-type')
            const patient = await createPatient(agent)

            const res = await agent
                .put(`/api/v1/evolutions/${patient._id}`)
                .send({ body: { text: 'not a string' } })
            expect(res.status).toBe(400)
            expect(res.body).toEqual({ message: 'Body must be a string' })
        })

        it('returns 404 when evolution record is missing', async () => {
            const { agent } = await registerDoctor(app, 'evo-put-no-evo')
            const patient = await createPatient(agent)
            await Evolution.deleteMany({ patient: patient._id })

            const res = await agent
                .put(`/api/v1/evolutions/${patient._id}`)
                .send({ body: 'Nueva nota' })
            expect(res.status).toBe(404)
            expect(res.body).toEqual({ message: 'Evolution record not found' })
        })

        it('appends a note without replacing existing updates', async () => {
            const { agent } = await registerDoctor(app, 'evo-put-ok')
            const patient = await createPatient(agent)

            const res = await agent
                .put(`/api/v1/evolutions/${patient._id}`)
                .send({ body: 'Control post operatorio' })
            expect(res.status).toBe(200)
            expect(res.body.update).toHaveLength(2)
            expect(res.body.update[0].body).toBe('Paciente creado')
            expect(res.body.update[1].body).toBe('Control post operatorio')

            const stored = await Evolution.findOne({ patient: patient._id })
            expect(stored).not.toBeNull()
            expect(stored!.update).toHaveLength(2)
            expect(stored!.update[0]?.body).toBe('Paciente creado')
            expect(stored!.update[1]?.body).toBe('Control post operatorio')
        })
    })
})
