import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest'
import request from 'supertest'
import type { Express } from 'express'
import { createApp } from '../app.js'
import User from '../models/user.js'
import { connectTestDB, clearTestDB, disconnectTestDB } from './helpers/mongodb.js'
import { registerAndLogin, loginAs, defaultTestUser } from './helpers/auth.js'
import { sendWelcomeEmailMock, resetExternalMocks } from './helpers/mocks.js'

/**
 * Current auth controller / protectRoute behavior (do not change product code for these):
 * - Register: missing fields -> 400 "All fields are required"
 * - Register: password < 6 -> 400 "Password must be at least 6 characters long"
 * - Register: bad email -> 400 "Invalid email format"
 * - Register: duplicate -> 400 "Email already exists"
 * - Login missing fields -> 400 "Email and password are required"
 * - Login unknown email / bad password -> 400 "Invalid credentials" (same message)
 * - Logout does not require auth; clears jwt cookie (maxAge 0)
 * - protectRoute: no cookie -> 401 "Unauthorized, no token"
 * - protectRoute: user deleted -> 401 "User not found"
 * - protectRoute: invalid JWT -> 401 "Unauthorized, invalid token"
 * - Login catch (unexpected errors) -> 500 JSON (not covered by a dedicated test; hard to force without flaking)
 */

let app: Express
let emailSeq = 0

function uniqueEmail(prefix = 'auth'): string {
    emailSeq += 1
    return `${prefix}.${emailSeq}.${Date.now()}@example.com`
}

function getSetCookieHeader(res: request.Response): string[] {
    const raw = res.headers['set-cookie']
    if (!raw) return []
    return Array.isArray(raw) ? raw : [raw]
}

function expectJwtHttpOnlyCookie(res: request.Response): void {
    const cookies = getSetCookieHeader(res)
    const jwtCookie = cookies.find((c) => c.startsWith('jwt='))
    expect(jwtCookie).toBeDefined()
    expect(jwtCookie!.toLowerCase()).toContain('httponly')
    // Non-empty token value (not a cleared cookie)
    expect(jwtCookie).toMatch(/^jwt=[^;]+/)
    const value = jwtCookie!.split(';')[0]?.slice('jwt='.length) ?? ''
    expect(value.length).toBeGreaterThan(0)
}

