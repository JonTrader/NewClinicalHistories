import 'dotenv/config'

export const env = {
    RESEND_API_KEY: process.env.RESEND_API_KEY,
    MONGO_URI: process.env.MONGO_URI,
    EMAIL_FROM: process.env.EMAIL_FROM,
    EMAIL_FROM_NAME: process.env.EMAIL_FROM_NAME,
    PORT: process.env.PORT
}