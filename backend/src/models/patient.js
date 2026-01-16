import mongoose from 'mongoose'

const PatientSchema = new mongoose.Schema({
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
    identification:
    {
        idType: String,
        idNumber: Number
    },
    gender: String,
    civilStatus: String,
    motive: String,
    bloodType: String,
    eps:
    {
        name: String,
        epsType: String
    },
    contactNumber: String,
    address: String,
    email: String,
    emergencyContact:
    {
        name: String,
        contactNumber: Number,
        relationship: String
    },
    doctor:
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    medicalHistoryQuestions: [String],
    dentalHistoryQuestions: [String],
}, { timestamps: true })

const Patient = mongoose.model('Patient', PatientSchema)

export default Patient