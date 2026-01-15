import express from 'express'
import path from 'path'
import dotenv from 'dotenv'

import {connectToDatabase} from './lib/db.js'


import authRoutes from './routes/auth.route.js'


const app = express()
const __dirname = path.resolve();
const PORT = process.env.PORT || 3000;

app.use(express.json) // req.body

app.use('/auth', authRoutes)

if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../frontend/dist')))

    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, '../frontend/dist/index.html'))
    })
}

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
    connectToDatabase()
})