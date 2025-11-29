export interface Vacation {
    id: number;
    destination: string;
    description: string;
    start_date: string;
    end_date: string;
    price: number;
    image_filename: string;
    likes_count?: number;
    isLiked?: boolean;
    createdAt?: string;
    updatedAt?: string;
}

export interface CreateVacationDTO {
    destination: string;
    description: string;
    start_date: string;
    end_date: string;
    price: number;
    image?: File;
}

export interface UpdateVacationDTO {
    destination: string;
    description: string;
    start_date: string;
    end_date: string;
    price: number;
    image?: File;
}

export interface VacationsResponse {
    vacations: Vacation[];
    pagination: {
        page: number;
        limit: number;
        totalCount: number;
        totalPages: number;
    };
}

export interface VacationFilters {
    liked?: boolean;
    future?: boolean;
    active?: boolean;
    page?: number;
    limit?: number;
}

export interface LikeUpdateEvent {
    vacationId: number;
    likesCount: number;
}

export interface VacationStats {
    destination: string;
    likesCount: number;
}
