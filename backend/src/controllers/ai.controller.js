import { GoogleGenAI } from "@google/genai";
import { env } from '../lib/env.js'
import Evolution from '../models/evolution.js'

const { GEMINI_API_KEY } = env
const ai = new GoogleGenAI({
    apiKey: GEMINI_API_KEY
})

export const generateSummary = async (req, res) => {
    const { id } = req.params
    try {
        if (!req.body.text) {
            return res.status(400).json({ message: 'No text provided' })
        }
        if (!id) {
            return res.status(400).json({ message: 'No id provided' })
        }
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-lite',
            contents: `
            Escribe un resumen del texto delimitado por guiones bajos en viñetas. Por cada parrafo del texto, escribe maximo 2-3 viñetas.
            Formatea la respuesta con cada viñeta en una línea separada, terminando cada una con un salto de línea.
            _${req.body.text}_
            `,
            config: {
                temperature: 0.0
            }
        })

        const generatedSummary = response.candidates[0].content.parts[0].text

        const evoResponse = await Evolution.find({ patient: id })
        const evolution = evoResponse[0]
        if (!evolution) {
            return res.status(404).json({ message: 'Evolution not found' })
        }
        evolution.summary = {
            summary: generatedSummary,
            dateOfLastEvolution: new Date(evolution.update[evolution.update.length - 1].createdAt)
        }
        await evolution.save()

        return res.status(200).json(generatedSummary)
    } catch (error) {
        console.error('Error while generating summary by Gemini: ', error)
        res.status(500).json({ message: 'Internal server error trying to generate summary.' })
    }
}

// export const generateEvolution = async (req, res) => {
//     try {
//         if (!req.body.text) {
//             return res.status(400).json({ message: 'No text provided' })
//         }
//         const response = await ai.models.generateContent({
//             model: 'gemini-2.5-flash-lite',
//             contents: `
//             Escribe una evolucion para este paciente segun las palabras claves delimitadas por guiones bajos.
//             _${req.body.text}_
//             `,
//             config: {
//                 temperature: 0.0
//             }
//         })
//         console.log(response.candidates[0].content.parts[0].text)
//         return res.status(200).json(response.candidates[0].content.parts[0].text)
//     } catch (error) {
//         console.error('Error while generating summary by Gemini: ', error)
//         res.status(500).json({ message: 'Internal server error trying to generate summary.' })
//     }
// }