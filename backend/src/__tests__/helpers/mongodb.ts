import mongoose from 'mongoose'
import { MongoMemoryReplSet } from 'mongodb-memory-server'

let mongoServer: MongoMemoryReplSet | null = null

/**
 * Start a single-node in-memory MongoDB replica set and connect mongoose.
 * A replica set is required so multi-document transactions work in tests.
 * Do not use connectDB() (it exits on failure).
 */
export async function connectTestDB(): Promise<void> {
    if (mongoose.connection.readyState === 1 && mongoServer) {
        return
    }

    if (mongoose.connection.readyState !== 0) {
        await mongoose.disconnect()
    }
    if (mongoServer) {
        await mongoServer.stop()
        mongoServer = null
    }

    mongoServer = await MongoMemoryReplSet.create({
        replSet: { count: 1 },
    })
    await mongoose.connect(mongoServer.getUri())
}

/** Drop all data between tests while keeping the connection open. */
export async function clearTestDB(): Promise<void> {
    if (mongoose.connection.readyState !== 1) {
        return
    }
    await mongoose.connection.dropDatabase()
}

/** Disconnect mongoose and stop the memory replica set. */
export async function disconnectTestDB(): Promise<void> {
    if (mongoose.connection.readyState !== 0) {
        await mongoose.disconnect()
    }
    if (mongoServer) {
        await mongoServer.stop()
        mongoServer = null
    }
}
