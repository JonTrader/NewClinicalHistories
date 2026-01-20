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