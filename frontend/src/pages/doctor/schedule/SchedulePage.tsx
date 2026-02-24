import { useState, useEffect, useCallback } from 'react';
import {
    Clock,
    Plus,
    Trash2,
    Save,
    Calendar,
    CalendarOff,
    ToggleLeft,
    ToggleRight,
    AlertCircle,
    CheckCircle2,
    X
} from 'lucide-react';
import { Card, CardHeader, CardContent } from '@components/ui/Card';
import { Button } from '@components/ui/Button';
import { Badge } from '@components/ui/Badge';
import { Loading } from '@components/ui/Loading';
import { useAuth } from '@contexts/AuthContext';
import { getMySchedule, updateMySchedule } from '@services/doctorService';
import type { Schedule, ScheduleTimeSlot, LeaveDay } from '@/types';

// ============ Constants ============
const DAYS_VI = ['Chủ nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'];
const DAYS_SHORT = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];

const DEFAULT_SLOTS: ScheduleTimeSlot[] = [
    { startTime: '08:00', endTime: '08:30', maxPatients: 1, isAvailable: true },
    { startTime: '08:30', endTime: '09:00', maxPatients: 1, isAvailable: true },
    { startTime: '09:00', endTime: '09:30', maxPatients: 1, isAvailable: true },
    { startTime: '09:30', endTime: '10:00', maxPatients: 1, isAvailable: true },
    { startTime: '10:00', endTime: '10:30', maxPatients: 1, isAvailable: true },
    { startTime: '10:30', endTime: '11:00', maxPatients: 1, isAvailable: true },
    { startTime: '14:00', endTime: '14:30', maxPatients: 1, isAvailable: true },
    { startTime: '14:30', endTime: '15:00', maxPatients: 1, isAvailable: true },
    { startTime: '15:00', endTime: '15:30', maxPatients: 1, isAvailable: true },
    { startTime: '15:30', endTime: '16:00', maxPatients: 1, isAvailable: true },
];

// Generate default schedule if API returns empty
const generateDefaultSchedule = (): Schedule[] => {
    return Array.from({ length: 7 }, (_, i) => ({
        id: i,
        dayOfWeek: i,
        isAvailable: i !== 0,
        notes: i === 0 ? 'Nghỉ cuối tuần' : '',
        timeSlots: i === 0 ? [] : [...DEFAULT_SLOTS],
    }));
};

// ============ Tabs ============
type TabId = 'weekly' | 'timeslots' | 'leave';

const tabs: { id: TabId; label: string; icon: React.ReactNode }[] = [
    { id: 'weekly', label: 'Lịch tuần', icon: <Calendar size={16} /> },
    { id: 'timeslots', label: 'Khung giờ', icon: <Clock size={16} /> },
    { id: 'leave', label: 'Ngày nghỉ', icon: <CalendarOff size={16} /> },
];

