import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest'
import request from 'supertest'
import type { Express } from 'express'
import mongoose from 'mongoose'
import { createApp } from '../app.js'
import Evolution from '../models/evolution.js'
import { connectTestDB, clearTestDB, disconnectTestDB } from './helpers/mongodb.js'
import { createPatient, registerDoctor } from './helpers/patients.js'
import { generateContentMock, resetExternalMocks } from './helpers/mocks.js'

/**
 * Current AI controller behavior (do not change product code for these):
 * - POST /api/v1/ai/summary/:id - protectRoute + isDoctor; body { text }
 *   - 400 "No text provided"; 404 "Evolution not found"
 *   - 403 "Not allowed to generate a new summary" when dateOfLastEvolution matches last note
 *     (compared via getTime(), not Date ===)
 *   - After a new evolution note, summary is allowed again (200)
 *   - 200 returns mocked Gemini text string; persists summary on evolution
 * - POST /api/v1/ai/evolution - protectRoute only (no isDoctor, no patient id); body { body: keywords }
 *   - 401 without auth; 400 "No text provided" without body; 200 mocked text string
 */

let app: Express

describe('AI API', () => {
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

    describe('POST /api/v1/ai/summary/:id', () => {
        it('returns 401 without auth', async () => {
            const id = new mongoose.Types.ObjectId().toString()
            const res = await request(app)
                .post(`/api/v1/ai/summary/${id}`)
                .send({ text: 'Notas clinicas' })

            expect(res.status).toBe(401)
            expect(res.body).toEqual({ message: 'Unauthorized, no token' })
        })

        it('returns 403 for a foreign patient', async () => {
            const doctorA = await registerDoctor(app, 'ai-sum-a')
            const doctorB = await registerDoctor(app, 'ai-sum-b')
            const patient = await createPatient(doctorB.agent)

            const res = await doctorA.agent
                .post(`/api/v1/ai/summary/${patient._id}`)
                .send({ text: 'Notas clinicas' })
            expect(res.status).toBe(403)
            expect(res.body).toEqual({ message: 'Forbidden. Not authorized' })
        })

        it('returns 404 when patient is missing', async () => {
            const { agent } = await registerDoctor(app, 'ai-sum-404-pat')
            const missingId = new mongoose.Types.ObjectId().toString()

            const res = await agent
                .post(`/api/v1/ai/summary/${missingId}`)
                .send({ text: 'Notas clinicas' })
            expect(res.status).toBe(404)
            expect(res.body).toEqual({ message: 'Id or Patient not found' })
        })

        it('returns 400 when text is missing', async () => {
            const { agent } = await registerDoctor(app, 'ai-sum-no-text')
            const patient = await createPatient(agent)

            const res = await agent.post(`/api/v1/ai/summary/${patient._id}`).send({})
            expect(res.status).toBe(400)
            expect(res.body).toEqual({ message: 'No text provided' })
            expect(generateContentMock).not.toHaveBeenCalled()
        })

        it('returns 404 when evolution record is missing', async () => {
            const { agent } = await registerDoctor(app, 'ai-sum-no-evo')
            const patient = await createPatient(agent)
            await Evolution.deleteMany({ patient: patient._id })

            const res = await agent
                .post(`/api/v1/ai/summary/${patient._id}`)
                .send({ text: 'Notas clinicas' })
            expect(res.status).toBe(404)
            expect(res.body).toEqual({ message: 'Evolution not found' })
            expect(generateContentMock).not.toHaveBeenCalled()
        })

        it('returns 200 with mocked Gemini text and persists summary', async () => {
            const { agent } = await registerDoctor(app, 'ai-sum-ok')
            const patient = await createPatient(agent)

            const res = await agent
                .post(`/api/v1/ai/summary/${patient._id}`)
                .send({ text: 'Paciente con caries en 18' })
            expect(res.status).toBe(200)
            expect(res.body).toBe('Mock AI summary')
            expect(generateContentMock).toHaveBeenCalledTimes(1)

            const evolution = await Evolution.findOne({ patient: patient._id })
            expect(evolution).not.toBeNull()
            expect(evolution!.summary?.summary).toBe('Mock AI summary')
            expect(evolution!.summary?.dateOfLastEvolution).toBeDefined()
            const lastNote = evolution!.update[evolution!.update.length - 1]
            expect(new Date(evolution!.summary!.dateOfLastEvolution).getTime()).toBe(
                new Date(lastNote!.createdAt!).getTime()
            )
        })

        it('returns 403 when regenerating summary without a new note', async () => {
            const { agent } = await registerDoctor(app, 'ai-sum-again')
            const patient = await createPatient(agent)

            const first = await agent
                .post(`/api/v1/ai/summary/${patient._id}`)
                .send({ text: 'Paciente creado - resumen' })
            expect(first.status).toBe(200)
            expect(first.body).toBe('Mock AI summary')
            expect(generateContentMock).toHaveBeenCalledTimes(1)

            const second = await agent
                .post(`/api/v1/ai/summary/${patient._id}`)
                .send({ text: 'Segundo intento sin nueva nota' })
            expect(second.status).toBe(403)
            expect(second.body).toEqual({ message: 'Not allowed to generate a new summary' })
            expect(generateContentMock).toHaveBeenCalledTimes(1)
        })

        it('allows a new summary after appending an evolution note', async () => {
            const { agent } = await registerDoctor(app, 'ai-sum-new-note')
            const patient = await createPatient(agent)

            const first = await agent
                .post(`/api/v1/ai/summary/${patient._id}`)
                .send({ text: 'Paciente creado - resumen' })
            expect(first.status).toBe(200)
            expect(generateContentMock).toHaveBeenCalledTimes(1)

            const blocked = await agent
                .post(`/api/v1/ai/summary/${patient._id}`)
                .send({ text: 'Sin nueva nota' })
            expect(blocked.status).toBe(403)

            const noteRes = await agent
                .put(`/api/v1/evolutions/${patient._id}`)
                .send({ body: 'Control post operatorio' })
            expect(noteRes.status).toBe(200)

            const afterNote = await agent
                .post(`/api/v1/ai/summary/${patient._id}`)
                .send({ text: 'Resumen con nueva nota' })
            expect(afterNote.status).toBe(200)
            expect(afterNote.body).toBe('Mock AI summary')
            expect(generateContentMock).toHaveBeenCalledTimes(2)
        })
    })

    describe('POST /api/v1/ai/evolution', () => {
        it('returns 401 without auth', async () => {
            const res = await request(app)
                .post('/api/v1/ai/evolution')
                .send({ body: 'exodoncia 14' })

            expect(res.status).toBe(401)
            expect(res.body).toEqual({ message: 'Unauthorized, no token' })
        })

        it('returns 400 when body is missing', async () => {
            const { agent } = await registerDoctor(app, 'ai-evo-no-body')

            const res = await agent.post('/api/v1/ai/evolution').send({})
            expect(res.status).toBe(400)
            expect(res.body).toEqual({ message: 'No text provided' })
            expect(generateContentMock).not.toHaveBeenCalled()
        })

        it('returns 200 with mocked text without requiring a patient', async () => {
            const { agent } = await registerDoctor(app, 'ai-evo-ok')

            const res = await agent
                .post('/api/v1/ai/evolution')
                .send({ body: 'Firma consentimiento, exodoncia 14 y 24' })
            expect(res.status).toBe(200)
            expect(res.body).toBe('Mock AI summary')
            expect(generateContentMock).toHaveBeenCalledTimes(1)
        })
    })
})