describe('Auth API', () => {
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

    describe('POST /api/v1/auth/register', () => {
        it('returns 400 when required fields are missing', async () => {
            const res = await request(app).post('/api/v1/auth/register').send({
                firstName: 'Ada',
                email: uniqueEmail(),
            })

            expect(res.status).toBe(400)
            expect(res.body).toEqual({ message: 'All fields are required' })
        })

        it('returns 400 when password is shorter than 6 characters', async () => {
            const res = await request(app).post('/api/v1/auth/register').send({
                firstName: 'Ada',
                lastName: 'Lovelace',
                email: uniqueEmail(),
                password: '12345',
            })

            expect(res.status).toBe(400)
            expect(res.body).toEqual({
                message: 'Password must be at least 6 characters long',
            })
        })

        it('returns 400 for invalid email format', async () => {
            const res = await request(app).post('/api/v1/auth/register').send({
                firstName: 'Ada',
                lastName: 'Lovelace',
                email: 'not-an-email',
                password: 'password123',
            })

            expect(res.status).toBe(400)
            expect(res.body).toEqual({ message: 'Invalid email format' })
        })

        it('returns 400 when email already exists', async () => {
            const email = uniqueEmail('dup')
            const user = {
                firstName: 'Ada',
                lastName: 'Lovelace',
                email,
                password: 'password123',
            }

            const first = await request(app).post('/api/v1/auth/register').send(user)
            expect(first.status).toBe(201)

            const second = await request(app).post('/api/v1/auth/register').send(user)
            expect(second.status).toBe(400)
            expect(second.body).toEqual({ message: 'Email already exists' })
        })

        it('returns 201, user body, and httpOnly jwt cookie on success', async () => {
            const email = uniqueEmail('ok')
            const payload = {
                firstName: 'Ada',
                lastName: 'Lovelace',
                email,
                password: 'password123',
            }

            const res = await request(app).post('/api/v1/auth/register').send(payload)

            expect(res.status).toBe(201)
            expect(res.body).toMatchObject({
                email,
                firstName: 'Ada',
                lastName: 'Lovelace',
            })
            expect(res.body._id).toBeDefined()
            expect(res.body.password).toBeUndefined()
            expectJwtHttpOnlyCookie(res)
            expect(sendWelcomeEmailMock).toHaveBeenCalledTimes(1)
            expect(sendWelcomeEmailMock).toHaveBeenCalledWith(
                email,
                'Ada',
                expect.any(String)
            )
        })

        it('still returns 201 when welcome email send fails', async () => {
            sendWelcomeEmailMock.mockRejectedValueOnce(new Error('smtp unavailable'))

            const email = uniqueEmail('emailfail')
            const res = await request(app).post('/api/v1/auth/register').send({
                firstName: 'Ada',
                lastName: 'Lovelace',
                email,
                password: 'password123',
            })

            expect(res.status).toBe(201)
            expect(res.body.email).toBe(email)
            expect(sendWelcomeEmailMock).toHaveBeenCalledTimes(1)
        })
    })

    describe('POST /api/v1/auth/login', () => {
        it('returns 200 with user body and httpOnly jwt cookie on success', async () => {
            const email = uniqueEmail('login')
            const password = 'password123'
            await request(app).post('/api/v1/auth/register').send({
                firstName: 'Ada',
                lastName: 'Lovelace',
                email,
                password,
            })
            resetExternalMocks()

            const res = await request(app).post('/api/v1/auth/login').send({
                email,
                password,
            })

            expect(res.status).toBe(200)
            expect(res.body).toMatchObject({
                email,
                firstName: 'Ada',
                lastName: 'Lovelace',
            })
            expect(res.body._id).toBeDefined()
            expectJwtHttpOnlyCookie(res)
        })

        it('returns 400 with Invalid credentials for unknown email', async () => {
            const res = await request(app).post('/api/v1/auth/login').send({
                email: uniqueEmail('nobody'),
                password: 'password123',
            })

            expect(res.status).toBe(400)
            expect(res.body).toEqual({ message: 'Invalid credentials' })
        })

        it('returns 400 with Invalid credentials for bad password', async () => {
            const email = uniqueEmail('badpass')
            await request(app).post('/api/v1/auth/register').send({
                firstName: 'Ada',
                lastName: 'Lovelace',
                email,
                password: 'password123',
            })

            const res = await request(app).post('/api/v1/auth/login').send({
                email,
                password: 'wrong-password',
            })

            expect(res.status).toBe(400)
            expect(res.body).toEqual({ message: 'Invalid credentials' })
        })

        it('returns 400 when email or password is missing', async () => {
            const res = await request(app).post('/api/v1/auth/login').send({
                email: uniqueEmail(),
            })

            expect(res.status).toBe(400)
            expect(res.body).toEqual({ message: 'Email and password are required' })
        })
    })

    describe('GET /api/v1/auth/check', () => {
        it('returns 200 with user when jwt cookie is present', async () => {
            const email = uniqueEmail('check')
            const { agent, user } = await registerAndLogin(app, {
                ...defaultTestUser,
                email,
            })

            const res = await agent.get('/api/v1/auth/check')

            expect(res.status).toBe(200)
            expect(res.body).toMatchObject({
                _id: user._id,
                email,
                firstName: defaultTestUser.firstName,
                lastName: defaultTestUser.lastName,
            })
            expect(res.body.password).toBeUndefined()
        })

        it('returns 401 without cookie', async () => {
            const res = await request(app).get('/api/v1/auth/check')

            expect(res.status).toBe(401)
            expect(res.body).toEqual({ message: 'Unauthorized, no token' })
        })

        it('returns 401 when user was deleted after cookie was issued', async () => {
            const email = uniqueEmail('deleted')
            const { agent, user } = await registerAndLogin(app, {
                ...defaultTestUser,
                email,
            })

            await User.findByIdAndDelete(user._id)

            const res = await agent.get('/api/v1/auth/check')

            expect(res.status).toBe(401)
            expect(res.body).toEqual({ message: 'User not found' })
        })

        it('returns 401 for an invalid jwt cookie', async () => {
            const res = await request(app)
                .get('/api/v1/auth/check')
                .set('Cookie', ['jwt=not-a-valid-jwt'])

            expect(res.status).toBe(401)
            expect(res.body).toEqual({ message: 'Unauthorized, invalid token' })
        })
    })

    describe('POST /api/v1/auth/logout', () => {
        it('clears jwt so subsequent check fails', async () => {
            const email = uniqueEmail('logout')
            const { agent } = await registerAndLogin(app, {
                ...defaultTestUser,
                email,
            })

            const checkBefore = await agent.get('/api/v1/auth/check')
            expect(checkBefore.status).toBe(200)

            const logoutRes = await agent.post('/api/v1/auth/logout')
            expect(logoutRes.status).toBe(200)
            expect(logoutRes.body).toEqual({ message: 'Logged out successfully' })

            const cookies = getSetCookieHeader(logoutRes)
            const jwtCookie = cookies.find((c) => c.startsWith('jwt='))
            expect(jwtCookie).toBeDefined()
            expect(jwtCookie!.toLowerCase()).toMatch(/max-age=0/)

            const checkAfter = await agent.get('/api/v1/auth/check')
            expect(checkAfter.status).toBe(401)
            expect(checkAfter.body).toEqual({ message: 'Unauthorized, no token' })
        })

        it('does not require auth', async () => {
            const res = await request(app).post('/api/v1/auth/logout')

            expect(res.status).toBe(200)
            expect(res.body).toEqual({ message: 'Logged out successfully' })
        })
    })

    describe('POST /api/v1/auth/login via loginAs helper', () => {
        it('reuses an existing user and keeps jwt for authenticated requests', async () => {
            const email = uniqueEmail('helper')
            const password = 'password123'
            await request(app).post('/api/v1/auth/register').send({
                firstName: 'Ada',
                lastName: 'Lovelace',
                email,
                password,
            })

            const { agent } = await loginAs(app, { email, password })
            const res = await agent.get('/api/v1/auth/check')

            expect(res.status).toBe(200)
            expect(res.body.email).toBe(email)
        })
    })
})
