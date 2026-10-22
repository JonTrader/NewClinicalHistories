import request from 'supertest'
import type { Express } from 'express'

export type TestUserCredentials = {
    firstName: string
    lastName: string
    email: string
    password: string
}

export type AuthAgent = ReturnType<typeof request.agent>

export const defaultTestUser: TestUserCredentials = {
    firstName: 'Test',
    lastName: 'User',
    email: 'test.user@example.com',
    password: 'password123',
}

/**
 * Register via Supertest agent so the jwt cookie is kept for subsequent
 * authenticated requests. Prefer unique emails per test when sharing a DB.
 */
export async function registerAndLogin(
    app: Express,
    user: TestUserCredentials = defaultTestUser
): Promise<{ agent: AuthAgent; user: Record<string, unknown> }> {
    const agent = request.agent(app)

    const registerRes = await agent.post('/api/v1/auth/register').send(user)

    if (registerRes.status !== 201) {
        throw new Error(
            `registerAndLogin failed: register=${registerRes.status} body=${JSON.stringify(registerRes.body)}`
        )
    }

    return { agent, user: registerRes.body as Record<string, unknown> }
}

/** Login with an existing user and keep the jwt cookie on the agent. */
export async function loginAs(
    app: Express,
    credentials: Pick<TestUserCredentials, 'email' | 'password'>
): Promise<{ agent: AuthAgent; user: Record<string, unknown> }> {
    const agent = request.agent(app)
    const loginRes = await agent.post('/api/v1/auth/login').send(credentials)

    if (loginRes.status !== 200) {
        throw new Error(
            `loginAs failed: status=${loginRes.status} body=${JSON.stringify(loginRes.body)}`
        )
    }

    return { agent, user: loginRes.body as Record<string, unknown> }
}
