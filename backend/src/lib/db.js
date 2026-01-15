import mongoose from 'mongoose'
import { env } from './env.js'

export const connectToDatabase = async () => {
    try {
        const {MONGO_URI} = env
        if(!MONGO_URI) throw new Error("MONGO URI is not set")
        const conn = await mongoose.connect(process.env.MONGO_URI)
        console.log('MongoDB connected', conn.connection.host)
    } catch (error) {
        console.error('Error connecting to database: ', error)
        process.exit(1) // 1 status means fail, 0 means success
    }
}