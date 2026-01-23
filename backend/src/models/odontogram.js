import mongoose from 'mongoose'


const OdontogramSchema = new mongoose.Schema({
    tejidosBlandos: [Boolean],
    problemas: [String],
    teeth: [{
        top: String,
        right: String,
        bottom: String,
        left: String,
        center: String,
        description: String,
        number: Number
    }, {_id: false}]
})

const Odontogram = mongoose.model('Odontogram', OdontogramSchema)
export default Odontogram