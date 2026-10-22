import { vi } from 'vitest'
import type { Request, Response, NextFunction } from 'express'

/**
 * Module-boundary mocks so importing createApp() does not hit live Arcjet,
 * Resend, Cloudinary, or Gemini. Shared via Vitest setupFiles.
 *
 * Spies are hoisted so later tests can import and assert on them.
 */

const hoisted = vi.hoisted(() => ({
    sendWelcomeEmailMock: vi.fn().mockResolvedValue(undefined),
    cloudinaryUploadMock: vi.fn().mockResolvedValue({
        secure_url: 'https://res.cloudinary.com/test/image/upload/v1/test.jpg',
    }),
    generateContentMock: vi.fn().mockResolvedValue({
        candidates: [
            {
                content: {
                    parts: [{ text: 'Mock AI summary' }],
                },
            },
        ],
    }),
}))

export const sendWelcomeEmailMock = hoisted.sendWelcomeEmailMock
export const cloudinaryUploadMock = hoisted.cloudinaryUploadMock
export const generateContentMock = hoisted.generateContentMock

vi.mock('../../middleware/arcjet.middleware.js', () => ({
    arcjetProtection: (_req: Request, _res: Response, next: NextFunction) => next(),
    searchArcjetProtection: (_req: Request, _res: Response, next: NextFunction) => next(),
}))

vi.mock('../../lib/email/resend.js', () => ({
    resendClient: {
        emails: {
            send: vi.fn().mockResolvedValue({ data: { id: 'test-email-id' }, error: null }),
        },
    },
    sender: {
        email: 'test@example.com',
        name: 'Test Clinical Histories',
    },
    sendWelcomeEmail: hoisted.sendWelcomeEmailMock,
}))

vi.mock('../../lib/cloudinary.js', () => ({
    default: {
        config: vi.fn(),
        uploader: {
            upload: hoisted.cloudinaryUploadMock,
        },
    },
}))

vi.mock('@google/genai', () => {
    class GoogleGenAI {
        models = {
            generateContent: hoisted.generateContentMock,
        }
    }
    return { GoogleGenAI }
})

/** Reset mock call history between tests (keeps implementations). */
export function resetExternalMocks(): void {
    sendWelcomeEmailMock.mockClear()
    cloudinaryUploadMock.mockClear()
    generateContentMock.mockClear()
}
