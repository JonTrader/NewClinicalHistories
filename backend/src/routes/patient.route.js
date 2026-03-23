import express from 'express'
import { getAllPatients, createPatient, editPatient, deletePatient, getPatientDetails } from '../controllers/patient.controller.js'
import { protectRoute, isDoctor } from '../middleware/auth.middleware.js'
import { arcjetProtection } from '../middleware/arcjet.middleware.js'

const router = express.Router()

// middlewares execute in order
// ideally rate-limit middleware executes first, then auth middleware
// no reason to auth check then to have route be blocked by rate-limit

router.use(arcjetProtection, protectRoute)

router.get('/', getAllPatients)
router.get('/:id', isDoctor, getPatientDetails)

router.post('/', createPatient)

router.put('/:id', isDoctor, editPatient)

router.delete('/:id', isDoctor, deletePatient)

export default router