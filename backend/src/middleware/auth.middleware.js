import jwt from 'jsonwebtoken'
import User from '../models/user.js'
import { env } from '../lib/env.js'

export const protectRoute = async (req, res, next) => {
    try {
        const token = req.cookies.jwt
        if (!token) {
            console.log('No token provided')
            return res.status(401).json({ message: 'Unauthorized' })
        }

        const decoded = jwt.verify(token, env.JWT_SECRET)
        if (!decoded) {
            console.log('Invalid token')
            return res.status(401).json({ message: 'Unauthorized' })
        }
        
        const user = await User.findById(decoded.userId).select('-password')
        if (!user) return res.status(401).json({ message: 'User not found' })

        req.user = user
        next()
    } catch (error) {
        console.error('Error in protectRoute middleware: ', error)
        return res.status(500).json({ message: 'Internal Server Error' })
    }
}