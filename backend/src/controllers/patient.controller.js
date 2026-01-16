import Patient from "../models/patient.js";
import User from "../models/user.js";

export const getAllPatients = async (req, res) => {
    try {
        const userId = req.user._id
        const patients = await Patient.find({ doctor: userId })

        return res.status(200).json(patients)
    } catch (error) {
        console.error('Error in getAllPatients controller: ', error)
        return res.status(500).json({ message: 'Internal server error trying to getAllPatients' })
    }
}

export const createPatient = async (req, res) => {
    try {
        const userId = req.user._id
        const newPatient = new Patient(req.body)
        newPatient.doctor = userId

        await newPatient.save()
        return res.status(201).json(newPatient)
    } catch (error) {
        console.error('Error in createPatient controller: ', error)
        return res.status(500).json({ message: 'Internal server error trying to createPatient' })
    }
}

export const editPatient = async (req, res) => {
    try {
        const { id } = req.params;
        const patient = await Patient.findByIdAndUpdate(id, {...req.body})
        return res.status(200).json(patient)
    } catch (error) {
        console.error('Error in editPatient controller: ', error)
        return res.status(500).json({ message: 'Internal server error trying to editPatient' })
    }

}

export const deletePatient = async (req, res) => {
    try {
        const { id } = req.params
        await Patient.findByIdAndDelete(id);
        return res.status(200).json({ message: 'Patient has been deleted' })
    } catch (error) {
        console.error('Error in deletePatient controller: ', error)
        return res.status(500).json({ message: 'Internal server error trying to deletePatient' })
    }
}