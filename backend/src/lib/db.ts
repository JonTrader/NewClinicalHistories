import mongoose from 'mongoose'
import { env } from './env.js'

const connectDB = async () => {
    try {
        const { MONGO_URI } = env;
        if  ( !MONGO_URI ) throw new Error("MONGO_URI is not set")
        await mongoose.connect(MONGO_URI)
        console.log("MongoDB is connected");
    } catch (error) {
        console.log("MongoDB connection error: ", error)
        process.exit(1);
    }
}

export default connectDB;