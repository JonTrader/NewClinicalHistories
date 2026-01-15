import User from '../models/user.js'
import bcrypt from 'bcryptjs'
import { generateToken } from '../lib/utils.js'
import { sendWelcomeEmail } from '../emails/emailHandler.js'

export const register = async (req, res) => {
    const { firstName, lastName, email, password } = req.body;

    try {
        if (!firstName || !lastName || !email || !password) {
            return res.status(400).json({ message: 'All fields are required' })
        }
        if (password.length < 6) {
            return res.status(400).json({ message: 'Password must be at least 6 characters' })
        }

        // checks if email is valid: regex
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: 'Invalid email format' })
        }

        // now we find email in database
        const user = await User.findOne({ email })
        if (user) return res.status(400).json({ message: 'Email already exists' })

        // now we encrypt password
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        const newUser = new User({
            email,
            password: hashedPassword,
            firstName,
            lastName
        })
        if (newUser) {
            // save user first, then issue auth cookie
            const savedUser = await newUser.save()
            generateToken(savedUser._id, res)

            res.status(201).json({
                _id: newUser._id,
                email: newUser.email,
                firstName: newUser.firstName,
                lastName: newUser.lastName
            })

            const { CLIENT_URL } = process.env

            try {
                await sendWelcomeEmail(savedUser, firstName, CLIENT_URL)
            } catch (error) {
                console.error('Failed to send welcome email: ', error)
            }
        } else {
            res.status(400).json({ message: 'Invalid user data' })
        }
    } catch (error) {
        console.error('Error in register controller: ', error)
        res.status(500).json({ message: 'Internal server error' })
    }
}