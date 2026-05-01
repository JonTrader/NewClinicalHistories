import { type Request, type Response } from "express";
import Evolution, { type IEvolution } from "../models/evolution.js";

export const getEvolution = async (req: Request, res: Response):Promise<any> => {
    try {
        const { id } = req.params
        if (!id) {
            return res.status(400).json({ message: 'No ID retrieved' })
        }
        const evolution = await Evolution.find({ patient: id })
        return res.status(200).json(evolution)
    } catch (error) {
        console.error('Error in getEvolution controller: ', error)
        return res.status(500).json({ message: 'Internal server error trying to get evolution' })
    }
}

export const updateEvolution = async (req: Request, res: Response):Promise<any> => {
    try {
        const { id } = req.params
        const { body } = req.body
        if (!id) {
            return res.status(400).json({ message: 'No ID retrieved' })
        }
        if (!body) {
            return res.status(400).json({ message: "Body can't be empty" })
        }
        const evolution: IEvolution | null = await Evolution.findOne({ patient: id })
        if (!evolution) {
            return res.status(404).json({ message: 'Evolution record not found' })
        }
        if (typeof body !== 'string') {
            return res.status(400).json({ message: 'Body must be a string' })
        }

        evolution.update.push({ body })
        await evolution.save()

        return res.status(200).json(evolution)
    } catch (error) {
        console.error('Error in updateEvolution controller: ', error)
        return res.status(500).json({ message: 'Internal server error trying to update evolution' })
    }
}