import mongoose from 'mongoose'

const EvolutionSchema = new mongoose.Schema({
    body: {
        type: String,
        required: true
    }
}, { timestamps: true })

const Evolution = mongoose.model('Evolution', EvolutionSchema)
export default Evolution