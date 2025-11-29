import { Request, Response } from 'express';
import Vacation from '../../models/Vacation';

export default async (req: Request, res: Response) => {
    try {
        const vacationId = parseInt(req.params.id);
        const { destination, description, start_date, end_date, price, image_filename } = req.body;

        if (isNaN(vacationId)) {
            return res.status(400).json({
                error: 'Invalid vacation ID',
                message: 'Vacation ID must be a valid number'
            });
        }

        // Find vacation
        const vacation = await Vacation.findByPk(vacationId);
        if (!vacation) {
            return res.status(404).json({
                error: 'Vacation not found',
                message: `Vacation with ID ${vacationId} does not exist`
            });
        }

        // Update vacation (past dates allowed for editing)
        const updateData: any = {
            destination,
            description,
            start_date,
            end_date,
            price
        };

        // Only update image if a new one is provided
        if (image_filename) {
            updateData.image_filename = image_filename;
        }

        await vacation.update(updateData);

        res.json(vacation);
    } catch (error) {
        console.error('Error updating vacation:', error);
        res.status(500).json({
            error: 'Failed to update vacation',
            message: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};
