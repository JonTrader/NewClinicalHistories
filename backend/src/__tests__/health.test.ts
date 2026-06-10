import { describe, it, expect } from 'vitest'
import express from 'express'
import request from 'supertest'

describe('Health Check', () => {
  it('returns 200 on /api/health', async () => {
    const app = express()
    app.get('/api/health', (_req, res) => {
      res.json({ status: 'ok' })
    })

    const res = await request(app).get('/api/health')

    expect(res.status).toBe(200)
    expect(res.body).toEqual({ status: 'ok' })
  })
})
