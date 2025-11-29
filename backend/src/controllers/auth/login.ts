import { Request, Response } from 'express';
import User from '../../models/User';
import { comparePassword } from '../../utils/hash';
import { generateToken } from '../../utils/jwt';

export default async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        // Find user by email
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(401).json({
                error: 'Invalid credentials',
                message: 'Email or password is incorrect'
            });
        }

        // Compare password
        const isValidPassword = await comparePassword(password, user.password);
        if (!isValidPassword) {
            return res.status(401).json({
                error: 'Invalid credentials',
                message: 'Email or password is incorrect'
            });
        }

        // Generate JWT token
        const token = generateToken({
            userId: user.id,
            email: user.email,
            role: user.role,
            firstName: user.first_name,
            lastName: user.last_name
        });

        res.json({
            message: 'Login successful',
            user: {
                id: user.id,
                first_name: user.first_name,
                last_name: user.last_name,
                email: user.email,
                role: user.role
            },
            token
        });
    } catch (error) {
        console.error('Error logging in:', error);
        res.status(500).json({
            error: 'Failed to login',
            message: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};
