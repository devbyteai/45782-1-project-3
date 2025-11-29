import { io, Socket } from "socket.io-client";
import { LikeUpdateEvent } from "../models/Vacation";

class SocketService {
    private socket: Socket | null = null;
    private listeners: Map<string, Set<(data: any) => void>> = new Map();

    connect(): void {
        if (this.socket?.connected) return;

        this.socket = io(import.meta.env.VITE_REST_SERVER_URL, {
            transports: ['websocket', 'polling']
        });

        this.socket.on('connect', () => {
            console.log('Socket connected');
        });

        this.socket.on('disconnect', () => {
            console.log('Socket disconnected');
        });

        // Forward events to registered listeners
        this.socket.on('vacation-like-update', (data: LikeUpdateEvent) => {
            this.notifyListeners('vacation-like-update', data);
        });
    }

    disconnect(): void {
        if (this.socket) {
            this.socket.disconnect();
            this.socket = null;
        }
    }

    onLikeUpdate(callback: (data: LikeUpdateEvent) => void): () => void {
        return this.addListener('vacation-like-update', callback);
    }

    private addListener(event: string, callback: (data: any) => void): () => void {
        if (!this.listeners.has(event)) {
            this.listeners.set(event, new Set());
        }
        this.listeners.get(event)!.add(callback);

        // Return unsubscribe function
        return () => {
            this.listeners.get(event)?.delete(callback);
        };
    }

    private notifyListeners(event: string, data: any): void {
        this.listeners.get(event)?.forEach(callback => callback(data));
    }
}

export default new SocketService();
