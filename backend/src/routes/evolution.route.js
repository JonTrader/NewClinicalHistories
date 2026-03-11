import express from 'express'
import { getEvolution, updateEvolution } from '../controllers/evolution.controller.js'
import { protectRoute } from '../middleware/auth.middleware.js'
import { arcjetProtection } from '../middleware/arcjet.middleware.js'

const router = express.Router()

// middlewares execute in order
// ideally rate-limit middleware executes first, then auth middleware
// no reason to auth check then to have route be blocked by rate-limit

router.use(arcjetProtection, protectRoute)

router.get('/:id', getEvolution)

router.put('/:id', updateEvolution)

export default router