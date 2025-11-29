import { Request, Response, NextFunction } from 'express';
import { verifyToken, TokenPayload } from '../utils/jwt';

export interface AuthRequest extends Request {
    user?: TokenPayload;
}

export function enforceAuth(req: AuthRequest, res: Response, next: NextFunction) {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return res.status(401).json({
                error: 'Unauthorized',
                message: 'No authorization header provided'
            });
        }

        const parts = authHeader.split(' ');
        if (parts.length !== 2 || parts[0] !== 'Bearer') {
            return res.status(401).json({
                error: 'Unauthorized',
                message: 'Invalid authorization header format. Use: Bearer <token>'
            });
        }

        const token = parts[1];
        const payload = verifyToken(token);

        req.user = payload;
        next();
    } catch (error) {
        return res.status(401).json({
            error: 'Unauthorized',
            message: 'Invalid or expired token'
        });
    }
}

export function optionalAuth(req: AuthRequest, res: Response, next: NextFunction) {
    try {
        const authHeader = req.headers.authorization;

        if (authHeader) {
            const parts = authHeader.split(' ');
            if (parts.length === 2 && parts[0] === 'Bearer') {
                const token = parts[1];
                const payload = verifyToken(token);
                req.user = payload;
            }
        }

        next();
    } catch {
        // Token invalid, but continue without user
        next();
    }
}
