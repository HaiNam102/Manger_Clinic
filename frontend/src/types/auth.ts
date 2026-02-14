export type UserRole = 'PATIENT' | 'DOCTOR' | 'ADMIN';

export interface User {
    id: string;
    email: string;
    fullName?: string;
    role: UserRole;
    avatarUrl?: string;
}

export interface AuthResponse {
    accessToken: string;
    refreshToken: string;
    user: User;
}

export interface ApiResponse<T> {
    code: number;
    message: string;
    result: T;
}
