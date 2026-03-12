import User from '../models/user.js'
import bcrypt from 'bcryptjs'
import { generateToken } from '../lib/utils.js'
import { sendWelcomeEmail } from '../emails/emailHandler.js'
import { env } from '../lib/env.js'
import cloudinary from '../lib/cloudinary.js'

export const register = async (req, res) => {
    const { firstName, lastName, email, password } = req.body;

    try {
        if (!firstName || !lastName || !email || !password) {
            return res.status(400).json({ message: 'All fields are required' })
        }
        if (password.length < 6) {
            return res.status(400).json({ message: 'Password must be at least 6 characters long' })
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

            const { CLIENT_URL } = env
            try {
                await sendWelcomeEmail(savedUser.email, firstName, CLIENT_URL)
            } catch (error) {
                console.error('Failed to send welcome email: ', error)
            }

            return res.status(201).json({
                _id: newUser._id,
                email: newUser.email,
                firstName: newUser.firstName,
                lastName: newUser.lastName
            })
        } else {
            return res.status(400).json({ message: 'Invalid user data' })
        }
    } catch (error) {
        console.error('Error in register controller: ', error)
        return res.status(500).json({ message: 'Internal server error' })
    }
}

export const login = async (req, res) => {
    const { email, password } = req.body

    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' })
    }

    try {
        const user = await User.findOne({ email })
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' }) // never tell user if email or password is invalid
        }

        const isPasswordValid = await bcrypt.compare(password, user.password)
        if (!isPasswordValid) {
            return res.status(400).json({ message: 'Invalid credentials' }) // never tell user if email or password is invalid
        }

        generateToken(user._id, res)

        return res.status(200).json({
            _id: user._id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            logo: user.logo
        })
    } catch (error) {
        console.error('Error in login controller: ', error)
    }
}

export const logout = async (req, res) => {
    res.cookie('jwt', '', { maxAge: 0 })
    return res.status(200).json({ message: 'Logged out successfully' })
}

export const updateProfile = async (req, res) => {
    const { firstName, lastName, logo } = req.body;
    const userId = req.user._id

    try {
        if (!firstName || !lastName) {
            return res.status(400).json({ message: 'Both first name and last name are required.' })
        }

        const uploadResponse = await cloudinary.uploader.upload(logo);

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { firstName, lastName, logo: uploadResponse.secure_url },
            { new: true }
        )

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' })
        }

        return res.status(200).json({})
    } catch (error) {
        console.error('Error in updateProfile controller: ', error)
        return res.status(500).json({ message: 'Internal server error' })
    }
}