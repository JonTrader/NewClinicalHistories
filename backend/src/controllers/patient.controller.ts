import { type Request, type Response } from 'express'
import Patient from "../models/patient.js";
import Odontogram from "../models/odontogram.js";
import Evolution from "../models/evolution.js";
import teeth from '../lib/odontogram.js'

const DEFAULT_PAGE_SIZE = 20
const MAX_PAGE_SIZE = 100
const MAX_SEARCH_QUERY_LENGTH = 100

const parsePositiveInt = (value: unknown, fallback: number): number => {
    if (typeof value !== 'string') return fallback
    const parsed = parseInt(value, 10)
    return Number.isNaN(parsed) ? fallback : Math.max(1, parsed)
}

function escapeRegex(value: string): string {
    return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

export const searchPatients = async (req: Request, res: Response): Promise<any> => {
    try {
        const { q } = req.query
        const userId = req.user._id

        if (!q || typeof q !== 'string' || q.trim().length === 0) {
            return res.status(400).json({ message: 'Query parameter q is required' })
        }

        const query = q.trim()

        if (query.length > MAX_SEARCH_QUERY_LENGTH) {
            return res.status(400).json({ message: `Query must be at most ${MAX_SEARCH_QUERY_LENGTH} characters` })
        }

        const escapedQuery = escapeRegex(query)
        const regex = { $regex: escapedQuery, $options: 'i' }

        const conditions: any[] = [
            { firstName: regex },
            { lastName: regex },
        ]

        const num = Number(query)
        if (!isNaN(num)) {
            conditions.push({ idNumber: num })
        }

        const patients = await Patient.find({
            doctor: userId,
            $or: conditions
        }).limit(5)

        return res.status(200).json(patients)
    } catch (error) {
        console.error('Error in searchPatients controller: ', error)
        return res.status(500).json({ message: 'Internal server error trying to searchPatients' })
    }
}

export const getAllPatients = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.user._id
        const page = parsePositiveInt(req.query.page, 1)
        const limit = Math.min(MAX_PAGE_SIZE, parsePositiveInt(req.query.limit, DEFAULT_PAGE_SIZE))

        const filter: Record<string, unknown> = { doctor: userId }

        const [total, patients] = await Promise.all([
            Patient.countDocuments(filter),
            Patient.find(filter)
                .sort({ createdAt: -1 })
                .skip((page - 1) * limit)
                .limit(limit)
        ])

        res.status(200).json({
            patients,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit) || 1,
            }
        })
    } catch (error) {
        console.error('Error in getAllPatients controller: ', error)
        res.status(500).json({ message: 'Internal server error trying to getAllPatients' })
    }
}

export const createPatient = async (req: Request, res: Response): Promise<any> => {
    try {
        const userId = req.user._id
        const { firstName, lastName } = req.body
        if (!firstName || !lastName) {
            return res.status(400).json({ message: 'First name and last name are required' })
        }
        const newPatient = new Patient({ ...req.body, doctor: userId })
        const newOdontogram = new Odontogram({
            teeth,
            patient: newPatient._id,
            problemas: Array(4).fill(''),
            tejidosBlandos: Array(14).fill(null)
        })
        const newEvolution = new Evolution({
            patient: newPatient._id
        })
        newEvolution.update.push({ body: 'Paciente creado' })

        await newPatient.save()
        await newOdontogram.save()
        await newEvolution.save()
        return res.status(201).json(newPatient)
    } catch (error) {
        console.error('Error in createPatient controller: ', error)
        return res.status(500).json({ message: 'Internal server error trying to createPatient' })
    }
}

export const editPatient = async (req: Request, res: Response): Promise<any> => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ message: 'No ID retrieved' })
        }
        const patient = await Patient.findByIdAndUpdate(id, { ...req.body }, { new: true })
        return res.status(200).json(patient)
    } catch (error) {
        console.error('Error in editPatient controller: ', error)
        return res.status(500).json({ message: 'Internal server error trying to editPatient' })
    }

}

export const deletePatient = async (req: Request, res: Response): Promise<any> => {
    try {
        const { id } = req.params
        if (!id) {
            return res.status(400).json({ message: 'No ID retrieved' })
        }
        await Patient.findByIdAndDelete(id);
        return res.status(200).json({ message: 'Patient has been deleted' })
    } catch (error) {
        console.error('Error in deletePatient controller: ', error)
        return res.status(500).json({ message: 'Internal server error trying to deletePatient' })
    }
}

export const getPatientDetails = async (req: Request, res: Response): Promise<any> => {
    try {
        const { id } = req.params
        if (!id) {
            return res.status(400).json({ message: 'No ID retrieved' })
        }
        const patient = await Patient.findById(id)
        if (!patient) {
            return res.status(400).json({ message: "No patient found" })
        }
        if (!patient.doctor.equals(req.user._id)) {
            return res.status(400).json({ message: 'You are not allowed to view/edit patient details' })
        }
        return res.status(200).json(patient)
    } catch (error) {
        console.error('Error in getDetails controller: ', error)
        res.status(500).json({ message: 'Internal server error trying to getPatientDetails' })
    }
}