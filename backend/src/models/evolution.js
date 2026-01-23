import mongoose from 'mongoose'

const UpdateSchema = new mongoose.Schema({
    body: {
        type: String,
        required: true
    }
}, { timestamps: true, _id: false })

const EvolutionSchema = new mongoose.Schema({
    update: [UpdateSchema],
    patient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Patient',
        required: true
    },
})

const Evolution = mongoose.model('Evolution', EvolutionSchema)
export default Evolution