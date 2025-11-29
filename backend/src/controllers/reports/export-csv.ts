import { Request, Response } from 'express';
import { literal } from 'sequelize';
import Vacation from '../../models/Vacation';

export default async (req: Request, res: Response) => {
    try {
        const vacations = await Vacation.findAll({
            attributes: [
                'destination',
                [
                    literal(`(SELECT COUNT(*) FROM likes WHERE likes.vacation_id = Vacation.id)`),
                    'likes_count'
                ]
            ],
            order: [['destination', 'ASC']]
        });

        // Create CSV content
        const csvHeader = 'Destination,Likes\n';
        const csvRows = vacations.map(vacation => {
            const destination = vacation.destination.replace(/"/g, '""'); // Escape quotes
            const likesCount = vacation.getDataValue('likes_count') || 0;
            return `"${destination}",${likesCount}`;
        }).join('\n');

        const csvContent = csvHeader + csvRows;

        // Set headers for CSV download
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename="vacation-likes-report.csv"');

        res.send(csvContent);
    } catch (error) {
        console.error('Error exporting CSV:', error);
        res.status(500).json({
            error: 'Failed to export CSV',
            message: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};
