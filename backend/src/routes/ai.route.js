import express from 'express'
import { generateSummary, generateEvolution } from '../controllers/ai.controller.js'
import { arcjetProtection } from '../middleware/arcjet.middleware.js'
import { protectRoute } from '../middleware/auth.middleware.js'

const router = express.Router()

router.use(arcjetProtection, protectRoute)

router.post('/summary/:id', generateSummary)
router.post('/evolution', generateEvolution)

export default router