import express from 'express'

import { protectRoute } from '../middleware/auth.middleware.js'
import { register, login, logout } from '../controllers/auth.controller.js'

const router = express.Router()

router.post('/register', register)
router.post('/login', login)
router.post('/logout', logout)
router.get('/hello', (req, res) => {
    res.send('Hello')
})

router.get('/check', protectRoute, (req, res) => res.status(200).json(req.user))

export default router