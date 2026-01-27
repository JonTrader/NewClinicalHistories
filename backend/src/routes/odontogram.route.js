import express from 'express'
import { protectRoute } from '../middleware/auth.middleware.js'
import { arcjetProtection } from '../middleware/arcjet.middleware.js'
import { getOdontogram, updateOdontogram } from '../controllers/odontogram.controller.js'

const router = express.Router()

// middlewares execute in order
// ideally rate-limit middleware executes first, then auth middleware
// no reason to auth check then to have route be blocked by rate-limit

router.use(arcjetProtection, protectRoute)

router.get('/:id', getOdontogram)
router.put('/:id', updateOdontogram)

export default router