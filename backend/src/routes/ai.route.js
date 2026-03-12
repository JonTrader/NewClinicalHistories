import express from 'express'
import { generateSummary } from '../controllers/ai.controller.js'
import { arcjetProtection } from '../middleware/arcjet.middleware.js'
import { protectRoute } from '../middleware/auth.middleware.js'

const router = express.Router()

router.use(arcjetProtection, protectRoute)

router.post('/summary', generateSummary)

export default router