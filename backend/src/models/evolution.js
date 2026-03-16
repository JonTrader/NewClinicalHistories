import mongoose from 'mongoose'

const UpdateSchema = new mongoose.Schema({
    body: {
        type: String,
        required: true
    }
}, { timestamps: true, _id: false })

const SummarySchema = new mongoose.Schema({
    summary: String,
    dateOfLastEvolution: Date
}, { _id: false})

const EvolutionSchema = new mongoose.Schema({
    update: [UpdateSchema],
    summary: SummarySchema,
    patient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Patient',
        required: true
    },
})

const Evolution = mongoose.model('Evolution', EvolutionSchema)
export default Evolution