import express from 'express'
import { protectRoute } from '../middleware/auth.middleware.js'
import { register, login, logout } from '../controllers/auth.controller.js'
import { arcjetProtection } from '../middleware/arcjet.middleware.js'

const router = express.Router()

// router.get('/test', arcjetProtection, (req, res) => {
//     res.send('Hello')
// })

router.use(arcjetProtection)

router.post('/register', register)
router.post('/login', login)
router.post('/logout', logout)
router.get('/check', protectRoute, (req, res) => res.status(200).json(req.user))

export default router