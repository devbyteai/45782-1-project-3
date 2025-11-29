export type UserRole = 'user' | 'admin';

export interface User {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    role: UserRole;
    createdAt?: string;
    updatedAt?: string;
}

export interface LoginDTO {
    email: string;
    password: string;
}

export interface RegisterDTO {
    first_name: string;
    last_name: string;
    email: string;
    password: string;
}

export interface AuthResponse {
    message: string;
    user: User;
    token: string;
}

export interface TokenPayload {
    userId: number;
    email: string;
    role: UserRole;
    firstName: string;
    lastName: string;
    exp: number;
    iat: number;
}
