import { useLocation, useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, Calendar, Clock, User, ShieldCheck } from 'lucide-react';
import { Button } from '@components/ui/Button';
import { Card, CardHeader, CardContent, CardFooter } from '@components/ui/Card';
import { useToast } from '@hooks/useToast';

const ConfirmBookingPage = () => {
    const { specialtyId, doctorId } = useParams<{ specialtyId: string; doctorId: string }>();
    const location = useLocation();
    const navigate = useNavigate();
    const { showToast } = useToast();

    const bookingData = location.state as { date: string; time: string };

    // Mock data for doctor (in real app, fetch by doctorId)
    const doctor = {
        name: 'Dr. Nguyen Van A',
        specialty: 'Cardiology',
        cost: '500,000 VND'
    };

    const handleConfirm = async () => {
        showToast.loading('Confirming your appointment...');
        // Simulate API call
        setTimeout(() => {
            showToast.success('Appointment booked successfully!');
            navigate('/booking/success');
        }, 1500);
    };

    if (!bookingData) {
        return <div className="text-center py-20 text-dark-400">Invalid booking state.</div>;
    }

    return (
        <div className="space-y-8 animate-fade-in max-w-2xl mx-auto">
            <section className="text-center space-y-2">
                <h1 className="text-3xl font-bold text-dark-50 tracking-tight">Review & Confirm</h1>
                <p className="text-dark-400 text-lg">
                    Please check your appointment details before confirming.
                </p>
            </section>

            <Card className="shadow-2xl shadow-primary-900/10 border-primary-900/20">
                <CardHeader
                    title="Appointment Summary"
                    icon={<ShieldCheck className="text-primary-400" />}
                />
                <CardContent className="divide-y divide-dark-700/50">
                    <div className="py-4 flex justify-between items-center">
                        <div className="flex items-center gap-3 text-dark-400">
                            <User size={20} />
                            <span>Doctor</span>
                        </div>
                        <div className="text-right">
                            <p className="font-bold text-dark-50">{doctor.name}</p>
                            <p className="text-sm text-primary-500">{doctor.specialty}</p>
                        </div>
                    </div>

                    <div className="py-4 flex justify-between items-center">
                        <div className="flex items-center gap-3 text-dark-400">
                            <Calendar size={20} />
                            <span>Date</span>
                        </div>
                        <p className="font-bold text-dark-50">{bookingData.date}</p>
                    </div>

                    <div className="py-4 flex justify-between items-center">
                        <div className="flex items-center gap-3 text-dark-400">
                            <Clock size={20} />
                            <span>Time</span>
                        </div>
                        <p className="font-bold text-dark-50">{bookingData.time}</p>
                    </div>

                    <div className="py-4 flex justify-between items-center text-lg">
                        <span className="font-medium text-dark-100">Consultation Fee</span>
                        <span className="font-bold text-primary-400">{doctor.cost}</span>
                    </div>
                </CardContent>
                <CardFooter className="bg-dark-900 flex flex-col sm:flex-row gap-4">
                    <Button
                        variant="outline"
                        fullWidth
                        onClick={() => navigate(-1)}
                        className="order-2 sm:order-1"
                    >
                        <ArrowLeft size={18} className="mr-2" /> Back
                    </Button>
                    <Button
                        fullWidth
                        onClick={handleConfirm}
                        className="order-1 sm:order-2 bg-primary-600 hover:bg-primary-500 h-12 text-lg shadow-lg shadow-primary-900/20"
                    >
                        Confirm Booking <CheckCircle2 size={18} className="ml-2" />
                    </Button>
                </CardFooter>
            </Card>

            <p className="text-center text-dark-500 text-sm">
                By confirming, you agree to our terms and conditions for medical appointments.
            </p>
        </div>
    );
};

export default ConfirmBookingPage;
