// ============================================
// ClinicPro - Type Definitions
// ============================================

// User & Auth Types
export interface User {
    id: string;
    email: string;
    fullName: string;
    phone?: string;
    avatar?: string;
    role: UserRole;
    isActive: boolean;
    createdAt: string;
}

export type UserRole = 'PATIENT' | 'DOCTOR' | 'ADMIN';

export interface Patient extends User {
    dateOfBirth?: string;
    gender?: Gender;
    address?: string;
}

export interface Doctor extends User {
    specialty: Specialty;
    licenseNumber: string;
    experience: number;
    rating: number;
    reviewCount: number;
    bio?: string;
    consultationFee: number;
}

export type Gender = 'MALE' | 'FEMALE' | 'OTHER';

// Specialty
export interface Specialty {
    id: string;
    name: string;
    description?: string;
    icon?: string;
    doctorCount?: number;
}

// Appointment Types
export interface Appointment {
    id: string;
    patient: Patient;
    doctor: Doctor;
    timeSlot: TimeSlot;
    symptoms?: string;
    notes?: string;
    status: AppointmentStatus;
    createdAt: string;
}

export type AppointmentStatus =
    | 'PENDING'
    | 'CONFIRMED'
    | 'COMPLETED'
    | 'CANCELLED'
    | 'NO_SHOW';

export interface TimeSlot {
    id: string;
    date: string;
    startTime: string;
    endTime: string;
    isAvailable: boolean;
}

export interface WorkingSchedule {
    id: string;
    doctorId: string;
    dayOfWeek: number; // 0 = Sunday, 6 = Saturday
    startTime: string;
    endTime: string;
    slotDuration: number; // minutes
    isActive: boolean;
}

// Medical Records
export interface MedicalRecord {
    id: string;
    appointment: Appointment;
    diagnosis: string;
    symptoms: string;
    treatment?: string;
    notes?: string;
    createdAt: string;
    updatedAt?: string;
}

export interface Prescription {
    id: string;
    medicalRecord: MedicalRecord;
    details: PrescriptionDetail[];
    notes?: string;
    createdAt: string;
}

export interface PrescriptionDetail {
    id: string;
    medicine: Medicine;
    dosage: string;
    frequency: string;
    duration: string;
    instructions?: string;
}

export interface Medicine {
    id: string;
    name: string;
    description?: string;
    unit: string;
    price: number;
}

// Payment Types
export interface Payment {
    id: string;
    appointment: Appointment;
    amount: number;
    method: PaymentMethod;
    status: PaymentStatus;
    transactionId?: string;
    paidAt?: string;
    createdAt: string;
}

export type PaymentMethod = 'CASH' | 'CARD' | 'BANK_TRANSFER' | 'MOMO' | 'VNPAY';
export type PaymentStatus = 'PENDING' | 'SUCCESS' | 'FAILED' | 'REFUNDED';

// Review Types
export interface Review {
    id: string;
    patient: Patient;
    doctor: Doctor;
    appointment: Appointment;
    rating: number;
    comment?: string;
    createdAt: string;
}

// News Types
export interface News {
    id: string;
    title: string;
    content: string;
    summary?: string;
    thumbnail?: string;
    author: User;
    isPublished: boolean;
    publishedAt?: string;
    createdAt: string;
}

// Common Types
export interface Pagination {
    page: number;
    size: number;
    totalElements: number;
    totalPages: number;
}

export interface PaginatedData<T> {
    content: T[];
    pagination: Pagination;
}

// Auth Types
export interface LoginRequest {
    email: string;
    password: string;
}

export interface RegisterRequest {
    email: string;
    password: string;
    fullName: string;
    phone?: string;
    role?: UserRole;
}

export interface AuthResponse {
    user: User;
    accessToken: string;
    refreshToken: string;
}

// Form Types
export interface SelectOption {
    value: string;
    label: string;
}
