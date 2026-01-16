import express from 'express'
import { getAllPatients, createPatient, editPatient, deletePatient } from '../controllers/patient.controller.js'
import { protectRoute } from '../middleware/auth.middleware.js'
import { arcjetProtection } from '../middleware/arcjet.middleware.js'

const router = express.Router()

router.get('/', (req, res) => {
    res.send('Patients route')
})

// middlewares execute in order
// ideally rate-limit middleware executes first, then auth middleware
// no reason to auth check then to have route be blocked by rate-limit

router.use(arcjetProtection, protectRoute)

router.get('/allPatients', getAllPatients)
router.post('/createPatient', createPatient)
router.put('/editPatient/:id', editPatient)
router.delete('/deletePatient/:id', deletePatient)

export default router