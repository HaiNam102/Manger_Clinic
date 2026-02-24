import { Routes, Route } from 'react-router-dom';
import { ProtectedRoute } from '@components/common/ProtectedRoute';
import { MainLayout } from '@components/layout/MainLayout';

// Pages
import LoginPage from '@pages/auth/LoginPage';
import RegisterPage from '@pages/auth/RegisterPage';
import HomePage from '@pages/HomePage';
import NotFoundPage from '@pages/NotFoundPage';
import ForbiddenPage from '@pages/ForbiddenPage';
import DashboardPage from '@pages/patient/DashboardPage';
import SelectSpecialtyPage from '@pages/patient/appointments/SelectSpecialtyPage';
import SelectDoctorPage from '@pages/patient/appointments/SelectDoctorPage';
import SelectDateTimePage from '@pages/patient/appointments/SelectDateTimePage';
import ConfirmBookingPage from '@pages/patient/appointments/ConfirmBookingPage';
import BookingSuccessPage from '@pages/patient/appointments/BookingSuccessPage';
import MedicalHistoryPage from '@pages/patient/medical-history/MedicalHistoryPage';
import RecordDetailPage from '@pages/patient/medical-history/RecordDetailPage';
import ProfilePage from '@pages/patient/ProfilePage';
import MyAppointmentsPage from '@pages/patient/appointments/MyAppointmentsPage';
import AppointmentDetailPage from '@pages/patient/appointments/AppointmentDetailPage';

// Doctor Pages
import DoctorDashboardPage from '@pages/doctor/DashboardPage';
import AppointmentListPage from '@pages/doctor/appointments/AppointmentListPage';
import CalendarPage from '@pages/doctor/appointments/CalendarPage';
import SchedulePage from '@pages/doctor/schedule/SchedulePage';
import PatientListPage from '@pages/doctor/patients/PatientListPage';
import PatientHistoryPage from '@pages/doctor/patients/PatientHistoryPage';

// Lazy load complex pages later

export const AppRouter = () => {
    return (
        <Routes>
            {/* Public Routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Patient Routes */}
            <Route
                path="/dashboard"
                element={
                    <ProtectedRoute>
                        <MainLayout>
                            <DashboardPage />
                        </MainLayout>
                    </ProtectedRoute>
                }
            />

            <Route
                path="/booking/specialty"
                element={
                    <ProtectedRoute>
                        <MainLayout>
                            <SelectSpecialtyPage />
                        </MainLayout>
                    </ProtectedRoute>
                }
            />

            <Route
                path="/booking/doctor/:specialtyId"
                element={
                    <ProtectedRoute>
                        <MainLayout>
                            <SelectDoctorPage />
                        </MainLayout>
                    </ProtectedRoute>
                }
            />

            <Route
                path="/booking/date-time/:specialtyId/:doctorId"
                element={
                    <ProtectedRoute>
                        <MainLayout>
                            <SelectDateTimePage />
                        </MainLayout>
                    </ProtectedRoute>
                }
            />

            <Route
                path="/booking/confirm/:specialtyId/:doctorId"
                element={
                    <ProtectedRoute>
                        <MainLayout>
                            <ConfirmBookingPage />
                        </MainLayout>
                    </ProtectedRoute>
                }
            />

            <Route
                path="/booking/success"
                element={
                    <ProtectedRoute>
                        <MainLayout>
                            <BookingSuccessPage />
                        </MainLayout>
                    </ProtectedRoute>
                }
            />

            <Route
                path="/medical-history"
                element={
                    <ProtectedRoute>
                        <MainLayout>
                            <MedicalHistoryPage />
                        </MainLayout>
                    </ProtectedRoute>
                }
            />

            <Route
                path="/medical-history/:recordId"
                element={
                    <ProtectedRoute>
                        <MainLayout>
                            <RecordDetailPage />
                        </MainLayout>
                    </ProtectedRoute>
                }
            />

            <Route
                path="/profile"
                element={
                    <ProtectedRoute>
                        <MainLayout>
                            <ProfilePage />
                        </MainLayout>
                    </ProtectedRoute>
                }
            />

            <Route
                path="/appointments"
                element={
                    <ProtectedRoute>
                        <MainLayout>
                            <MyAppointmentsPage />
                        </MainLayout>
                    </ProtectedRoute>
                }
            />

            <Route
                path="/appointments/:id"
                element={
                    <ProtectedRoute>
                        <MainLayout>
                            <AppointmentDetailPage />
                        </MainLayout>
                    </ProtectedRoute>
                }
            />

            <Route
                path="/doctor/dashboard"
                element={
                    <ProtectedRoute roles={['DOCTOR']}>
                        <MainLayout>
                            <DoctorDashboardPage />
                        </MainLayout>
                    </ProtectedRoute>
                }
            />

            <Route
                path="/doctor/appointments"
                element={
                    <ProtectedRoute roles={['DOCTOR']}>
                        <MainLayout>
                            <AppointmentListPage />
                        </MainLayout>
                    </ProtectedRoute>
                }
            />

            <Route
                path="/doctor/calendar"
                element={
                    <ProtectedRoute roles={['DOCTOR']}>
                        <MainLayout>
                            <CalendarPage />
                        </MainLayout>
                    </ProtectedRoute>
                }
            />

            <Route
                path="/doctor/schedule"
                element={
                    <ProtectedRoute roles={['DOCTOR']}>
                        <MainLayout>
                            <SchedulePage />
                        </MainLayout>
                    </ProtectedRoute>
                }
            />

            <Route
                path="/doctor/patients"
                element={
                    <ProtectedRoute roles={['DOCTOR']}>
                        <MainLayout>
                            <PatientListPage />
                        </MainLayout>
                    </ProtectedRoute>
                }
            />

            <Route
                path="/doctor/patients/:patientId"
                element={
                    <ProtectedRoute roles={['DOCTOR']}>
                        <MainLayout>
                            <PatientHistoryPage />
                        </MainLayout>
                    </ProtectedRoute>
                }
            />

            <Route path="/forbidden" element={<ForbiddenPage />} />
            {/* Fallback */}
            <Route path="*" element={<NotFoundPage />} />
        </Routes>
    );
};

