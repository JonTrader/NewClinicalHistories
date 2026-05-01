import { type NextFunction, type Request, type Response } from "express";
import jwt from 'jsonwebtoken'
import User from '../models/user.js'
import Patient from '../models/patient.js'
import { env } from '../lib/env.js'

declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

export const protectRoute = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.cookies.jwt
        if (!token) {
            return res.status(401).json({ message: 'Unauthorized, no token' })
        }

        const decoded = jwt.verify(token, env.JWT_SECRET) as { userId: string }
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

export const isDoctor = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const patient = await Patient.findById(id)
        if (!id || !patient) {
            return res.status(404).json({ message: 'Id or Patient not found'})
        }
        if (!patient.doctor.equals(req.user._id)) {
            return res.status(403).json({ message: 'Forbidden. Not authorized' })
        }
        next()
    } catch (error) {
        console.error('Error in isDoctor middleware: ', error)
        return res.status(500).json({message: 'Internal Server Error'})
    }
}