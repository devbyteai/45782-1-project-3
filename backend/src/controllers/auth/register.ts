import { Request, Response } from 'express';
import User from '../../models/User';
import { hashPassword } from '../../utils/hash';
import { generateToken } from '../../utils/jwt';

export default async (req: Request, res: Response) => {
    try {
        const { first_name, last_name, email, password } = req.body;

        // Check if email already exists
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(409).json({
                error: 'Email already exists',
                message: 'A user with this email address already exists'
            });
        }

        // Hash password
        const hashedPassword = await hashPassword(password);

        // Create new user
        const user = await User.create({
            first_name,
            last_name,
            email,
            password: hashedPassword
        });

        // Generate JWT token
        const token = generateToken({
            userId: user.id,
            email: user.email,
            role: user.role,
            firstName: user.first_name,
            lastName: user.last_name
        });

        res.status(201).json({
            message: 'User registered successfully',
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
        console.error('Error registering user:', error);
        res.status(500).json({
            error: 'Failed to register user',
            message: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};
