import { Response } from 'express';
import Vacation from '../../models/Vacation';
import Like from '../../models/Like';
import { AuthRequest } from '../../middlewares/auth';
import { getIO } from '../../services/socket';

export default async (req: AuthRequest, res: Response) => {
    try {
        const vacationId = parseInt(req.params.id);
        const userId = req.user?.userId;

        if (!userId) {
            return res.status(401).json({
                error: 'Unauthorized',
                message: 'User must be logged in to unlike vacations'
            });
        }

        if (isNaN(vacationId)) {
            return res.status(400).json({
                error: 'Invalid vacation ID',
                message: 'Vacation ID must be a valid number'
            });
        }

        // Check if vacation exists
        const vacation = await Vacation.findByPk(vacationId);
        if (!vacation) {
            return res.status(404).json({
                error: 'Vacation not found',
                message: `Vacation with ID ${vacationId} does not exist`
            });
        }

        // Check if liked
        const existingLike = await Like.findOne({
            where: { user_id: userId, vacation_id: vacationId }
        });

        if (!existingLike) {
            return res.status(404).json({
                error: 'Not liked',
                message: 'You have not liked this vacation'
            });
        }

        // Delete like
        await existingLike.destroy();

        // Get updated likes count
        const likesCount = await Like.count({
            where: { vacation_id: vacationId }
        });

        // Emit socket event for real-time update
        const io = getIO();
        if (io) {
            io.emit('vacation-like-update', {
                vacationId,
                likesCount
            });
        }

        res.json({
            message: 'Successfully unliked vacation',
            vacationId,
            likesCount
        });
    } catch (error) {
        console.error('Error unliking vacation:', error);
        res.status(500).json({
            error: 'Failed to unlike vacation',
            message: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};
