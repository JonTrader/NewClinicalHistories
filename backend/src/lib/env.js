import 'dotenv/config'

export const env = {
    RESEND_API_KEY: process.env.RESEND_API_KEY,
    MONGO_URI: process.env.MONGO_URI,
    EMAIL_FROM: process.env.EMAIL_FROM,
    EMAIL_FROM_NAME: process.env.EMAIL_FROM_NAME,
    PORT: process.env.PORT,
    JWT_SECRET: process.env.JWT_SECRET,
    CLIENT_URL: process.env.CLIENT_URL,
    NODE_ENV: process.env.NODE_ENV,
    ARCJET_ENV: process.env.ARCJET_ENV,
    ARCJET_KEY: process.env.ARCJET_KEY,
    GEMINI_API_KEY: process.env.GEMINI_API_KEY
}