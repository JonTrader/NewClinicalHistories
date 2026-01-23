import mongoose from 'mongoose'

const toothSchema = new mongoose.Schema({
    top: String,
    right: String,
    bottom: String,
    left: String,
    center: String,
    description: String,
    number: Number
}, { _id: false })


const OdontogramSchema = new mongoose.Schema({
    tejidosBlandos: [Boolean],
    problemas: [String],
    teeth: [toothSchema],
    patient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Patient',
        required: true
    },
})

const Odontogram = mongoose.model('Odontogram', OdontogramSchema)
export default Odontogram