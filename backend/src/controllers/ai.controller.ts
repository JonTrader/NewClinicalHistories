import { type Request, type Response } from 'express'
import { GoogleGenAI } from "@google/genai";
import { env } from '../lib/env.js'
import Evolution from '../models/evolution.js'

const { GEMINI_API_KEY } = env
const ai = new GoogleGenAI({
    apiKey: GEMINI_API_KEY
})

export const generateSummary = async (req: Request, res: Response): Promise<any> => {
    try {
        const { id } = req.params
        const { text } = req.body
        if (!text) {
            return res.status(400).json({ message: 'No text provided' })
        }
        if (!id) {
            return res.status(400).json({ message: 'No id provided' })
        }

        const evolution = await Evolution.findOne({ patient: id })
        if (!evolution) {
            return res.status(404).json({ message: 'Evolution not found' })
        }

        const lastUpdate = evolution.update[evolution.update.length - 1]
        if (evolution.summary && evolution.summary?.dateOfLastEvolution === lastUpdate!.createdAt) {
            return res.status(403).json({ message: 'Not allowed to generate a new summary' })
        }

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-lite',
            contents: `
            Resume el texto delimitado por tres guiones bajos. Crea viñetas para los puntos clave del resumen, de 1 a 3 viñetas por párrafo.
            Formatea la respuesta colocando cada viñeta en una línea aparte.
            Proporciona el resumen sin texto previo ni posterior.
            Redacta el resumen en el mismo idioma en que se te proporciona el texto delimitado por tres guiones bajos.
            ___${req.body.text}___
            `,
            config: {
                temperature: 0.0
            }
        })

        if (!response?.candidates?.length
            || !response.candidates[0]?.content?.parts?.length
            || !response.candidates[0].content.parts[0]?.text) {
            return res.status(500).json({ message: 'Invalid response from AI service' })
        }

        const generatedSummary = response.candidates[0].content.parts[0].text
        evolution.summary = {
            summary: generatedSummary,
            dateOfLastEvolution: new Date(lastUpdate!.createdAt!)
        }
        await evolution.save()
        return res.status(200).json(generatedSummary)
    } catch (error) {
        console.error('Error while generating summary by Gemini: ', error)
        res.status(500).json({ message: 'Internal server error trying to generate summary.' })
    }
}

export const generateEvolution = async (req: Request, res: Response): Promise<any> => {
    try {
        if (!req.body.body) {
            return res.status(400).json({ message: 'No text provided' })
        }
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-lite',
            contents: `
            Usted es un odontólogo clínico experto con amplia experiencia en la redacción de notas de evolución de pacientes dentales.
            Su tarea consiste en generar una nota de evolución dental profesional y estructurada a partir de una lista de palabras clave proporcionada por el usuario, delimitadas por tres guiones bajos.
            Proporcione la nota de evolución médica sin texto previo ni posterior.

            Instrucciones:
            1. El usuario proporcionará una lista de palabras clave relacionadas con una consulta clínica dental.
            2. Analice las palabras clave y determine si están relacionadas con la odontología o la atención médica (por ejemplo, números de dientes, procedimientos, síntomas, medicamentos, términos anatómicos, diagnósticos, etc.).
            3. Si las palabras clave no están claramente relacionadas con la odontología o la atención médica (por ejemplo, cocina, deportes, tecnología, etc.), o si la mayoría de ellas no pertenecen a un contexto clínico/dental, NO genere una nota de evolución. En su lugar, responda únicamente con:
            "No fue posible generar una nota sobre la evolución dental. Las palabras clave proporcionadas no parecen estar relacionadas con la odontología ni la atención médica. Por favor, proporcione palabras clave clínicas como síntomas, procedimientos, número de dientes, diagnósticos o medicamentos."
            
            Aqui tienes algunos ejemplos:
            Palabras claves: Firma consentimiento informado, Exodoncia dientes 14 y 24,  4 carpuls de anestesia, refuerzo paladar y papilar
            Nota sobre Evolución dental: Paciente asiste a consulta odontologica programada, previa explicación y firma consentimiento informado de intervenciones quirúrgicas menores, paciente referido de ortodoncia para exodoncia de dientes 14 y 24, se aplica anestesia infiltrativa en la zona de dientes 14 y 24, refuerzo en paladar y papilar, 4 carpules de newcaina 2% E-80, se realiza sindesmotomia, luxación y avulsion de dientes 14 y 24, se revisa alveolo con cureta de Lucas, hemostasia por presión con gasa. Se dan indicaciones y recomendaciones escritas y verbales, se entrega orden de medicamentos, paciente sale en buen estado de salud de la consulta.

            Palabras claves: Firma consentimiento informado de operatoria, anestesia newcaina 1 carpule, Caries oclusal palatina diente 27 , Ionosit , Resina 3M p60 b2
            Nota sobre Evolución dental: Paciente asiste a consulta odontologica programa, previa explicación y firma de consentimiento informado de operatoria, bajo anestesia infiltrativa newcaina 2% E-80 1 carpule, procedo a realizar retiro de caries oclusal palatina de diente 27, lavo, aislo, ácido grabado x30 segundos en esmalte y 15 segundos en dentina, lavado profuso, aislamiento relativo, aplico adhesivo en dos capas, aireo, coloco ionosit como base intermedia, se da morfología con resina 3M P60 B2, fotocurado, realizo pulido de la restauración, chequeo de oclusion e interproximal, se dan indicaciones y recomendaciones escritas y verbales, el paciente sale en buen estado de salud de la consulta.

            Palabras claves: ___${req.body.body}___
            Nota sobre Evolución dental:
            `,
            config: {
                temperature: 0.0
            }
        })

        if (!response?.candidates?.length
            || !response.candidates[0]?.content?.parts?.length
            || !response.candidates[0].content.parts[0]?.text) {
            return res.status(500).json({ message: 'Invalid response from AI service' })
        }
        
        return res.status(200).json(response.candidates[0].content.parts[0].text)
    } catch (error) {
        console.error('Error while generating summary by Gemini: ', error)
        res.status(500).json({ message: 'Internal server error trying to generate summary.' })
    }
}