import Evolution from "../models/evolution.js";

export const getEvolution = async (req, res) => {
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

export const updateEvolution = async (req, res) => {
    try {
        const { id } = req.params
        const { body } = req.body
        if (!id) {
            return res.status(400).json({ message: 'No ID retrieved' })
        }
        const evolution = await Evolution.find({ patient: id })
        evolution[0].update.push({ body: body })
        await evolution[0].save()

        return res.status(200).json(evolution)
    } catch (error) {
        console.error('Error in updateEvolution controller: ', error)
        return res.status(500).json({ message: 'Internal server error trying to update evolution' })
    }
}