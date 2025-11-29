import api from "./api";
import { Vacation, VacationsResponse, VacationFilters, CreateVacationDTO, UpdateVacationDTO } from "../models/Vacation";

class VacationsService {
    async getAll(filters?: VacationFilters): Promise<VacationsResponse> {
        const params = new URLSearchParams();
        if (filters?.page) params.append('page', filters.page.toString());
        if (filters?.limit) params.append('limit', filters.limit.toString());
        if (filters?.liked) params.append('liked', 'true');
        if (filters?.future) params.append('future', 'true');
        if (filters?.active) params.append('active', 'true');

        const { data } = await api.get<VacationsResponse>(`/vacations?${params.toString()}`);
        return data;
    }

    async getById(id: number): Promise<Vacation> {
        const { data } = await api.get<Vacation>(`/vacations/${id}`);
        return data;
    }

    async create(vacation: CreateVacationDTO): Promise<Vacation> {
        const formData = new FormData();
        formData.append('destination', vacation.destination);
        formData.append('description', vacation.description);
        formData.append('start_date', vacation.start_date);
        formData.append('end_date', vacation.end_date);
        formData.append('price', vacation.price.toString());
        if (vacation.image) {
            formData.append('image', vacation.image);
        }

        const { data } = await api.post<Vacation>('/vacations', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return data;
    }

    async update(id: number, vacation: UpdateVacationDTO): Promise<Vacation> {
        const formData = new FormData();
        formData.append('destination', vacation.destination);
        formData.append('description', vacation.description);
        formData.append('start_date', vacation.start_date);
        formData.append('end_date', vacation.end_date);
        formData.append('price', vacation.price.toString());
        if (vacation.image) {
            formData.append('image', vacation.image);
        }

        const { data } = await api.put<Vacation>(`/vacations/${id}`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return data;
    }

    async delete(id: number): Promise<void> {
        await api.delete(`/vacations/${id}`);
    }

    async like(id: number): Promise<{ vacationId: number; likesCount: number }> {
        const { data } = await api.post(`/vacations/${id}/like`);
        return data;
    }

    async unlike(id: number): Promise<{ vacationId: number; likesCount: number }> {
        const { data } = await api.delete(`/vacations/${id}/like`);
        return data;
    }

    getImageUrl(filename: string): string {
        return `${import.meta.env.VITE_REST_SERVER_URL}/api/vacations/image/${filename}`;
    }
}

export default new VacationsService();
