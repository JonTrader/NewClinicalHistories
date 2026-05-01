import mongoose, { Document } from 'mongoose'

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

const Evolution = mongoose.model<IEvolution>('Evolution', EvolutionSchema)
export default Evolution