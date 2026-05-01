import mongoose, { Document } from 'mongoose'

interface ITooth extends Document {
    top: string,
    right: string,
    bottom: string,
    left: string,
    center: string,
    description: string,
    number: number
}

export interface IOdontogram extends Document {
    tejidosBlandos: boolean[],
    problemas: string[],
    teeth: ITooth[],
    patient: mongoose.Types.ObjectId
}

const toothSchema = new mongoose.Schema<ITooth>({
    top: String,
    right: String,
    bottom: String,
    left: String,
    center: String,
    description: String,
    number: Number
}, { _id: false })


const OdontogramSchema = new mongoose.Schema<IOdontogram>({
    tejidosBlandos: { type: [Boolean], required: true },
    problemas: { type: [String], required: true },
    teeth: { type: [toothSchema], required: true },
    patient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Patient',
        required: true
    },
})

const Odontogram = mongoose.model<IOdontogram>('Odontogram', OdontogramSchema)
export default Odontogram