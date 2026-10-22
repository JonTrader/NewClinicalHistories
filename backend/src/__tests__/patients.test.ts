import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest'
import request from 'supertest'
import type { Express } from 'express'
import mongoose from 'mongoose'
import { createApp } from '../app.js'
import Odontogram from '../models/odontogram.js'
import Evolution from '../models/evolution.js'
import { connectTestDB, clearTestDB, disconnectTestDB } from './helpers/mongodb.js'
import { minimalPatientBody, registerDoctor } from './helpers/patients.js'
import { resetExternalMocks } from './helpers/mocks.js'

/**
 * Current patient controller / isDoctor behavior (do not change product code for these):
 * - POST create: 401 without auth; 400 "First name and last name are required" if missing names
 * - POST create: doctor is forced to caller even if body includes another doctor id
 * - POST create: also creates Odontogram (32 teeth) and Evolution with first note "Paciente creado"
 * - GET list: scoped to caller's patients; default limit 20; limit capped at 100
 * - GET search: 400 if q missing/empty; 400 if q > 100 chars; own patients only; numeric q matches idNumber
 * - isDoctor on get/update/delete: 403 foreign patient; 404 missing id / patient not found
 * - isDoctor: invalid ObjectId -> 404 "Id or Patient not found"
 * - DELETE: removes patient; post findOneAndDelete hook cascades Odontogram + Evolution
 * - PUT: body.doctor is ignored; ownership stays with the original doctor
 */

let app: Express

