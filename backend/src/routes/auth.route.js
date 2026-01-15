import express from 'express'

import { register } from '../controllers/auth.controller.js'

const router = express.Router()

router.post('/register', register)

router.get('/login', (req, res) => {
    res.send('Login endpoint')
})

router.get('/logout', (req, res) => {
    res.send('Logout endpoint')
})

export default router