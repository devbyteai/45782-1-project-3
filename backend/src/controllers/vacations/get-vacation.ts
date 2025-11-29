import { Response } from 'express';
import { literal } from 'sequelize';
import Vacation from '../../models/Vacation';
import Like from '../../models/Like';
import { AuthRequest } from '../../middlewares/auth';

export default async (req: AuthRequest, res: Response) => {
    try {
        const vacationId = parseInt(req.params.id);
        const userId = req.user?.userId;

        if (isNaN(vacationId)) {
            return res.status(400).json({
                error: 'Invalid vacation ID',
                message: 'Vacation ID must be a valid number'
            });
        }

        const vacation = await Vacation.findByPk(vacationId, {
            attributes: {
                include: [
                    [
                        literal(`(SELECT COUNT(*) FROM likes WHERE likes.vacation_id = Vacation.id)`),
                        'likes_count'
                    ]
                ]
            }
        });

        if (!vacation) {
            return res.status(404).json({
                error: 'Vacation not found',
                message: `Vacation with ID ${vacationId} does not exist`
            });
        }

        // Check if user likes this vacation
        let isLiked = false;
        if (userId) {
            const like = await Like.findOne({
                where: { user_id: userId, vacation_id: vacationId }
            });
            isLiked = !!like;
        }

        res.json({
            ...vacation.toJSON(),
            isLiked
        });
    } catch (error) {
        console.error('Error fetching vacation:', error);
        res.status(500).json({
            error: 'Failed to fetch vacation',
            message: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};
