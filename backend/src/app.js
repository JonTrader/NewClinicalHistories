import express from 'express'





import authRoutes from './routes/auth.route.js'


const app = express()
const PORT = 3000;

app.use('/auth', authRoutes)

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})