import { useState, useEffect } from 'react';
import { Calendar, Clipboard, ArrowRight, PlusCircle, Loader2 } from 'lucide-react';
import { Card, CardHeader, CardContent } from '@components/ui/Card';
import { Button } from '@components/ui/Button';
import { Table, Column } from '@components/ui/Table';
import { Badge } from '@components/ui/Badge';
import { useAuth } from '@contexts/AuthContext';
import { Link } from 'react-router-dom';
import { LucideIcon, Stethoscope, Heart, Eye, Brain, Baby, Bone, Activity, Ear, Smile, Pill } from 'lucide-react';
import { getMyAppointments, getMyRecords, getAllSpecialties } from '@services/patientService';
import type { AppointmentResponse, MedicalRecordResponse, SpecialtyResponse } from '@/types';

// Map icon name from DB → Lucide component
const iconMap: Record<string, LucideIcon> = {
    Stethoscope, Heart, Eye, Brain, Baby, Bone, Activity, Ear, Smile, Pill,
};

const DashboardPage = () => {
    const { user } = useAuth();

    const [upcomingAppointment, setUpcomingAppointment] = useState<AppointmentResponse | null>(null);
    const [recentRecords, setRecentRecords] = useState<MedicalRecordResponse[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [specialties, setSpecialties] = useState<SpecialtyResponse[]>([]);

    useEffect(() => {
        const load = async () => {
            try {
                setIsLoading(true);
                const [appointments, records] = await Promise.allSettled([
                    getMyAppointments(),
                    user?.id ? getMyRecords() : Promise.resolve([]),
                ]);

                // Find next upcoming appointment (CONFIRMED or PENDING, today or future date)
                if (appointments.status === 'fulfilled') {
                    const todayStr = new Date().toISOString().slice(0, 10); // "YYYY-MM-DD"
                    const upcoming = appointments.value
                        .filter(apt =>
                            apt.appointmentDate >= todayStr &&
                            ['CONFIRMED', 'PENDING'].includes(apt.status)
                        )
                        .sort((a, b) => {
                            const dateCmp = a.appointmentDate.localeCompare(b.appointmentDate);
                            if (dateCmp !== 0) return dateCmp;
                            return a.appointmentTime.localeCompare(b.appointmentTime);
                        })[0] || null;
                    setUpcomingAppointment(upcoming);
                }

                if (records.status === 'fulfilled') {
                    // Show only the 3 most recent records
                    setRecentRecords(records.value.slice(0, 3));
                }

                // Fetch specialties for the dashboard
                const specs = await getAllSpecialties();
                setSpecialties(specs.slice(0, 4)); // Show top 4
            } catch (error) {
                console.error('Failed to load dashboard data:', error);
            } finally {
                setIsLoading(false);
            }
        };
        load();
    }, [user?.id]);

    const columns: Column<MedicalRecordResponse>[] = [
        {
            header: 'Ngày',
            accessor: (item) => new Date(item.createdAt).toLocaleDateString('vi-VN', {
                year: 'numeric', month: 'short', day: 'numeric',
            }),
        },
        { header: 'Bác sĩ', accessor: 'doctorName' },
        { header: 'Chẩn đoán', accessor: 'diagnosis' },
        {
            header: '',
            accessor: (item) => (
                <Link to={`/medical-history/${item.id}`}>
                    <Button variant="ghost" size="sm" className="text-primary-500 hover:text-primary-400">
                        Chi tiết
                    </Button>
                </Link>
            )
        },
    ];

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-20">
                <Loader2 size={32} className="animate-spin text-primary-500" />
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-fade-in">
            {/* Welcome Section */}
            <section>
                <h1 className="text-3xl font-bold text-dark-50 tracking-tight">
                    Xin chào, <span className="text-primary-500">{user?.fullName || 'Bệnh nhân'}</span> 👋
                </h1>
                <p className="text-dark-400 mt-2 text-lg">
                    Chào mừng trở lại! Theo dõi lịch hẹn và hồ sơ sức khỏe của bạn.
                </p>
            </section>

            {/* Stats/Summary Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Upcoming Appointment Widget */}
                <Card className="lg:col-span-2">
                    <CardHeader
                        title="Lịch hẹn sắp tới"
                        description="Lần khám tiếp theo của bạn"
                        action={
                            <Link to="/appointments">
                                <Button variant="ghost" size="sm" className="text-primary-500">
                                    Xem tất cả <ArrowRight size={16} className="ml-2" />
                                </Button>
                            </Link>
                        }
                    />
                    <CardContent>
                        {upcomingAppointment ? (
                            <Link to={`/appointments/${upcomingAppointment.id}`}>
                                <div className="flex items-center gap-6 p-4 bg-dark-800/40 rounded-xl border border-dark-700/50 hover:border-primary-700/50 hover:bg-dark-800/60 transition-all cursor-pointer">
                                    <div className="flex-shrink-0">
                                        <div className="w-16 h-16 bg-primary-900/40 rounded-2xl flex flex-col items-center justify-center text-primary-400">
                                            <span className="text-2xl font-bold leading-none">
                                                {parseInt(upcomingAppointment.appointmentDate.split('-')[2], 10)}
                                            </span>
                                            <span className="text-[10px] uppercase mt-0.5">
                                                {new Date(upcomingAppointment.appointmentDate + 'T00:00:00').toLocaleDateString('vi-VN', { month: 'short' })}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between mb-1">
                                            <h4 className="text-lg font-semibold text-dark-50 truncate">{upcomingAppointment.doctorName}</h4>
                                            <Badge variant={upcomingAppointment.status === 'CONFIRMED' ? 'primary' : 'warning'}>
                                                {upcomingAppointment.status === 'CONFIRMED' ? 'Đã xác nhận' : 'Chờ xác nhận'}
                                            </Badge>
                                        </div>
                                        <p className="text-primary-400/80 text-sm font-medium">{upcomingAppointment.specialtyName || ''}</p>
                                        <p className="text-dark-300 text-sm mt-1.5 flex items-center gap-3">
                                            <span className="flex items-center gap-1.5">
                                                <Calendar size={13} className="text-dark-500" />
                                                {new Date(upcomingAppointment.appointmentDate + 'T00:00:00').toLocaleDateString('vi-VN', { weekday: 'short', day: '2-digit', month: 'short' })}
                                            </span>
                                            <span className="h-1 w-1 rounded-full bg-dark-600" />
                                            <span>{upcomingAppointment.appointmentTime}</span>
                                        </p>
                                    </div>
                                    <ArrowRight size={18} className="text-dark-600 flex-shrink-0" />
                                </div>
                            </Link>
                        ) : (
                            <div className="py-8 text-center">
                                <div className="w-16 h-16 bg-dark-800/60 rounded-2xl flex items-center justify-center mx-auto mb-3">
                                    <Calendar size={28} className="text-dark-600" />
                                </div>
                                <p className="text-dark-400 font-medium">Không có lịch hẹn sắp tới</p>
                                <p className="text-dark-500 text-sm mt-1">Đặt lịch ngay để gặp bác sĩ</p>
                                <Link to="/booking/specialty">
                                    <Button variant="outline" size="sm" className="mt-4">Đặt lịch ngay</Button>
                                </Link>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Quick Actions Widget */}
                <Card>
                    <CardHeader title="Thao tác nhanh" />
                    <CardContent className="space-y-3">
                        <Link to="/booking/specialty" className="block">
                            <Button fullWidth className="justify-start gap-4 h-14 bg-primary-600 hover:bg-primary-500 text-base shadow-lg shadow-primary-900/10">
                                <PlusCircle size={22} />
                                Đặt lịch khám
                            </Button>
                        </Link>
                        <Link to="/appointments" className="block">
                            <Button fullWidth variant="outline" className="justify-start gap-4 h-14 text-base">
                                <Calendar size={22} />
                                Lịch hẹn của tôi
                            </Button>
                        </Link>
                        <Link to="/medical-history" className="block">
                            <Button fullWidth variant="outline" className="justify-start gap-4 h-14 text-base">
                                <Clipboard size={22} />
                                Hồ sơ bệnh án
                            </Button>
                        </Link>
                    </CardContent>
                </Card>
            </div>

            {/* Medical Departments Section */}
            <section>
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-dark-50 text-gradient">Chuyên khoa</h3>
                    <Link to="/booking/specialty" className="text-sm font-medium text-primary-500 hover:text-primary-400">
                        Xem tất cả
                    </Link>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {specialties.map((spec) => {
                        const IconComponent = iconMap[spec.icon || 'Stethoscope'] || Stethoscope;
                        return (
                            <Link key={spec.id} to={`/booking/doctor/${spec.id}`} className="block group">
                                <Card className="h-full border-dark-700/50 group-hover:border-primary-500/50 transition-all duration-300 group-hover:scale-[1.02]">
                                    <CardContent className="p-4 text-center">
                                        <div className="w-12 h-12 bg-primary-900/20 rounded-xl flex items-center justify-center mx-auto mb-3 text-primary-400 group-hover:bg-primary-900/40 transition-colors">
                                            <IconComponent size={24} />
                                        </div>
                                        <h4 className="font-bold text-dark-50 text-sm mb-1">{spec.name}</h4>
                                        <p className="text-[10px] text-dark-400 line-clamp-1">{spec.description}</p>
                                    </CardContent>
                                </Card>
                            </Link>
                        );
                    })}
                </div>
            </section>

            {/* Recent Records Section */}
            <section>
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-dark-50">Bệnh án gần đây</h3>
                    <Link to="/medical-history" className="text-sm font-medium text-primary-500 hover:text-primary-400">
                        Xem tất cả
                    </Link>
                </div>
                {recentRecords.length > 0 ? (
                    <Table
                        columns={columns}
                        data={recentRecords}
                        keyExtractor={(item) => item.id}
                        className="shadow-xl"
                    />
                ) : (
                    <div className="text-center py-12 bg-dark-900/30 rounded-2xl border border-dashed border-dark-700">
                        <p className="text-dark-400">Chưa có bệnh án nào.</p>
                    </div>
                )}
            </section>
        </div>
    );
};

export default DashboardPage;
