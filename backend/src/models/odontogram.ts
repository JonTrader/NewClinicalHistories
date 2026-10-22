import mongoose, { type ClientSession, Document, Model } from 'mongoose'
import teeth from '../lib/odontogram.js'

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
    /** null = unset checkbox slot */
    tejidosBlandos: (boolean | null)[],
    problemas: string[],
    teeth: ITooth[],
    patient: mongoose.Types.ObjectId
}

interface IOdontogramModel extends Model<IOdontogram> {
    createForPatient(
        patientId: mongoose.Types.ObjectId | string,
        session?: ClientSession
    ): Promise<IOdontogram>
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

OdontogramSchema.index({ patient: 1 }, { unique: true })

OdontogramSchema.statics.createForPatient = async function (
    patientId: mongoose.Types.ObjectId | string,
    session?: ClientSession
) {
    const doc = {
        teeth,
        patient: patientId,
        problemas: Array(4).fill(''),
        tejidosBlandos: Array(14).fill(null),
    }
    if (session) {
        const created = await this.create([doc], { session })
        const odontogram = created[0]
        if (!odontogram) {
            throw new Error('Odontogram create returned no document')
        }
        return odontogram
    }
    return this.create(doc)
}

const Odontogram = mongoose.model<IOdontogram, IOdontogramModel>('Odontogram', OdontogramSchema)
export default Odontogram
