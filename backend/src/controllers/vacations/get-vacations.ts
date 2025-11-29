import { Response } from 'express';
import { Op, fn, col, literal } from 'sequelize';
import Vacation from '../../models/Vacation';
import Like from '../../models/Like';
import { AuthRequest } from '../../middlewares/auth';

export default async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?.userId;
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const offset = (page - 1) * limit;

        // Filter options
        const likedOnly = req.query.liked === 'true';
        const futureOnly = req.query.future === 'true';
        const activeOnly = req.query.active === 'true';

        const today = new Date().toISOString().split('T')[0];

        // Build where clause
        const whereClause: any = {};

        if (futureOnly) {
            whereClause.start_date = { [Op.gt]: today };
        }

        if (activeOnly) {
            whereClause.start_date = { [Op.lte]: today };
            whereClause.end_date = { [Op.gte]: today };
        }

        // Get vacations with likes count
        let vacations: any[];
        let totalCount: number;

        if (likedOnly && userId) {
            // Get only liked vacations
            const likedVacationIds = await Like.findAll({
                where: { user_id: userId },
                attributes: ['vacation_id']
            });
            const ids = likedVacationIds.map(l => l.vacation_id);

            if (ids.length === 0) {
                return res.json({
                    vacations: [],
                    pagination: {
                        page,
                        limit,
                        totalCount: 0,
                        totalPages: 0
                    }
                });
            }

            whereClause.id = { [Op.in]: ids };
        }

        // Count total
        totalCount = await Vacation.count({ where: whereClause });

        // Fetch vacations
        vacations = await Vacation.findAll({
            where: whereClause,
            order: [['start_date', 'ASC']],
            limit,
            offset,
            attributes: {
                include: [
                    [
                        literal(`(SELECT COUNT(*) FROM likes WHERE likes.vacation_id = Vacation.id)`),
                        'likes_count'
                    ]
                ]
            }
        });

        // Get user's liked vacations
        let userLikes: number[] = [];
        if (userId) {
            const likes = await Like.findAll({
                where: { user_id: userId },
                attributes: ['vacation_id']
            });
            userLikes = likes.map(l => l.vacation_id);
        }

        // Add isLiked flag to each vacation
        const vacationsWithLikeStatus = vacations.map(vacation => ({
            ...vacation.toJSON(),
            isLiked: userLikes.includes(vacation.id)
        }));

        res.json({
            vacations: vacationsWithLikeStatus,
            pagination: {
                page,
                limit,
                totalCount,
                totalPages: Math.ceil(totalCount / limit)
            }
        });
    } catch (error) {
        console.error('Error fetching vacations:', error);
        res.status(500).json({
            error: 'Failed to fetch vacations',
            message: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};
