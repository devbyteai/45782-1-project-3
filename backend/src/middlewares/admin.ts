import { Response, NextFunction } from 'express';
import { AuthRequest } from './auth';
import { UserRole } from '../models/User';

export function enforceAdmin(req: AuthRequest, res: Response, next: NextFunction) {
    if (!req.user) {
        return res.status(401).json({
            error: 'Unauthorized',
            message: 'Authentication required'
        });
    }

    if (req.user.role !== UserRole.ADMIN) {
        return res.status(403).json({
            error: 'Forbidden',
            message: 'Admin access required'
        });
    }

    next();
}
