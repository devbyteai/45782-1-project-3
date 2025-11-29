import api from "./api";
import { LoginDTO, RegisterDTO, AuthResponse, TokenPayload } from "../models/User";
import { jwtDecode } from "jwt-decode";

class AuthService {
    async login(credentials: LoginDTO): Promise<AuthResponse> {
        const { data } = await api.post<AuthResponse>('/auth/login', credentials);
        this.setToken(data.token);
        return data;
    }

    async register(userData: RegisterDTO): Promise<AuthResponse> {
        const { data } = await api.post<AuthResponse>('/auth/register', userData);
        this.setToken(data.token);
        return data;
    }

    logout(): void {
        localStorage.removeItem('token');
    }

    getToken(): string | null {
        return localStorage.getItem('token');
    }

    setToken(token: string): void {
        localStorage.setItem('token', token);
    }

    isAuthenticated(): boolean {
        const token = this.getToken();
        if (!token) return false;

        try {
            const decoded = jwtDecode<TokenPayload>(token);
            return decoded.exp * 1000 > Date.now();
        } catch {
            return false;
        }
    }

    getCurrentUser(): TokenPayload | null {
        const token = this.getToken();
        if (!token) return null;

        try {
            const decoded = jwtDecode<TokenPayload>(token);
            if (decoded.exp * 1000 <= Date.now()) {
                this.logout();
                return null;
            }
            return decoded;
        } catch {
            return null;
        }
    }

    isAdmin(): boolean {
        const user = this.getCurrentUser();
        return user?.role === 'admin';
    }
}

export default new AuthService();
