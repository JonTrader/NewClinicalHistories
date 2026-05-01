import mongoose, { Document } from 'mongoose'

export interface IUser extends Document {
    email: string,
    firstName: string,
    lastName: string,
    password: string,
    logo?: string,
    createdAt: Date,
    updatedAt: Date
}

const UserSchema = new mongoose.Schema<IUser>({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    logo: {
        type: String,
        default: ""
    }
}, { timestamps: true })

const User = mongoose.model<IUser>('User', UserSchema)

export default User;