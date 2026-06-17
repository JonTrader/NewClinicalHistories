import { type Request, type Response, type NextFunction} from 'express'
import { isSpoofedBot } from '@arcjet/inspect'
import aj, { ajSearch } from '../lib/arcjet.js'

function handleArcjetDecision(decision: any, res: Response, next: NextFunction) {
    if (decision.isDenied()) {
        if (decision.reason.isRateLimit()) {
            return res.status(429).json({ message: 'Rate limit exceeded. Please try again later.' })
        } else if (decision.reason.isBot()) {
            return res.status(403).json({ message: 'Bot access is denied.' })
        } else {
            return res.status(403).json({ message: 'Access denied by security policy.' })
        }
    }

    if (decision.results.some(isSpoofedBot)) {
        return res.status(403).json({
            error: 'Spoofed bot detected.',
            message: 'Malicious bot activity detected.'
        })
    }
    next()
}

export const arcjetProtection = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const decision = await aj.protect(req)
        handleArcjetDecision(decision, res, next)
    } catch (error) {
        console.error('Arcjet protection error:', error)
        next()
    }
}

export const searchArcjetProtection = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const decision = await ajSearch.protect(req)
        handleArcjetDecision(decision, res, next)
    } catch (error) {
        console.error('Arcjet search protection error:', error)
        next()
    }
}