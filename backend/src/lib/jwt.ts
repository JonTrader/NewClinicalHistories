import { type Response } from 'express'
import jwt from 'jsonwebtoken'
import mongoose from 'mongoose'
import { env } from './env.js'

export const generateToken = (userId: mongoose.Types.ObjectId, res: Response) => {
    const { JWT_SECRET, NODE_ENV } = env
    if (!JWT_SECRET) throw new Error('JWT_SECRET is not set')
    const token = jwt.sign({ userId }, env.JWT_SECRET!, {
        expiresIn: '7d',
    })

    res.cookie('jwt', token, {
        maxAge: 14 * 24 * 60 * 60 * 1000,
        httpOnly: true, // prevents XSS attacks: cross site scripting
        sameSite: 'strict', // CSRF attacks,
        secure: NODE_ENV === 'production'
    })

    return token
}