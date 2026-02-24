import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Printer, FileDown, Activity, ClipboardList, Pill, Loader2 } from 'lucide-react';
import { Button } from '@components/ui/Button';
import { Card, CardHeader, CardContent } from '@components/ui/Card';
import { Badge } from '@components/ui/Badge';
import { ReviewModal } from '@components/appointments/ReviewModal';
import { getRecordById } from '@services/patientService';
import type { MedicalRecordResponse } from '@/types';

const RecordDetailPage = () => {
    const { recordId } = useParams<{ recordId: string }>();
    const navigate = useNavigate();
    const [showReviewModal, setShowReviewModal] = useState(false);

    const translateVitalSign = (key: string) => {
        const map: Record<string, string> = {
            bloodPressure: 'Huyết áp',
            heartRate: 'Nhịp tim',
            temperature: 'Nhiệt độ',
            weight: 'Cân nặng'
        };
        return map[key] || key.replace(/([A-Z])/g, ' $1').trim();
    };
    const [record, setRecord] = useState<MedicalRecordResponse | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!recordId) return;
        const load = async () => {
            try {
                setIsLoading(true);
                const data = await getRecordById(recordId);
                setRecord(data);
            } catch (error) {
                console.error('Failed to load record:', error);
            } finally {
                setIsLoading(false);
            }
        };
        load();
    }, [recordId]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-20">
                <Loader2 size={32} className="animate-spin text-primary-500" />
            </div>
        );
    }

    if (!record) {
        return (
            <div className="text-center py-20">
                <p className="text-dark-400">Không tìm thấy bệnh án.</p>
                <Button variant="outline" className="mt-4" onClick={() => navigate('/medical-history')}>
                    Quay lại lịch sử
                </Button>
            </div>
        );
    }

    const recordDate = new Date(record.createdAt).toLocaleDateString('vi-VN', {
        year: 'numeric', month: 'short', day: 'numeric',
    });

    return (
        <div className="space-y-8 animate-fade-in max-w-4xl">
            {/* Header */}
            <section className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-2">
                    <Button
                        variant="ghost"
                        size="sm"
                        className="p-0 text-dark-400 hover:text-dark-200"
                        onClick={() => navigate('/medical-history')}
                    >
                        <ArrowLeft size={16} className="mr-1" /> Quay lại lịch sử
                    </Button>
                    <div className="flex items-center gap-3">
                        <h1 className="text-3xl font-bold text-dark-50 tracking-tight">Chi tiết bệnh án</h1>
                        <Badge variant="success">Hoàn tất</Badge>
                    </div>
                    <p className="text-dark-400 text-lg">Ngày khám: {recordDate}</p>
                </div>

                <div className="flex gap-3">
                    <Button variant="outline" size="sm" className="gap-2">
                        <Printer size={16} /> In
                    </Button>
                    <Button variant="outline" size="sm" className="gap-2">
                        <FileDown size={16} /> Tải PDF
                    </Button>
                </div>
            </section>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    <Card>
                        <CardHeader title="Chẩn đoán & Triệu chứng" icon={<Activity size={20} />} />
                        <CardContent className="space-y-6">
                            <div>
                                <h4 className="text-sm font-bold text-dark-400 uppercase tracking-widest mb-2">Triệu chứng</h4>
                                <p className="text-dark-50">{record.symptoms || '—'}</p>
                            </div>
                            <div>
                                <h4 className="text-sm font-bold text-dark-400 uppercase tracking-widest mb-2">Chẩn đoán cuối cùng</h4>
                                <p className="text-dark-50 text-xl font-bold text-primary-400">{record.diagnosis}</p>
                            </div>
                            {record.vitalSigns && (
                                <div>
                                    <h4 className="text-sm font-bold text-dark-400 uppercase tracking-widest mb-2">Sinh hiệu</h4>
                                    <div className="grid grid-cols-2 gap-4 bg-dark-800/50 p-4 rounded-xl border border-dark-700/50">
                                        {typeof record.vitalSigns === 'object' ? (
                                            Object.entries(record.vitalSigns).map(([label, value]) => (
                                                <div key={label} className="space-y-1">
                                                    <p className="text-[10px] font-bold text-dark-500 uppercase tracking-wider">{translateVitalSign(label)}</p>
                                                    <p className="text-sm font-bold text-primary-400">{String(value)}</p>
                                                </div>
                                            ))
                                        ) : (
                                            <p className="text-dark-50">{String(record.vitalSigns)}</p>
                                        )}
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader title="Ghi chú lâm sàng" icon={<ClipboardList size={20} />} />
                        <CardContent>
                            <p className="text-dark-100 leading-relaxed whitespace-pre-wrap">
                                {record.notes || record.treatment || 'Không có ghi chú lâm sàng.'}
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Sidebar / Prescription */}
                <div className="space-y-6">
                    <Card className="border-primary-900/30">
                        <CardHeader title="Đơn thuốc" icon={<Pill size={20} className="text-primary-400" />} />
                        <CardContent className="p-0">
                            {record.prescription && record.prescription.details.length > 0 ? (
                                <div className="divide-y divide-dark-700/50">
                                    {record.prescription.details.map((p, idx) => (
                                        <div key={idx} className="p-4 bg-primary-950/10">
                                            <p className="font-bold text-dark-50">{p.medicineName}</p>
                                            <p className="text-sm text-primary-500 font-medium">{p.dosage}</p>
                                            <p className="text-xs text-dark-400 mt-1">
                                                {p.frequency}{p.duration ? ` • ${p.duration}` : ''}
                                                {p.instructions ? ` • ${p.instructions}` : ''}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="p-4 text-center text-dark-500 text-sm">Không có đơn thuốc.</div>
                            )}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader title="Thông tin bác sĩ" />
                        <CardContent>
                            <p className="font-bold text-dark-50">{record.doctorName}</p>
                            <Button variant="ghost" size="sm" className="p-0 text-primary-500 mt-4">
                                Xem hồ sơ bác sĩ
                            </Button>
                        </CardContent>
                    </Card>

                    {record.followUpDate && (
                        <Card className="bg-amber-900/10 border-amber-500/20">
                            <CardContent className="p-6">
                                <p className="text-amber-400 font-medium text-sm">
                                    📅 Tái khám: {new Date(record.followUpDate).toLocaleDateString('vi-VN', {
                                        year: 'numeric', month: 'short', day: 'numeric',
                                    })}
                                </p>
                            </CardContent>
                        </Card>
                    )}

                    <Card className="bg-primary-900/10 border-primary-500/20">
                        <CardContent className="p-6 text-center">
                            <h4 className="font-bold text-dark-50 mb-2">Buổi khám thế nào?</h4>
                            <p className="text-xs text-dark-400 mb-4">Chia sẻ trải nghiệm giúp người khác chọn được dịch vụ tốt hơn.</p>
                            <Button size="sm" fullWidth onClick={() => setShowReviewModal(true)}>
                                Viết đánh giá
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>

            <ReviewModal
                isOpen={showReviewModal}
                onClose={() => setShowReviewModal(false)}
                doctorName={record.doctorName}
                appointmentId={record.appointmentId || ''}
            />
        </div>
    );
};

export default RecordDetailPage;
