import mongoose, { type ClientSession, Document, Model } from 'mongoose'

export interface IUpdate {
    body: string,
    createdAt?: Date,
    updatedAt?: Date
}

interface ISummary {
    summary: string,
    dateOfLastEvolution: Date
}

export interface IEvolution extends Document {
    update: IUpdate[],
    summary?: ISummary,
    patient: mongoose.Types.ObjectId,
}

interface IEvolutionModel extends Model<IEvolution> {
    createForPatient(
        patientId: mongoose.Types.ObjectId | string,
        session?: ClientSession
    ): Promise<IEvolution>
}

const UpdateSchema = new mongoose.Schema<IUpdate>({
    body: {
        type: String,
        required: true
    }
}, { timestamps: true, _id: false })

const SummarySchema = new mongoose.Schema<ISummary>({
    summary: String,
    dateOfLastEvolution: Date
}, { _id: false})

const EvolutionSchema = new mongoose.Schema<IEvolution>({
    update: [UpdateSchema],
    summary: SummarySchema,
    patient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Patient',
        required: true
    },
})

EvolutionSchema.index({ patient: 1 }, { unique: true })

EvolutionSchema.statics.createForPatient = async function (
    patientId: mongoose.Types.ObjectId | string,
    session?: ClientSession
) {
    const doc = {
        patient: patientId,
        update: [{ body: 'Paciente creado' }],
    }
    if (session) {
        const created = await this.create([doc], { session })
        const evolution = created[0]
        if (!evolution) {
            throw new Error('Evolution create returned no document')
        }
        return evolution
    }
    return this.create(doc)
}

const Evolution = mongoose.model<IEvolution, IEvolutionModel>('Evolution', EvolutionSchema)
export default Evolution
