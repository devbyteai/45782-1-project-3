import jwt, { SignOptions } from 'jsonwebtoken';
import config from 'config';
import { UserRole } from '../models/User';

export interface TokenPayload {
    userId: number;
    email: string;
    role: UserRole;
    firstName: string;
    lastName: string;
}

export function generateToken(payload: TokenPayload): string {
    const secret: string = config.get('app.jwtSecret');
    const expiration: string = config.get('app.jwtExpiration');
    const options: SignOptions = { expiresIn: expiration as jwt.SignOptions['expiresIn'] };
    return jwt.sign(payload, secret, options);
}

export function verifyToken(token: string): TokenPayload {
    const secret: string = config.get('app.jwtSecret');
    return jwt.verify(token, secret) as TokenPayload;
}

export function decodeToken(token: string): TokenPayload | null {
    try {
        return jwt.decode(token) as TokenPayload;
    } catch {
        return null;
    }
}
