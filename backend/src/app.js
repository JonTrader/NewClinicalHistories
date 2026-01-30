import express from 'express'
import path from 'path'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import { env } from './lib/env.js'
import { connectToDatabase } from './lib/db.js'
import authRoutes from './routes/auth.route.js'
import patientRoutes from './routes/patient.route.js'
import odontogramRoutes from './routes/odontogram.route.js'
import evolutionRoutes from './routes/evolution.route.js'


const app = express()
const __dirname = path.resolve();
const PORT = env.PORT || 3000;

app.use(express.json()) // req.body
app.use(cookieParser())
app.use(cors({
    origin: env.CLIENT_URL,
    credentials: true
}))

app.use('/api/v1/auth', authRoutes)
app.use('/api/v1/patients', patientRoutes)
app.use('/api/v1/odontograms', odontogramRoutes)
app.use('/api/v1/evolutions', evolutionRoutes)

if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../frontend/dist')))

    app.all('/*', (req, res) => {
        res.sendFile(path.join(__dirname, '../frontend/dist/index.html'))
    })
}

const start = async () => {
    await connectToDatabase()
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`)
    })
}

start().catch(error => {
    console.error('Failed to start server: ', error)
    process.exit(1)
})

