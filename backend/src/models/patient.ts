import mongoose, { Document } from 'mongoose'
import Odontogram from './odontogram.js'
import Evolution from './evolution.js'

export interface IPatient extends Document {
    firstName: string,
    lastName: string,
    dob?: string,
    birthPlace?: string,
    idType?: string,
    idNumber?: number,
    gender?: string,
    civilStatus?: string,
    motive?: string,
    bloodType?: string,
    epsName?: string,
    epsType?: string,
    contactNumber?: string,
    address?: string,
    email?: string,
    emergencyContactName?: string,
    emergencyContactNumber?: number,
    emergencyContactRelationship?: string,
    medicalHistoryQuestions: string[],
    dentalHistoryQuestions: string[],
    doctor: mongoose.Types.ObjectId
}

const PatientSchema = new mongoose.Schema<IPatient>({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    dob: String,
    birthPlace: String,
    idType: String,
    idNumber: Number,
    gender: String,
    civilStatus: String,
    motive: String,
    bloodType: String,
    epsName: String,
    epsType: String,
    contactNumber: String,
    address: String,
    email: String,
    emergencyContactName: String,
    emergencyContactNumber: Number,
    emergencyContactRelationship: String,
    medicalHistoryQuestions: {
        type: [String],
        required: true
    },
    dentalHistoryQuestions: {
        type: [String],
        required: true
    },
    doctor: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    }
}, { timestamps: true })

PatientSchema.post('findOneAndDelete', async function (doc) {
    if (doc) {
        await Odontogram.deleteOne({
            patient: doc._id
        })
        await Evolution.deleteOne({
            patient: doc._id
        })
    }
})

const Patient = mongoose.model<IPatient>('Patient', PatientSchema)

export default Patient