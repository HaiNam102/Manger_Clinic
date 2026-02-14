import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar as CalendarIcon, Clock } from 'lucide-react';
import { Button } from '@components/ui/Button';
import { Card, CardHeader, CardContent } from '@components/ui/Card';
import { TimeSlotPicker } from '@components/appointments/TimeSlotPicker';

const morningSlots = ['08:00 AM', '08:30 AM', '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM'];
const afternoonSlots = ['01:30 PM', '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM', '04:00 PM', '04:30 PM'];

const SelectDateTimePage = () => {
    const { specialtyId, doctorId } = useParams<{ specialtyId: string; doctorId: string }>();
    const navigate = useNavigate();
    const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
    const [selectedSlot, setSelectedSlot] = useState<string>();

    const handleNext = () => {
        if (selectedDate && selectedSlot) {
            navigate(`/booking/confirm/${specialtyId}/${doctorId}`, {
                state: { date: selectedDate, time: selectedSlot }
            });
        }
    };

    return (
        <div className="space-y-8 animate-fade-in max-w-4xl">
            {/* Header */}
            <section className="space-y-2">
                <Button
                    variant="ghost"
                    size="sm"
                    className="p-0 text-dark-400 hover:text-dark-200"
                    onClick={() => navigate(`/booking/doctor/${specialtyId}`)}
                >
                    <ArrowLeft size={16} className="mr-1" /> Back to Doctors
                </Button>
                <h1 className="text-3xl font-bold text-dark-50 tracking-tight">Select Date & Time</h1>
                <p className="text-dark-400 text-lg">
                    Choose a convenient time for your appointment.
                </p>
            </section>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Date Selection */}
                <Card className="lg:col-span-1">
                    <CardHeader title="Select Date" icon={<CalendarIcon size={20} />} />
                    <CardContent>
                        <input
                            type="date"
                            className="w-full bg-dark-800 border-dark-700 rounded-xl px-4 py-3 text-dark-50 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                            value={selectedDate}
                            min={new Date().toISOString().split('T')[0]}
                            onChange={(e) => setSelectedDate(e.target.value)}
                        />
                        <p className="text-dark-400 text-xs mt-4">
                            * Showing available slots for the selected date.
                        </p>
                    </CardContent>
                </Card>

                {/* Time Selection */}
                <Card className="lg:col-span-2">
                    <CardHeader title="Available Slots" icon={<Clock size={20} />} />
                    <CardContent className="space-y-8">
                        <section>
                            <h4 className="text-sm font-bold text-dark-400 uppercase tracking-widest mb-4">Morning</h4>
                            <TimeSlotPicker
                                slots={morningSlots}
                                selectedSlot={selectedSlot}
                                onSelect={setSelectedSlot}
                                disabledSlots={['09:00 AM']} // Mock disabled slot
                            />
                        </section>

                        <section>
                            <h4 className="text-sm font-bold text-dark-400 uppercase tracking-widest mb-4">Afternoon</h4>
                            <TimeSlotPicker
                                slots={afternoonSlots}
                                selectedSlot={selectedSlot}
                                onSelect={setSelectedSlot}
                            />
                        </section>

                        <div className="pt-6 border-t border-dark-700 flex justify-end">
                            <Button
                                size="lg"
                                className="px-10"
                                disabled={!selectedSlot}
                                onClick={handleNext}
                            >
                                Continue Booking
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default SelectDateTimePage;
