import { type Request, type Response } from 'express'
import Patient from "../models/patient.js";
import Odontogram from "../models/odontogram.js";
import Evolution from "../models/evolution.js";
import teeth from '../lib/odontogram.js'

export const getAllPatients = async (req: Request, res: Response): Promise<any> => {
    try {
        const userId = req.user._id
        const patients = await Patient.find({ doctor: userId })

        return res.status(200).json(patients)
    } catch (error) {
        console.error('Error in getAllPatients controller: ', error)
        return res.status(500).json({ message: 'Internal server error trying to getAllPatients' })
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