import express from 'express'
import { getAllPatients, createPatient, editPatient, deletePatient, getPatientDetails } from '../controllers/patient.controller.js'
import { getEvolution, updateEvolution } from '../controllers/evolution.controller.js'
import { protectRoute } from '../middleware/auth.middleware.js'
import { arcjetProtection } from '../middleware/arcjet.middleware.js'
import { getOdontogram, updateOdontogram } from '../controllers/odontogram.controller.js'

const router = express.Router()

// middlewares execute in order
// ideally rate-limit middleware executes first, then auth middleware
// no reason to auth check then to have route be blocked by rate-limit

router.use(arcjetProtection, protectRoute)

router.get('/', getAllPatients)
router.get('/:id', getPatientDetails)

router.post('/', createPatient)

router.put('/:id', editPatient)

router.delete('/:id', deletePatient)

export default router