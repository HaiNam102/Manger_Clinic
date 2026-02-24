import { useState, useEffect } from 'react';
import { useLocation, useParams, useNavigate } from 'react-router-dom';
import {
    ArrowLeft,
    CheckCircle2,
    Calendar,
    Clock,
    User,
    ShieldCheck,
    Loader2,
    FileText,
    StickyNote,
} from 'lucide-react';
import { Button } from '@components/ui/Button';
import { Card, CardHeader, CardContent, CardFooter } from '@components/ui/Card';
import { useToast } from '@hooks/useToast';
import { getDoctorById, createAppointment } from '@services/patientService';
import type { DoctorResponse } from '@/types';

const ConfirmBookingPage = () => {
    const { specialtyId, doctorId } = useParams<{ specialtyId: string; doctorId: string }>();
    const location = useLocation();
    const navigate = useNavigate();
    const { showToast } = useToast();

    const bookingData = location.state as { date: string; time: string; timeSlotId: number };

    const [doctor, setDoctor] = useState<DoctorResponse | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [symptoms, setSymptoms] = useState('');
    const [notes, setNotes] = useState('');

    useEffect(() => {
        if (!doctorId) return;
        const load = async () => {
            try {
                setIsLoading(true);
                const data = await getDoctorById(doctorId);
                setDoctor(data);
            } catch (error) {
                console.error('Failed to load doctor:', error);
                showToast.error('Không thể tải thông tin bác sĩ.');
            } finally {
                setIsLoading(false);
            }
        };
        load();
    }, [doctorId]);

    const handleConfirm = async () => {
        if (!doctorId || !bookingData?.timeSlotId) return;
        if (!symptoms.trim()) {
            showToast.error('Vui lòng nhập triệu chứng để bác sĩ chuẩn bị trước.');
            return;
        }
        try {
            setIsSubmitting(true);
            showToast.loading('Đang đặt lịch hẹn...');
            await createAppointment({
                doctorId,
                specialtyId: specialtyId || undefined,
                timeSlotId: bookingData.timeSlotId,
                appointmentDate: bookingData.date,
                symptoms: symptoms.trim(),
                notes: notes.trim() || undefined,
            });
            showToast.success('Đặt lịch hẹn thành công!');
            navigate('/booking/success');
        } catch (error: any) {
            const msg = error?.response?.data?.message || 'Không thể đặt lịch. Vui lòng thử lại.';
            showToast.error(msg);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!bookingData) {
        return <div className="text-center py-20 text-dark-400">Trạng thái đặt lịch không hợp lệ.</div>;
    }

    const formattedFee = doctor?.consultationFee
        ? new Intl.NumberFormat('vi-VN').format(doctor.consultationFee) + ' VND'
        : 'Miễn phí';

    return (
        <div className="space-y-6 animate-fade-in max-w-2xl mx-auto">
            <section className="text-center space-y-2">
                <h1 className="text-3xl font-bold text-dark-50 tracking-tight">Xác nhận lịch hẹn</h1>
                <p className="text-dark-400 text-lg">
                    Kiểm tra thông tin và cho bác sĩ biết triệu chứng của bạn.
                </p>
            </section>

            {isLoading ? (
                <div className="flex items-center justify-center py-20">
                    <Loader2 size={32} className="animate-spin text-primary-500" />
                </div>
            ) : (
                <>
                    {/* Appointment summary */}
                    <Card className="shadow-2xl shadow-primary-900/10 border-primary-900/20">
                        <CardHeader
                            title="Tóm tắt lịch hẹn"
                            icon={<ShieldCheck className="text-primary-400" />}
                        />
                        <CardContent className="divide-y divide-dark-700/50">
                            <div className="py-4 flex justify-between items-center">
                                <div className="flex items-center gap-3 text-dark-400">
                                    <User size={20} />
                                    <span>Bác sĩ</span>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold text-dark-50">BS. {doctor?.fullName || '—'}</p>
                                    <p className="text-sm text-primary-500">{doctor?.specialtyName || '—'}</p>
                                </div>
                            </div>

                            <div className="py-4 flex justify-between items-center">
                                <div className="flex items-center gap-3 text-dark-400">
                                    <Calendar size={20} />
                                    <span>Ngày khám</span>
                                </div>
                                <p className="font-bold text-dark-50">
                                    {new Date(bookingData.date + 'T00:00:00').toLocaleDateString('vi-VN', {
                                        weekday: 'long',
                                        day: '2-digit',
                                        month: 'long',
                                        year: 'numeric',
                                    })}
                                </p>
                            </div>

                            <div className="py-4 flex justify-between items-center">
                                <div className="flex items-center gap-3 text-dark-400">
                                    <Clock size={20} />
                                    <span>Giờ khám</span>
                                </div>
                                <p className="font-bold text-dark-50">{bookingData.time}</p>
                            </div>

                            <div className="py-4 flex justify-between items-center text-lg">
                                <span className="font-medium text-dark-100">Phí khám</span>
                                <span className="font-bold text-primary-400">{formattedFee}</span>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Symptoms & Notes */}
                    <Card>
                        <CardHeader
                            title="Thông tin khám bệnh"
                            icon={<FileText className="text-primary-400" />}
                        />
                        <CardContent className="space-y-5">
                            {/* Symptoms - required */}
                            <div>
                                <label className="block text-sm font-semibold text-dark-200 mb-2">
                                    Triệu chứng <span className="text-red-400">*</span>
                                </label>
                                <p className="text-xs text-dark-500 mb-2">
                                    Mô tả các triệu chứng bạn đang gặp để bác sĩ chuẩn bị tốt hơn.
                                </p>
                                <textarea
                                    value={symptoms}
                                    onChange={(e) => setSymptoms(e.target.value)}
                                    placeholder="Ví dụ: Đau đầu dữ dội 3 ngày nay, sốt nhẹ 37.5°C, mệt mỏi toàn thân..."
                                    rows={4}
                                    maxLength={500}
                                    className="w-full bg-dark-800 border border-dark-700 rounded-xl px-4 py-3 text-dark-50 placeholder-dark-500 focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500/50 resize-none text-sm transition-colors"
                                />
                                <div className="flex justify-end mt-1">
                                    <span className={`text-xs ${symptoms.length > 450 ? 'text-amber-400' : 'text-dark-600'}`}>
                                        {symptoms.length}/500
                                    </span>
                                </div>
                            </div>

                            {/* Notes - optional */}
                            <div>
                                <label className="block text-sm font-semibold text-dark-200 mb-2">
                                    <StickyNote size={14} className="inline mr-1.5 opacity-70" />
                                    Ghi chú thêm{' '}
                                    <span className="text-dark-500 font-normal">(không bắt buộc)</span>
                                </label>
                                <textarea
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                    placeholder="Ví dụ: Dị ứng với penicillin, đang uống thuốc huyết áp..."
                                    rows={2}
                                    maxLength={300}
                                    className="w-full bg-dark-800 border border-dark-700 rounded-xl px-4 py-3 text-dark-50 placeholder-dark-500 focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500/50 resize-none text-sm transition-colors"
                                />
                            </div>
                        </CardContent>
                        <CardFooter className="bg-dark-900 flex flex-col sm:flex-row gap-4">
                            <Button
                                variant="outline"
                                fullWidth
                                onClick={() => navigate(-1)}
                                className="order-2 sm:order-1"
                            >
                                <ArrowLeft size={18} className="mr-2" /> Quay lại
                            </Button>
                            <Button
                                fullWidth
                                onClick={handleConfirm}
                                disabled={isSubmitting || !symptoms.trim()}
                                className="order-1 sm:order-2 bg-primary-600 hover:bg-primary-500 h-12 text-base shadow-lg shadow-primary-900/20 disabled:opacity-50"
                            >
                                {isSubmitting ? <Loader2 size={18} className="animate-spin mr-2" /> : null}
                                Xác nhận đặt lịch <CheckCircle2 size={18} className="ml-2" />
                            </Button>
                        </CardFooter>
                    </Card>
                </>
            )}

            <p className="text-center text-dark-500 text-sm">
                Bằng cách xác nhận, bạn đồng ý với điều khoản dịch vụ của phòng khám.
            </p>
        </div>
    );
};

export default ConfirmBookingPage;
