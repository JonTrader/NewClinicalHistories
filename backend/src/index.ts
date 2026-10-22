import { env } from './lib/env.js'
import connectDB from './lib/db.js'
import { createApp } from './app.js'

const app = createApp()
const PORT = env.PORT || 3000

const start = async () => {
    await connectDB()
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`)
    })
}

start().catch(error => {
    console.error('Failed to start server: ', error)
    process.exit(1)
})
