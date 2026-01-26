import Odontogram from "../models/odontogram.js";

export const getOdontogram = async(req, res) => {
    try {
        const { id } = req.params
        if(!id){
            return res.status(400).json({message: 'No id retrieved'})
        }
        const odontogram = await Odontogram.find({ patient: id})
        return res.status(200).json(odontogram)
    } catch (error) {
        
    }
}

export const updateOdontogram = async (req, res) => {
    try {
        const { id } = req.params
        if (!id) {
            return res.status(400).json({ message: 'No odontogram ID found' })
        }
        const odontogram = await Odontogram.find({ patient: id})
        const updatedOdontogram = await Odontogram.findByIdAndUpdate(odontogram[0]._id, {...req.body}, {new: true})
        return res.status(200).json(updatedOdontogram)
    } catch (error) {
        console.error('Error in updateOdontogram controller: ', error)
        return res.status(500).json({ message: 'Internal server error trying to update odontogram'})
    }
}