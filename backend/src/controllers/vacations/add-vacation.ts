import { Request, Response } from 'express';
import Vacation from '../../models/Vacation';

export default async (req: Request, res: Response) => {
    try {
        const { destination, description, start_date, end_date, price, image_filename } = req.body;

        // Validate start date is not in the past
        const today = new Date().toISOString().split('T')[0];
        if (start_date < today) {
            return res.status(422).json({
                error: 'Invalid start date',
                message: 'Start date cannot be in the past'
            });
        }

        // Create new vacation
        const vacation = await Vacation.create({
            destination,
            description,
            start_date,
            end_date,
            price,
            image_filename: image_filename || 'default.jpg'
        });

        res.status(201).json(vacation);
    } catch (error) {
        console.error('Error creating vacation:', error);
        res.status(500).json({
            error: 'Failed to create vacation',
            message: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};