// ============ Main Component ============
const SchedulePage = () => {
    const { user } = useAuth();
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<TabId>('weekly');
    const [schedule, setSchedule] = useState<Schedule[]>(generateDefaultSchedule);
    const [leaveDays, setLeaveDays] = useState<LeaveDay[]>([]);
    const [selectedDay, setSelectedDay] = useState<number>(1);
    const [hasChanges, setHasChanges] = useState(false);
    const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');

    // Load schedule from API
    useEffect(() => {
        const load = async () => {
            if (!user) return;
            try {
                setIsLoading(true);
                const doctorId = user.doctorId || user.id;
                const data = await getMySchedule(doctorId);
                if (data && data.length > 0) {
                    // Split weekly recurring schedules and specific date overrides
                    const weekly = data.filter(s => !s.specificDate);
                    const specific = data.filter(s => !!s.specificDate);

                    if (weekly.length > 0) {
                        // Ensure we have all 7 days even if backend missing some
                        const fullWeekly = generateDefaultSchedule().map(def => {
                            const found = weekly.find(w => w.dayOfWeek === def.dayOfWeek);
                            return found || def;
                        });
                        setSchedule(fullWeekly);
                    }

                    // Map specific dates where isAvailable is false to leaveDays state
                    const existingLeave = specific
                        .filter(s => !s.isAvailable)
                        .map(s => ({
                            date: s.specificDate!,
                            reason: s.notes || 'Nghỉ phép'
                        }));
                    setLeaveDays(existingLeave);
                }
            } catch (error) {
                console.error('Failed to load schedule:', error);
            } finally {
                setIsLoading(false);
            }
        };
        load();
    }, [user?.id, user?.doctorId]);

    const markChanged = () => { setHasChanges(true); setSaveStatus('idle'); };

    // Toggle day availability
    const toggleDay = useCallback((dayOfWeek: number) => {
        setSchedule(prev => prev.map(s =>
            s.dayOfWeek === dayOfWeek
                ? { ...s, isAvailable: !s.isAvailable, timeSlots: !s.isAvailable ? [...DEFAULT_SLOTS] : [] }
                : s
        ));
        markChanged();
    }, []);

    // Update time slot
    const updateSlot = useCallback((dayOfWeek: number, slotIndex: number, updates: Partial<ScheduleTimeSlot>) => {
        setSchedule(prev => prev.map(s =>
            s.dayOfWeek === dayOfWeek
                ? {
                    ...s,
                    timeSlots: s.timeSlots.map((slot, i) => i === slotIndex ? { ...slot, ...updates } : slot),
                }
                : s
        ));
        markChanged();
    }, []);

    // Add slot
    const addSlot = useCallback((dayOfWeek: number) => {
        setSchedule(prev => prev.map(s => {
            if (s.dayOfWeek !== dayOfWeek) return s;
            const lastSlot = s.timeSlots[s.timeSlots.length - 1];
            const newStart = lastSlot ? lastSlot.endTime : '08:00';
            const [h, m] = newStart.split(':').map(Number);
            const newEnd = `${String(h + (m >= 30 ? 1 : 0)).padStart(2, '0')}:${m >= 30 ? '00' : '30'}`;
            return {
                ...s,
                timeSlots: [...s.timeSlots, { startTime: newStart, endTime: newEnd, maxPatients: 1, isAvailable: true }],
            };
        }));
        markChanged();
    }, []);

    // Remove slot
    const removeSlot = useCallback((dayOfWeek: number, slotIndex: number) => {
        setSchedule(prev => prev.map(s =>
            s.dayOfWeek === dayOfWeek
                ? { ...s, timeSlots: s.timeSlots.filter((_, i) => i !== slotIndex) }
                : s
        ));
        markChanged();
    }, []);

    // Add leave day
    const addLeaveDay = useCallback((date: string, reason: string) => {
        if (!date) return;
        setLeaveDays(prev => [...prev, { date, reason }].sort((a, b) => a.date.localeCompare(b.date)));
        markChanged();
    }, []);

    // Remove leave day
    const removeLeaveDay = useCallback((date: string) => {
        setLeaveDays(prev => prev.filter(d => d.date !== date));
        markChanged();
    }, []);

    // Save to API
    const handleSave = async () => {
        if (!user?.id) return;
        try {
            setSaveStatus('saving');

            // 1. Prepare weekly schedules (ensure they have null specificDate)
            const weeklyPayload = schedule.map(s => ({
                ...s,
                specificDate: undefined
            }));

            // 2. Prepare leave days (map back to Schedule objects)
            const leavePayload = leaveDays.map(ld => {
                const dateObj = new Date(ld.date);
                return {
                    dayOfWeek: dateObj.getDay(), // 0=Sunday, 6=Saturday
                    specificDate: ld.date,
                    isAvailable: false,
                    notes: ld.reason,
                    timeSlots: []
                };
            });

            // 3. Combine and send
            const doctorId = user.doctorId || user.id;
            const fullPayload = [...weeklyPayload, ...leavePayload];
            await updateMySchedule(doctorId, fullPayload);

            setSaveStatus('saved');
            setHasChanges(false);
            setTimeout(() => setSaveStatus('idle'), 2000);
        } catch (error) {
            console.error('Failed to save schedule:', error);
            setSaveStatus('idle');
            alert('Có lỗi xảy ra khi lưu lịch làm việc. Vui lòng thử lại.');
        }
    };

    const selectedSchedule = schedule.find(s => s.dayOfWeek === selectedDay);

    if (isLoading) return <Loading fullPage text="Đang tải lịch làm việc..." />;

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-dark-50">Quản lý lịch làm việc</h1>
                    <p className="text-dark-400 mt-1">Cài đặt lịch khám, khung giờ và ngày nghỉ</p>
                </div>
                <div className="flex items-center gap-2">
                    {hasChanges && (
                        <span className="text-xs text-amber-400 flex items-center gap-1">
                            <AlertCircle size={14} /> Có thay đổi chưa lưu
                        </span>
                    )}
                    {saveStatus === 'saved' && (
                        <span className="text-xs text-emerald-400 flex items-center gap-1">
                            <CheckCircle2 size={14} /> Đã lưu!
                        </span>
                    )}
                    <Button
                        className="bg-primary-600 hover:bg-primary-500"
                        onClick={handleSave}
                        disabled={!hasChanges || saveStatus === 'saving'}
                    >
                        <Save size={16} className="mr-2" />
                        {saveStatus === 'saving' ? 'Đang lưu...' : 'Lưu thay đổi'}
                    </Button>
                </div>
            </div>

            {/* Tab Navigation */}
            <div className="flex items-center gap-1 bg-dark-900 rounded-xl p-1 border border-dark-700 w-fit">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === tab.id
                            ? 'bg-primary-600 text-white shadow-lg'
                            : 'text-dark-400 hover:text-dark-200 hover:bg-dark-800'
                            }`}
                    >
                        {tab.icon}
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Tab Content */}
            {activeTab === 'weekly' && (
                <WeeklyScheduleTab
                    schedule={schedule}
                    selectedDay={selectedDay}
                    onSelectDay={setSelectedDay}
                    onToggleDay={toggleDay}
                />
            )}

            {activeTab === 'timeslots' && (
                <TimeSlotsTab
                    schedule={schedule}
                    selectedDay={selectedDay}
                    selectedSchedule={selectedSchedule}
                    onSelectDay={setSelectedDay}
                    onUpdateSlot={updateSlot}
                    onAddSlot={addSlot}
                    onRemoveSlot={removeSlot}
                />
            )}

            {activeTab === 'leave' && (
                <LeaveDaysTab
                    leaveDays={leaveDays}
                    onAddLeave={addLeaveDay}
                    onRemoveLeave={removeLeaveDay}
                />
            )}
        </div>
    );
};

// ============ Weekly Schedule Tab ============
interface WeeklyTabProps {
    schedule: Schedule[];
    selectedDay: number;
    onSelectDay: (day: number) => void;
    onToggleDay: (day: number) => void;
}

const WeeklyScheduleTab = ({ schedule, selectedDay, onSelectDay, onToggleDay }: WeeklyTabProps) => (
    <div className="grid grid-cols-1 lg:grid-cols-7 gap-3">
        {schedule.map(day => (
            <Card
                key={day.dayOfWeek}
                className={`cursor-pointer transition-all hover:scale-[1.02] ${selectedDay === day.dayOfWeek ? 'ring-2 ring-primary-500/50' : ''
                    } ${!day.isAvailable ? 'opacity-60' : ''}`}
                onClick={() => onSelectDay(day.dayOfWeek)}
            >
                <CardContent className="p-4 text-center">
                    <p className="text-xs font-semibold text-dark-400 uppercase tracking-wider mb-2">
                        {DAYS_SHORT[day.dayOfWeek]}
                    </p>
                    <p className="text-sm font-bold text-dark-50 mb-3">{DAYS_VI[day.dayOfWeek]}</p>

                    <button
                        onClick={(e) => { e.stopPropagation(); onToggleDay(day.dayOfWeek); }}
                        className={`w-full flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-medium transition-all ${day.isAvailable
                            ? 'bg-emerald-900/30 text-emerald-400 border border-emerald-700/30'
                            : 'bg-dark-800 text-dark-500 border border-dark-700'
                            }`}
                    >
                        {day.isAvailable ? <ToggleRight size={16} /> : <ToggleLeft size={16} />}
                        {day.isAvailable ? 'Làm việc' : 'Nghỉ'}
                    </button>

                    {day.isAvailable && (
                        <p className="text-xs text-dark-500 mt-2">
                            {day.timeSlots.length} khung giờ
                        </p>
                    )}
                    {!day.isAvailable && day.notes && (
                        <p className="text-[11px] text-dark-500 mt-2 truncate">{day.notes}</p>
                    )}
                </CardContent>
            </Card>
        ))}
    </div>
);

// ============ Time Slots Tab ============
interface TimeSlotsTabProps {
    schedule: Schedule[];
    selectedDay: number;
    selectedSchedule?: Schedule;
    onSelectDay: (day: number) => void;
    onUpdateSlot: (day: number, idx: number, updates: Partial<ScheduleTimeSlot>) => void;
    onAddSlot: (day: number) => void;
    onRemoveSlot: (day: number, idx: number) => void;
}

const TimeSlotsTab = ({ schedule, selectedDay, selectedSchedule, onSelectDay, onUpdateSlot, onAddSlot, onRemoveSlot }: TimeSlotsTabProps) => (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
            <CardHeader title="Chọn ngày" icon={<Calendar size={18} />} />
            <CardContent className="space-y-1">
                {schedule.map(day => (
                    <button
                        key={day.dayOfWeek}
                        onClick={() => onSelectDay(day.dayOfWeek)}
                        disabled={!day.isAvailable}
                        className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm transition-all ${selectedDay === day.dayOfWeek
                            ? 'bg-primary-900/40 text-primary-400 border border-primary-700/30'
                            : day.isAvailable
                                ? 'text-dark-200 hover:bg-dark-800'
                                : 'text-dark-600 cursor-not-allowed'
                            }`}
                    >
                        <span className="font-medium">{DAYS_VI[day.dayOfWeek]}</span>
                        {day.isAvailable ? (
                            <Badge variant="primary" size="sm">{day.timeSlots.length}</Badge>
                        ) : (
                            <span className="text-xs text-dark-600">Nghỉ</span>
                        )}
                    </button>
                ))}
            </CardContent>
        </Card>

        <Card className="lg:col-span-2">
            <CardHeader
                title={`Khung giờ — ${DAYS_VI[selectedDay]}`}
                description={selectedSchedule?.isAvailable ? `${selectedSchedule.timeSlots.length} khung giờ` : 'Ngày nghỉ'}
                icon={<Clock size={18} />}
                action={
                    selectedSchedule?.isAvailable ? (
                        <Button size="sm" variant="ghost" onClick={() => onAddSlot(selectedDay)} className="text-primary-400">
                            <Plus size={16} className="mr-1" /> Thêm
                        </Button>
                    ) : undefined
                }
            />
            <CardContent>
                {selectedSchedule?.isAvailable ? (
                    <div className="space-y-2">
                        <div className="grid grid-cols-12 gap-2 px-3 py-2 text-xs font-semibold text-dark-500 uppercase">
                            <div className="col-span-3">Bắt đầu</div>
                            <div className="col-span-3">Kết thúc</div>
                            <div className="col-span-2">Số BN</div>
                            <div className="col-span-2">Trạng thái</div>
                            <div className="col-span-2 text-right">Xóa</div>
                        </div>

                        {selectedSchedule.timeSlots.map((slot, idx) => (
                            <div
                                key={idx}
                                className={`grid grid-cols-12 gap-2 items-center px-3 py-2.5 rounded-lg border transition-all ${slot.isAvailable
                                    ? 'bg-dark-800/30 border-dark-700/50 hover:border-primary-700/30'
                                    : 'bg-dark-800/10 border-dark-800 opacity-50'
                                    }`}
                            >
                                <div className="col-span-3">
                                    <input
                                        type="time"
                                        value={slot.startTime}
                                        onChange={(e) => onUpdateSlot(selectedDay, idx, { startTime: e.target.value })}
                                        className="bg-dark-800 border border-dark-600 rounded-lg px-2 py-1.5 text-sm text-dark-200 w-full focus:outline-none focus:ring-1 focus:ring-primary-500"
                                    />
                                </div>
                                <div className="col-span-3">
                                    <input
                                        type="time"
                                        value={slot.endTime}
                                        onChange={(e) => onUpdateSlot(selectedDay, idx, { endTime: e.target.value })}
                                        className="bg-dark-800 border border-dark-600 rounded-lg px-2 py-1.5 text-sm text-dark-200 w-full focus:outline-none focus:ring-1 focus:ring-primary-500"
                                    />
                                </div>
                                <div className="col-span-2">
                                    <input
                                        type="number"
                                        min={1}
                                        max={10}
                                        value={slot.maxPatients}
                                        onChange={(e) => onUpdateSlot(selectedDay, idx, { maxPatients: Number(e.target.value) })}
                                        className="bg-dark-800 border border-dark-600 rounded-lg px-2 py-1.5 text-sm text-dark-200 w-full focus:outline-none focus:ring-1 focus:ring-primary-500"
                                    />
                                </div>
                                <div className="col-span-2">
                                    <button
                                        onClick={() => onUpdateSlot(selectedDay, idx, { isAvailable: !slot.isAvailable })}
                                        className={`flex items-center gap-1 text-xs font-medium px-2 py-1.5 rounded-lg transition-all ${slot.isAvailable
                                            ? 'bg-emerald-900/30 text-emerald-400'
                                            : 'bg-dark-800 text-dark-500'
                                            }`}
                                    >
                                        {slot.isAvailable ? <ToggleRight size={14} /> : <ToggleLeft size={14} />}
                                    </button>
                                </div>
                                <div className="col-span-2 text-right">
                                    <button
                                        onClick={() => onRemoveSlot(selectedDay, idx)}
                                        className="p-1.5 rounded-lg text-red-400/60 hover:text-red-400 hover:bg-red-900/20 transition-all"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            </div>
                        ))}

                        {selectedSchedule.timeSlots.length === 0 && (
                            <div className="text-center py-8">
                                <Clock size={40} className="mx-auto text-dark-600 mb-3" />
                                <p className="text-dark-400 text-sm">Chưa có khung giờ nào</p>
                                <Button size="sm" variant="ghost" onClick={() => onAddSlot(selectedDay)} className="mt-2 text-primary-400">
                                    <Plus size={14} className="mr-1" /> Thêm khung giờ
                                </Button>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <CalendarOff size={48} className="mx-auto text-dark-600 mb-3" />
                        <p className="text-dark-400">Ngày nghỉ — Không có khung giờ</p>
                        <p className="text-dark-500 text-sm mt-1">Bật "Làm việc" trong tab Lịch tuần để thêm khung giờ</p>
                    </div>
                )}
            </CardContent>
        </Card>
    </div>
);

// ============ Leave Days Tab ============
interface LeaveDaysTabProps {
    leaveDays: LeaveDay[];
    onAddLeave: (date: string, reason: string) => void;
    onRemoveLeave: (date: string) => void;
}

const LeaveDaysTab = ({ leaveDays, onAddLeave, onRemoveLeave }: LeaveDaysTabProps) => {
    const [newDate, setNewDate] = useState('');
    const [newReason, setNewReason] = useState('');

    const handleAdd = () => {
        onAddLeave(newDate, newReason || 'Nghỉ phép');
        setNewDate('');
        setNewReason('');
    };

    const today = new Date().toISOString().split('T')[0];

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
                <CardHeader title="Thêm ngày nghỉ" icon={<CalendarOff size={18} />} />
                <CardContent className="space-y-4">
                    <div>
                        <label className="block text-xs font-semibold text-dark-400 mb-1.5 uppercase tracking-wider">
                            Ngày nghỉ
                        </label>
                        <input
                            type="date"
                            value={newDate}
                            min={today}
                            onChange={(e) => setNewDate(e.target.value)}
                            className="w-full bg-dark-800 border border-dark-600 rounded-lg px-3 py-2.5 text-sm text-dark-200 focus:outline-none focus:ring-2 focus:ring-primary-500/30"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-dark-400 mb-1.5 uppercase tracking-wider">
                            Lý do
                        </label>
                        <input
                            type="text"
                            value={newReason}
                            onChange={(e) => setNewReason(e.target.value)}
                            placeholder="VD: Nghỉ phép, Hội nghị..."
                            className="w-full bg-dark-800 border border-dark-600 rounded-lg px-3 py-2.5 text-sm text-dark-200 placeholder-dark-500 focus:outline-none focus:ring-2 focus:ring-primary-500/30"
                        />
                    </div>
                    <Button
                        className="w-full bg-primary-600 hover:bg-primary-500"
                        onClick={handleAdd}
                        disabled={!newDate}
                    >
                        <Plus size={16} className="mr-2" /> Thêm ngày nghỉ
                    </Button>
                </CardContent>
            </Card>

            <Card>
                <CardHeader
                    title="Danh sách ngày nghỉ"
                    description={`${leaveDays.length} ngày`}
                    icon={<Calendar size={18} />}
                />
                <CardContent className="space-y-2">
                    {leaveDays.map(leave => {
                        const dateObj = new Date(leave.date + 'T00:00:00');
                        const isPast = leave.date < today;
                        return (
                            <div
                                key={leave.date}
                                className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${isPast
                                    ? 'bg-dark-800/20 border-dark-800 opacity-50'
                                    : 'bg-dark-800/40 border-dark-700/50 hover:border-primary-700/30'
                                    }`}
                            >
                                <div className="h-10 w-10 rounded-lg bg-red-900/20 flex items-center justify-center flex-shrink-0">
                                    <CalendarOff size={18} className="text-red-400" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-semibold text-dark-100">
                                        {dateObj.toLocaleDateString('vi-VN', { weekday: 'long', day: '2-digit', month: '2-digit', year: 'numeric' })}
                                    </p>
                                    <p className="text-xs text-dark-400 truncate">{leave.reason}</p>
                                </div>
                                {!isPast && (
                                    <button
                                        onClick={() => onRemoveLeave(leave.date)}
                                        className="p-1.5 rounded-lg text-dark-500 hover:text-red-400 hover:bg-red-900/20 transition-all"
                                    >
                                        <X size={16} />
                                    </button>
                                )}
                                {isPast && (
                                    <span className="text-[10px] text-dark-600 uppercase">Đã qua</span>
                                )}
                            </div>
                        );
                    })}

                    {leaveDays.length === 0 && (
                        <div className="text-center py-8">
                            <CalendarOff size={40} className="mx-auto text-dark-600 mb-3" />
                            <p className="text-dark-400 text-sm">Chưa có ngày nghỉ nào</p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default SchedulePage;
