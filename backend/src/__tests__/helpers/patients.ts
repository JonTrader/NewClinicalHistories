import type { Express } from 'express'
import { expect } from 'vitest'
import { registerAndLogin, type AuthAgent } from './auth.js'

let emailSeq = 0

export function uniqueEmail(prefix = 'user'): string {
    emailSeq += 1
    return `${prefix}.${emailSeq}.${Date.now()}@example.com`
}

/** Minimal body that passes Mongoose required fields on Patient. */
export function minimalPatientBody(overrides: Record<string, unknown> = {}) {
    return {
        firstName: 'Ana',
        lastName: 'Garcia',
        medicalHistoryQuestions: ['No refiere'],
        dentalHistoryQuestions: ['No refiere'],
        ...overrides,
    }
}

export async function registerDoctor(app: Express, prefix: string) {
    return registerAndLogin(app, {
        firstName: 'Doc',
        lastName: prefix,
        email: uniqueEmail(prefix),
        password: 'password123',
    })
}

export async function createPatient(
    agent: AuthAgent,
    overrides: Record<string, unknown> = {}
) {
    const res = await agent.post('/api/v1/patients').send(minimalPatientBody(overrides))
    expect(res.status).toBe(201)
    return res.body as { _id: string; doctor?: string; firstName?: string; lastName?: string }
}
