import { Request, Response } from 'express';
import Vacation from '../../models/Vacation';

export default async (req: Request, res: Response) => {
    try {
        const vacationId = parseInt(req.params.id);

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

        // Delete vacation (followers will be deleted via CASCADE)
        await vacation.destroy();

        res.json({
            message: 'Vacation deleted successfully',
            deletedId: vacationId
        });
    } catch (error) {
        console.error('Error deleting vacation:', error);
        res.status(500).json({
            error: 'Failed to delete vacation',
            message: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};
