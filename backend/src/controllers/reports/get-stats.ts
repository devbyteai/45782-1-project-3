import { Request, Response } from 'express';
import { literal } from 'sequelize';
import Vacation from '../../models/Vacation';

export default async (req: Request, res: Response) => {
    try {
        const vacations = await Vacation.findAll({
            attributes: [
                'id',
                'destination',
                [
                    literal(`(SELECT COUNT(*) FROM likes WHERE likes.vacation_id = Vacation.id)`),
                    'likes_count'
                ]
            ],
            order: [['destination', 'ASC']]
        });

        const stats = vacations.map(vacation => ({
            destination: vacation.destination,
            likesCount: vacation.getDataValue('likes_count') || 0
        }));

        res.json(stats);
    } catch (error) {
        console.error('Error fetching vacation stats:', error);
        res.status(500).json({
            error: 'Failed to fetch vacation stats',
            message: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};
