import Odontogram from "../models/odontogram.js";
import { type Request, type Response } from 'express'

export const getOdontogram = async (req: Request, res: Response):Promise<any> => {
    try {
        const { id } = req.params
        if (!id) {
            return res.status(400).json({ message: 'No ID retrieved' })
        }
        const odontogram = await Odontogram.find({ patient: id })
        return res.status(200).json(odontogram)
    } catch (error) {
        console.error('Error in getEvolution controller: ', error)
        return res.status(500).json({ message: 'Internal server error trying to get odontogram' })
    }
}

export const updateOdontogram = async (req: Request, res: Response):Promise<any> => {
    try {
        const { id } = req.params
        if (!id) {
            return res.status(400).json({ message: 'No ID retrieved' })
        }
        const odontogram = await Odontogram.findOne({ patient: id })
        if (!odontogram) {
            return res.status(400).json({ message: 'No odontogram found'})
        }
        const updatedOdontogram = await Odontogram.findByIdAndUpdate(odontogram._id, { ...req.body }, { new: true })
        return res.status(200).json(updatedOdontogram)
    } catch (error) {
        console.error('Error in updateOdontogram controller: ', error)
        return res.status(500).json({ message: 'Internal server error trying to update odontogram' })
    }
}