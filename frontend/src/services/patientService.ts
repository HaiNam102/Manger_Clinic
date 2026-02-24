import apiClient from './apiClient';
import type {
    AppointmentResponse,
    SpecialtyResponse,
    DoctorResponse,
    TimeSlotResponse,
    MedicalRecordResponse,
    UserProfileResponse,
} from '@/types';

// ============================================
// Patient Service - API calls for Patient Portal
// ============================================

// ─── Specialties ───

export const getAllSpecialties = async (): Promise<SpecialtyResponse[]> => {
    const response = await apiClient.get('/specialties');
    return response.data.result || [];
};

// ─── Doctors ───

export const getDoctorsBySpecialty = async (specialtyId: string): Promise<DoctorResponse[]> => {
    const response = await apiClient.get('/doctors', {
        params: { specialtyId },
    });
    return response.data.result || [];
};

export const getDoctorById = async (id: string): Promise<DoctorResponse> => {
    const response = await apiClient.get(`/doctors/${id}`);
    return response.data.result;
};

// ─── Appointments ───

export const getAvailableSlots = async (
    doctorId: string,
    date: string
): Promise<TimeSlotResponse[]> => {
    const response = await apiClient.get('/appointments/available-slots', {
        params: { doctorId, date },
    });
    return response.data.result || [];
};

export const createAppointment = async (data: {
    doctorId: string;
    specialtyId?: string;
    timeSlotId: number;
    appointmentDate: string;
    symptoms?: string;
    notes?: string;
}): Promise<AppointmentResponse> => {
    const response = await apiClient.post('/appointments', data);
    return response.data.result;
};

export const getMyAppointments = async (): Promise<AppointmentResponse[]> => {
    const response = await apiClient.get('/appointments/me');
    return response.data.result || [];
};

// ─── Medical Records ───

export const getMyRecords = async (): Promise<MedicalRecordResponse[]> => {
    const response = await apiClient.get('/medical-records/me');
    return response.data.result || [];
};

export const getRecordById = async (id: string): Promise<MedicalRecordResponse> => {
    const response = await apiClient.get(`/medical-records/${id}`);
    return response.data.result;
};

// ─── User Profile ───

export const getMyProfile = async (): Promise<UserProfileResponse> => {
    const response = await apiClient.get('/users/me');
    return response.data.result;
};

export const updateMyProfile = async (data: {
    fullName: string;
    phone?: string;
    avatarUrl?: string;
}): Promise<UserProfileResponse> => {
    const response = await apiClient.put('/users/me', data);
    return response.data.result;
};
