import { Resend } from 'resend'
import { env } from '../env.js'
import { createWelcomeEmailTemplate } from './emailTemplate.js'

const { RESEND_API_KEY, EMAIL_FROM, EMAIL_FROM_NAME } = env
export const resendClient = new Resend(RESEND_API_KEY)

export const sender = {
    email: EMAIL_FROM,
    name: EMAIL_FROM_NAME
}

export const sendWelcomeEmail = async (email: string, name: string, clientURL: string): Promise<void> => {
    const { data, error } = await resendClient.emails.send({
        from: `${sender.name} <${sender.email}>`,
        to: email,
        subject: 'Welcome to Clinical Histories!',
        html: createWelcomeEmailTemplate(name, clientURL)
    })

    if (error) {
        console.error('Error sending welcome email: ', error)
        throw new Error('Failed to send welcome email')
    }

    console.log('Welcome email sent successfully', data)
}