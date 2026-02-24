import { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar as CalendarIcon, Clock, Loader2 } from 'lucide-react';
import { Button } from '@components/ui/Button';
import { Card, CardHeader, CardContent } from '@components/ui/Card';
import { TimeSlotPicker } from '@components/appointments/TimeSlotPicker';
import { getAvailableSlots } from '@services/patientService';
import type { TimeSlotResponse } from '@/types';

const SelectDateTimePage = () => {
    const { specialtyId, doctorId } = useParams<{ specialtyId: string; doctorId: string }>();
    const navigate = useNavigate();
    const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
    const [selectedSlot, setSelectedSlot] = useState<string>();
    const [selectedSlotId, setSelectedSlotId] = useState<number>();
    const [slots, setSlots] = useState<TimeSlotResponse[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (!doctorId || !selectedDate) return;
        const load = async () => {
            try {
                setIsLoading(true);
                setSelectedSlot(undefined);
                setSelectedSlotId(undefined);
                const data = await getAvailableSlots(doctorId, selectedDate);
                setSlots(data);
            } catch (error) {
                console.error('Failed to load slots:', error);
                setSlots([]);
            } finally {
                setIsLoading(false);
            }
        };
        load();
    }, [doctorId, selectedDate]);

    // Split into AM/PM groups
    const { morningSlots, afternoonSlots } = useMemo(() => {
        const morning: string[] = [];
        const afternoon: string[] = [];
        const disabledSet = new Set<string>();

        slots.forEach(s => {
            const time = s.startTime; // "HH:mm"
            const hour = parseInt(time.split(':')[0], 10);
            if (hour < 12) {
                morning.push(time);
            } else {
                afternoon.push(time);
            }
            if (!s.isAvailable) {
                disabledSet.add(time);
            }
        });

        return {
            morningSlots: morning,
            afternoonSlots: afternoon,
            disabledSlots: disabledSet,
        };
    }, [slots]);

    const disabledSlots = useMemo(() =>
        slots.filter(s => !s.isAvailable).map(s => s.startTime),
        [slots]
    );

    const handleSlotSelect = (time: string) => {
        setSelectedSlot(time);
        const slot = slots.find(s => s.startTime === time);
        setSelectedSlotId(slot?.id);
    };

    const handleNext = () => {
        if (selectedDate && selectedSlot && selectedSlotId !== undefined) {
            navigate(`/booking/confirm/${specialtyId}/${doctorId}`, {
                state: { date: selectedDate, time: selectedSlot, timeSlotId: selectedSlotId }
            });
        }
    };

    return (
        <div className="space-y-8 animate-fade-in max-w-4xl">
            <section className="space-y-2">
                <Button
                    variant="ghost"
                    size="sm"
                    className="p-0 text-dark-400 hover:text-dark-200"
                    onClick={() => navigate(`/booking/doctor/${specialtyId}`)}
                >
                    <ArrowLeft size={16} className="mr-1" /> Quay lại danh sách bác sĩ
                </Button>
                <h1 className="text-3xl font-bold text-dark-50 tracking-tight">Chọn ngày & giờ khám</h1>
                <p className="text-dark-400 text-lg">
                    Chọn thời gian phù hợp cho buổi khám của bạn.
                </p>
            </section>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <Card className="lg:col-span-1">
                    <CardHeader title="Chọn ngày" icon={<CalendarIcon size={20} />} />
                    <CardContent>
                        <input
                            type="date"
                            className="w-full bg-dark-800 border-dark-700 rounded-xl px-4 py-3 text-dark-50 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                            value={selectedDate}
                            min={new Date().toISOString().split('T')[0]}
                            onChange={(e) => setSelectedDate(e.target.value)}
                        />
                        <p className="text-dark-400 text-xs mt-4">
                            * Hiển thị các khung giờ còn trống cho ngày đã chọn.
                        </p>
                    </CardContent>
                </Card>

                <Card className="lg:col-span-2">
                    <CardHeader title="Lịch khám trống" icon={<Clock size={20} />} />
                    <CardContent className="space-y-8">
                        {isLoading ? (
                            <div className="flex items-center justify-center py-12">
                                <Loader2 size={24} className="animate-spin text-primary-500" />
                            </div>
                        ) : slots.length === 0 ? (
                            <div className="text-center py-12">
                                <p className="text-dark-400">Không có lịch khám trống cho ngày này.</p>
                                <p className="text-dark-500 text-sm mt-1">Vui lòng chọn một ngày khác.</p>
                            </div>
                        ) : (
                            <>
                                {morningSlots.length > 0 && (
                                    <section>
                                        <h4 className="text-sm font-bold text-dark-400 uppercase tracking-widest mb-4">Buổi sáng</h4>
                                        <TimeSlotPicker
                                            slots={morningSlots}
                                            selectedSlot={selectedSlot}
                                            onSelect={handleSlotSelect}
                                            disabledSlots={disabledSlots}
                                        />
                                    </section>
                                )}
                                {afternoonSlots.length > 0 && (
                                    <section>
                                        <h4 className="text-sm font-bold text-dark-400 uppercase tracking-widest mb-4">Buổi chiều</h4>
                                        <TimeSlotPicker
                                            slots={afternoonSlots}
                                            selectedSlot={selectedSlot}
                                            onSelect={handleSlotSelect}
                                            disabledSlots={disabledSlots}
                                        />
                                    </section>
                                )}
                            </>
                        )}

                        <div className="pt-6 border-t border-dark-700 flex justify-end">
                            <Button
                                size="lg"
                                className="px-10"
                                disabled={!selectedSlot}
                                onClick={handleNext}
                            >
                                Tiếp tục đặt lịch
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default SelectDateTimePage;
