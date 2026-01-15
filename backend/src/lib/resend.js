import { Resend } from 'resend'
import { env } from './env.js'

const { RESEND_API_KEY, EMAIL_FROM, EMAIL_FROM_NAME } = env
export const resendClient = new Resend(RESEND_API_KEY)

export const sender = {
    email: EMAIL_FROM,
    name: EMAIL_FROM_NAME
}