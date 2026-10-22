import mongoose from 'mongoose'
import { MongoMemoryServer } from 'mongodb-memory-server'

let mongoServer: MongoMemoryServer | null = null

/** Start in-memory MongoDB and connect mongoose. Do not use connectDB() (it exits on failure). */
export async function connectTestDB(): Promise<void> {
    if (mongoose.connection.readyState === 1 && mongoServer) {
        return
    }

    if (mongoose.connection.readyState !== 0) {
        await mongoose.disconnect()
    }

    mongoServer = await MongoMemoryServer.create()
    await mongoose.connect(mongoServer.getUri())
}

/** Drop all data between tests while keeping the connection open. */
export async function clearTestDB(): Promise<void> {
    if (mongoose.connection.readyState !== 1) {
        return
    }
    await mongoose.connection.dropDatabase()
}

/** Disconnect mongoose and stop the memory server. */
export async function disconnectTestDB(): Promise<void> {
    if (mongoose.connection.readyState !== 0) {
        await mongoose.disconnect()
    }
    if (mongoServer) {
        await mongoServer.stop()
        mongoServer = null
    }
}
