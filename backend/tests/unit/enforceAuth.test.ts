import { Request, Response, NextFunction } from 'express';
import { enforceAuth, AuthRequest } from '../../src/middlewares/auth';
import * as jwt from '../../src/utils/jwt';

// Mock the jwt utils
jest.mock('../../src/utils/jwt');

describe('enforceAuth middleware', () => {
    let mockRequest: Partial<AuthRequest>;
    let mockResponse: Partial<Response>;
    let mockNext: NextFunction;
    let jsonMock: jest.Mock;
    let statusMock: jest.Mock;

    beforeEach(() => {
        jsonMock = jest.fn();
        statusMock = jest.fn().mockReturnValue({ json: jsonMock });

        mockRequest = {
            headers: {}
        };

        mockResponse = {
            status: statusMock,
            json: jsonMock
        };

        mockNext = jest.fn();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('should pass (call next)', () => {
        it('when valid Bearer token is provided', () => {
            const mockPayload = {
                userId: 1,
                email: 'test@test.com',
                role: 'user' as const,
                firstName: 'Test',
                lastName: 'User'
            };

            mockRequest.headers = {
                authorization: 'Bearer valid-token'
            };

            (jwt.verifyToken as jest.Mock).mockReturnValue(mockPayload);

            enforceAuth(
                mockRequest as AuthRequest,
                mockResponse as Response,
                mockNext
            );

            expect(jwt.verifyToken).toHaveBeenCalledWith('valid-token');
            expect(mockRequest.user).toEqual(mockPayload);
            expect(mockNext).toHaveBeenCalled();
            expect(statusMock).not.toHaveBeenCalled();
        });
    });

    describe('should return 401', () => {
        it('when no authorization header is provided', () => {
            mockRequest.headers = {};

            enforceAuth(
                mockRequest as AuthRequest,
                mockResponse as Response,
                mockNext
            );

            expect(statusMock).toHaveBeenCalledWith(401);
            expect(jsonMock).toHaveBeenCalledWith({
                error: 'Unauthorized',
                message: 'No authorization header provided'
            });
            expect(mockNext).not.toHaveBeenCalled();
        });

        it('when authorization header is empty', () => {
            mockRequest.headers = {
                authorization: ''
            };

            enforceAuth(
                mockRequest as AuthRequest,
                mockResponse as Response,
                mockNext
            );

            expect(statusMock).toHaveBeenCalledWith(401);
            expect(mockNext).not.toHaveBeenCalled();
        });

        it('when authorization header does not start with Bearer', () => {
            mockRequest.headers = {
                authorization: 'Basic some-token'
            };

            enforceAuth(
                mockRequest as AuthRequest,
                mockResponse as Response,
                mockNext
            );

            expect(statusMock).toHaveBeenCalledWith(401);
            expect(jsonMock).toHaveBeenCalledWith({
                error: 'Unauthorized',
                message: 'Invalid authorization header format. Use: Bearer <token>'
            });
            expect(mockNext).not.toHaveBeenCalled();
        });

        it('when Bearer token format is invalid (no token)', () => {
            mockRequest.headers = {
                authorization: 'Bearer'
            };

            enforceAuth(
                mockRequest as AuthRequest,
                mockResponse as Response,
                mockNext
            );

            expect(statusMock).toHaveBeenCalledWith(401);
            expect(mockNext).not.toHaveBeenCalled();
        });

        it('when token verification fails', () => {
            mockRequest.headers = {
                authorization: 'Bearer invalid-token'
            };

            (jwt.verifyToken as jest.Mock).mockImplementation(() => {
                throw new Error('Invalid token');
            });

            enforceAuth(
                mockRequest as AuthRequest,
                mockResponse as Response,
                mockNext
            );

            expect(statusMock).toHaveBeenCalledWith(401);
            expect(jsonMock).toHaveBeenCalledWith({
                error: 'Unauthorized',
                message: 'Invalid or expired token'
            });
            expect(mockNext).not.toHaveBeenCalled();
        });

        it('when token is expired', () => {
            mockRequest.headers = {
                authorization: 'Bearer expired-token'
            };

            (jwt.verifyToken as jest.Mock).mockImplementation(() => {
                throw new Error('jwt expired');
            });

            enforceAuth(
                mockRequest as AuthRequest,
                mockResponse as Response,
                mockNext
            );

            expect(statusMock).toHaveBeenCalledWith(401);
            expect(jsonMock).toHaveBeenCalledWith({
                error: 'Unauthorized',
                message: 'Invalid or expired token'
            });
            expect(mockNext).not.toHaveBeenCalled();
        });
    });
});