describe('Patients API', () => {
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

    describe('POST /api/v1/patients', () => {
        it('returns 401 without auth', async () => {
            const res = await request(app).post('/api/v1/patients').send(minimalPatientBody())

            expect(res.status).toBe(401)
            expect(res.body).toEqual({ message: 'Unauthorized, no token' })
        })

        it('returns 400 when firstName or lastName is missing', async () => {
            const { agent } = await registerDoctor(app, 'create-missing')

            const missingFirst = await agent.post('/api/v1/patients').send({
                lastName: 'Garcia',
                medicalHistoryQuestions: ['No refiere'],
                dentalHistoryQuestions: ['No refiere'],
            })
            expect(missingFirst.status).toBe(400)
            expect(missingFirst.body).toEqual({
                message: 'First name and last name are required',
            })

            const missingLast = await agent.post('/api/v1/patients').send({
                firstName: 'Ana',
                medicalHistoryQuestions: ['No refiere'],
                dentalHistoryQuestions: ['No refiere'],
            })
            expect(missingLast.status).toBe(400)
            expect(missingLast.body).toEqual({
                message: 'First name and last name are required',
            })
        })

        it('creates patient forcing doctor to caller, with odontogram and evolution', async () => {
            const { agent, user } = await registerDoctor(app, 'create-ok')
            const otherDoctorId = new mongoose.Types.ObjectId().toString()

            const res = await agent.post('/api/v1/patients').send(
                minimalPatientBody({
                    doctor: otherDoctorId,
                    idNumber: 123456789,
                })
            )

            expect(res.status).toBe(201)
            expect(res.body.firstName).toBe('Ana')
            expect(res.body.lastName).toBe('Garcia')
            expect(String(res.body.doctor)).toBe(String(user._id))
            expect(String(res.body.doctor)).not.toBe(otherDoctorId)

            const patientId = res.body._id
            const odontogram = await Odontogram.findOne({ patient: patientId })
            expect(odontogram).not.toBeNull()
            expect(odontogram!.teeth).toHaveLength(32)

            const evolution = await Evolution.findOne({ patient: patientId })
            expect(evolution).not.toBeNull()
            expect(evolution!.update).toHaveLength(1)
            expect(evolution!.update[0]?.body).toBe('Paciente creado')
        })
    })

    describe('GET /api/v1/patients', () => {
        it('returns only the caller\'s patients', async () => {
            const doctorA = await registerDoctor(app, 'list-a')
            const doctorB = await registerDoctor(app, 'list-b')

            const own = await doctorA.agent
                .post('/api/v1/patients')
                .send(minimalPatientBody({ firstName: 'Own', lastName: 'Patient' }))
            expect(own.status).toBe(201)

            const foreign = await doctorB.agent
                .post('/api/v1/patients')
                .send(minimalPatientBody({ firstName: 'Foreign', lastName: 'Patient' }))
            expect(foreign.status).toBe(201)

            const res = await doctorA.agent.get('/api/v1/patients')
            expect(res.status).toBe(200)
            expect(res.body.patients).toHaveLength(1)
            expect(res.body.patients[0]._id).toBe(own.body._id)
            expect(res.body.patients[0].firstName).toBe('Own')
            expect(
                res.body.patients.some((p: { _id: string }) => p._id === foreign.body._id)
            ).toBe(false)
        })

        it('defaults page size to 20 and caps limit at 100', async () => {
            const { agent } = await registerDoctor(app, 'list-page')

            const created = await agent
                .post('/api/v1/patients')
                .send(minimalPatientBody({ firstName: 'Page', lastName: 'One' }))
            expect(created.status).toBe(201)

            const defaults = await agent.get('/api/v1/patients')
            expect(defaults.status).toBe(200)
            expect(defaults.body.pagination).toMatchObject({
                page: 1,
                limit: 20,
                total: 1,
                totalPages: 1,
            })

            const capped = await agent.get('/api/v1/patients').query({ limit: 200 })
            expect(capped.status).toBe(200)
            expect(capped.body.pagination.limit).toBe(100)
            expect(capped.body.pagination.page).toBe(1)
            expect(capped.body.pagination.total).toBe(1)
        })
    })

    describe('GET /api/v1/patients/search', () => {
        it('returns 400 when q is missing or empty', async () => {
            const { agent } = await registerDoctor(app, 'search-empty')

            const missing = await agent.get('/api/v1/patients/search')
            expect(missing.status).toBe(400)
            expect(missing.body).toEqual({ message: 'Query parameter q is required' })

            const empty = await agent.get('/api/v1/patients/search').query({ q: '   ' })
            expect(empty.status).toBe(400)
            expect(empty.body).toEqual({ message: 'Query parameter q is required' })
        })

        it('returns 400 when q is longer than 100 characters', async () => {
            const { agent } = await registerDoctor(app, 'search-long')
            const q = 'a'.repeat(101)

            const res = await agent.get('/api/v1/patients/search').query({ q })
            expect(res.status).toBe(400)
            expect(res.body).toEqual({
                message: 'Query must be at most 100 characters',
            })
        })

        it('matches own patients by name and excludes other doctors\' patients', async () => {
            const doctorA = await registerDoctor(app, 'search-a')
            const doctorB = await registerDoctor(app, 'search-b')

            const own = await doctorA.agent
                .post('/api/v1/patients')
                .send(minimalPatientBody({ firstName: 'Camila', lastName: 'Ruiz' }))
            expect(own.status).toBe(201)

            const foreign = await doctorB.agent
                .post('/api/v1/patients')
                .send(minimalPatientBody({ firstName: 'Camila', lastName: 'Other' }))
            expect(foreign.status).toBe(201)

            const res = await doctorA.agent.get('/api/v1/patients/search').query({ q: 'Camila' })
            expect(res.status).toBe(200)
            expect(Array.isArray(res.body)).toBe(true)
            expect(res.body).toHaveLength(1)
            expect(res.body[0]._id).toBe(own.body._id)
            expect(
                res.body.some((p: { _id: string }) => p._id === foreign.body._id)
            ).toBe(false)
        })

        it('matches own patient by idNumber when q is numeric', async () => {
            const doctorA = await registerDoctor(app, 'search-id-a')
            const doctorB = await registerDoctor(app, 'search-id-b')
            const idNumber = 987654321

            const own = await doctorA.agent
                .post('/api/v1/patients')
                .send(minimalPatientBody({ firstName: 'Id', lastName: 'Match', idNumber }))
            expect(own.status).toBe(201)

            await doctorB.agent
                .post('/api/v1/patients')
                .send(minimalPatientBody({ firstName: 'Id', lastName: 'Foreign', idNumber }))

            const res = await doctorA.agent
                .get('/api/v1/patients/search')
                .query({ q: String(idNumber) })
            expect(res.status).toBe(200)
            expect(res.body).toHaveLength(1)
            expect(res.body[0]._id).toBe(own.body._id)
            expect(res.body[0].idNumber).toBe(idNumber)
        })
    })

    describe('isDoctor authz on GET/PUT/DELETE /api/v1/patients/:id', () => {
        it('returns 403 for a foreign patient', async () => {
            const doctorA = await registerDoctor(app, 'authz-a')
            const doctorB = await registerDoctor(app, 'authz-b')

            const created = await doctorB.agent
                .post('/api/v1/patients')
                .send(minimalPatientBody({ firstName: 'Foreign', lastName: 'Authz' }))
            expect(created.status).toBe(201)
            const id = created.body._id

            const getRes = await doctorA.agent.get(`/api/v1/patients/${id}`)
            expect(getRes.status).toBe(403)
            expect(getRes.body).toEqual({ message: 'Forbidden. Not authorized' })

            const putRes = await doctorA.agent
                .put(`/api/v1/patients/${id}`)
                .send({ firstName: 'Hacked' })
            expect(putRes.status).toBe(403)
            expect(putRes.body).toEqual({ message: 'Forbidden. Not authorized' })

            const delRes = await doctorA.agent.delete(`/api/v1/patients/${id}`)
            expect(delRes.status).toBe(403)
            expect(delRes.body).toEqual({ message: 'Forbidden. Not authorized' })
        })

        it('returns 404 when patient id is missing from DB', async () => {
            const { agent } = await registerDoctor(app, 'authz-404')
            const missingId = new mongoose.Types.ObjectId().toString()

            const getRes = await agent.get(`/api/v1/patients/${missingId}`)
            expect(getRes.status).toBe(404)
            expect(getRes.body).toEqual({ message: 'Id or Patient not found' })

            const putRes = await agent.put(`/api/v1/patients/${missingId}`).send({ firstName: 'X' })
            expect(putRes.status).toBe(404)
            expect(putRes.body).toEqual({ message: 'Id or Patient not found' })

            const delRes = await agent.delete(`/api/v1/patients/${missingId}`)
            expect(delRes.status).toBe(404)
            expect(delRes.body).toEqual({ message: 'Id or Patient not found' })
        })

        it('returns 404 for invalid ObjectId', async () => {
            const { agent } = await registerDoctor(app, 'authz-invalid')
            const invalidId = 'not-a-valid-objectid'

            const getRes = await agent.get(`/api/v1/patients/${invalidId}`)
            expect(getRes.status).toBe(404)
            expect(getRes.body).toEqual({ message: 'Id or Patient not found' })
        })
    })

    describe('DELETE /api/v1/patients/:id', () => {
        it('removes patient and cascades odontogram and evolution', async () => {
            const { agent } = await registerDoctor(app, 'delete-ok')

            const created = await agent
                .post('/api/v1/patients')
                .send(minimalPatientBody({ firstName: 'Delete', lastName: 'Me' }))
            expect(created.status).toBe(201)
            const patientId = created.body._id

            expect(await Odontogram.findOne({ patient: patientId })).not.toBeNull()
            expect(await Evolution.findOne({ patient: patientId })).not.toBeNull()

            const delRes = await agent.delete(`/api/v1/patients/${patientId}`)
            expect(delRes.status).toBe(200)
            expect(delRes.body).toEqual({ message: 'Patient has been deleted' })

            const getRes = await agent.get(`/api/v1/patients/${patientId}`)
            expect(getRes.status).toBe(404)

            expect(await Odontogram.findOne({ patient: patientId })).toBeNull()
            expect(await Evolution.findOne({ patient: patientId })).toBeNull()
        })
    })

    describe('PUT /api/v1/patients/:id mass-assignment / ownership transfer', () => {
        it('does not transfer ownership when body includes doctor', async () => {
            const doctorA = await registerDoctor(app, 'mass-a')
            const doctorB = await registerDoctor(app, 'mass-b')

            const created = await doctorA.agent
                .post('/api/v1/patients')
                .send(minimalPatientBody({ firstName: 'Transfer', lastName: 'Me' }))
            expect(created.status).toBe(201)
            const patientId = created.body._id
            expect(String(created.body.doctor)).toBe(String(doctorA.user._id))

            const updateRes = await doctorA.agent.put(`/api/v1/patients/${patientId}`).send({
                doctor: doctorB.user._id,
                firstName: 'Renamed',
                lastName: 'Me',
                medicalHistoryQuestions: ['No refiere'],
                dentalHistoryQuestions: ['No refiere'],
            })

            expect(updateRes.status).toBe(200)
            expect(String(updateRes.body.doctor)).toBe(String(doctorA.user._id))
            expect(updateRes.body.firstName).toBe('Renamed')

            const getAsA = await doctorA.agent.get(`/api/v1/patients/${patientId}`)
            expect(getAsA.status).toBe(200)
            expect(String(getAsA.body.doctor)).toBe(String(doctorA.user._id))
            expect(getAsA.body.firstName).toBe('Renamed')

            const getAsB = await doctorB.agent.get(`/api/v1/patients/${patientId}`)
            expect(getAsB.status).toBe(403)
            expect(getAsB.body).toEqual({ message: 'Forbidden. Not authorized' })
        })
    })
})
