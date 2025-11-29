import request from 'supertest';
import express from 'express';
import authRouter from '../../src/routers/auth';

// Create test app
const app = express();
app.use(express.json());
app.use('/api/auth', authRouter);

// Mock the User model
jest.mock('../../src/models/User', () => {
    const mockUser = {
        id: 1,
        first_name: 'Test',
        last_name: 'User',
        email: 'test@test.com',
        password: '$2b$10$abcdefghijklmnopqrstuv', // Mock hashed password
        role: 'user'
    };

    return {
        __esModule: true,
        default: {
            findOne: jest.fn().mockImplementation(({ where }) => {
                if (where.email === 'existing@test.com') {
                    return Promise.resolve(mockUser);
                }
                if (where.email === 'test@test.com') {
                    return Promise.resolve(mockUser);
                }
                return Promise.resolve(null);
            }),
            create: jest.fn().mockImplementation((data) => {
                return Promise.resolve({
                    id: 2,
                    ...data,
                    role: 'user'
                });
            })
        }
    };
});

// Mock bcrypt
jest.mock('bcrypt', () => ({
    hash: jest.fn().mockResolvedValue('$2b$10$hashedpassword'),
    compare: jest.fn().mockImplementation((password, hash) => {
        return Promise.resolve(password === 'validpassword');
    })
}));

// Mock jwt
jest.mock('jsonwebtoken', () => ({
    sign: jest.fn().mockReturnValue('mock-jwt-token'),
    verify: jest.fn().mockReturnValue({ userId: 1 })
}));

describe('Auth Routes Integration Tests', () => {
    describe('POST /api/auth/register', () => {
        describe('Validation errors (422)', () => {
            it('should return 422 when first_name is missing', async () => {
                const response = await request(app)
                    .post('/api/auth/register')
                    .send({
                        last_name: 'User',
                        email: 'test@test.com',
                        password: 'password123'
                    });

                expect(response.status).toBe(422);
            });

            it('should return 422 when last_name is missing', async () => {
                const response = await request(app)
                    .post('/api/auth/register')
                    .send({
                        first_name: 'Test',
                        email: 'test@test.com',
                        password: 'password123'
                    });

                expect(response.status).toBe(422);
            });

            it('should return 422 when email is invalid', async () => {
                const response = await request(app)
                    .post('/api/auth/register')
                    .send({
                        first_name: 'Test',
                        last_name: 'User',
                        email: 'invalid-email',
                        password: 'password123'
                    });

                expect(response.status).toBe(422);
            });

            it('should return 422 when password is too short', async () => {
                const response = await request(app)
                    .post('/api/auth/register')
                    .send({
                        first_name: 'Test',
                        last_name: 'User',
                        email: 'test@test.com',
                        password: '123'
                    });

                expect(response.status).toBe(422);
            });

            it('should return 422 when email is missing', async () => {
                const response = await request(app)
                    .post('/api/auth/register')
                    .send({
                        first_name: 'Test',
                        last_name: 'User',
                        password: 'password123'
                    });

                expect(response.status).toBe(422);
            });

            it('should return 422 when password is missing', async () => {
                const response = await request(app)
                    .post('/api/auth/register')
                    .send({
                        first_name: 'Test',
                        last_name: 'User',
                        email: 'test@test.com'
                    });

                expect(response.status).toBe(422);
            });
        });

        describe('Conflict errors (409)', () => {
            it('should return 409 when email already exists', async () => {
                const response = await request(app)
                    .post('/api/auth/register')
                    .send({
                        first_name: 'Test',
                        last_name: 'User',
                        email: 'existing@test.com',
                        password: 'password123'
                    });

                expect(response.status).toBe(409);
                expect(response.body.error).toBe('Email already exists');
            });
        });

        describe('Happy path (201)', () => {
            it('should return 201 and token when registration is successful', async () => {
                const response = await request(app)
                    .post('/api/auth/register')
                    .send({
                        first_name: 'New',
                        last_name: 'User',
                        email: 'new@test.com',
                        password: 'password123'
                    });

                expect(response.status).toBe(201);
                expect(response.body).toHaveProperty('token');
                expect(response.body).toHaveProperty('user');
                expect(response.body.user).toHaveProperty('id');
                expect(response.body.user).toHaveProperty('email', 'new@test.com');
                expect(response.body.user).not.toHaveProperty('password');
            });
        });
    });

    describe('POST /api/auth/login', () => {
        describe('Validation errors (422)', () => {
            it('should return 422 when email is missing', async () => {
                const response = await request(app)
                    .post('/api/auth/login')
                    .send({
                        password: 'password123'
                    });

                expect(response.status).toBe(422);
            });

            it('should return 422 when password is missing', async () => {
                const response = await request(app)
                    .post('/api/auth/login')
                    .send({
                        email: 'test@test.com'
                    });

                expect(response.status).toBe(422);
            });

            it('should return 422 when email is invalid format', async () => {
                const response = await request(app)
                    .post('/api/auth/login')
                    .send({
                        email: 'invalid-email',
                        password: 'password123'
                    });

                expect(response.status).toBe(422);
            });

            it('should return 422 when password is too short', async () => {
                const response = await request(app)
                    .post('/api/auth/login')
                    .send({
                        email: 'test@test.com',
                        password: '123'
                    });

                expect(response.status).toBe(422);
            });
        });

        describe('Unauthorized errors (401)', () => {
            it('should return 401 when user does not exist', async () => {
                const response = await request(app)
                    .post('/api/auth/login')
                    .send({
                        email: 'nonexistent@test.com',
                        password: 'password123'
                    });

                expect(response.status).toBe(401);
                expect(response.body.error).toBe('Invalid credentials');
            });

            it('should return 401 when password is incorrect', async () => {
                const response = await request(app)
                    .post('/api/auth/login')
                    .send({
                        email: 'test@test.com',
                        password: 'wrongpassword'
                    });

                expect(response.status).toBe(401);
                expect(response.body.error).toBe('Invalid credentials');
            });
        });

        describe('Happy path (200)', () => {
            it('should return 200 and token when login is successful', async () => {
                const response = await request(app)
                    .post('/api/auth/login')
                    .send({
                        email: 'test@test.com',
                        password: 'validpassword'
                    });

                expect(response.status).toBe(200);
                expect(response.body).toHaveProperty('token');
                expect(response.body).toHaveProperty('user');
                expect(response.body.message).toBe('Login successful');
            });
        });
    });
});
