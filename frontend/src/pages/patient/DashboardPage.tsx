import { Calendar, Clipboard, ArrowRight, PlusCircle } from 'lucide-react';
import { Card, CardHeader, CardContent } from '@components/ui/Card';
import { Button } from '@components/ui/Button';
import { Table, Column } from '@components/ui/Table';
import { Badge } from '@components/ui/Badge';
import { useAuth } from '@contexts/AuthContext';
import { Link } from 'react-router-dom';

// Type for recent records
interface MedicalRecord {
    id: string;
    date: string;
    doctorName: string;
    specialty: string;
    diagnosis: string;
}

const DashboardPage = () => {
    const { user } = useAuth();

    // Mock data for upcoming appointment
    const upcomingAppointment = {
        id: '1',
        doctorName: 'Dr. Nguyen Van A',
        specialty: 'Cardiology',
        date: 'Feb 15, 2026',
        time: '09:00 AM',
        status: 'CONFIRMED'
    };

    // Mock data for recent records
    const recentRecords: MedicalRecord[] = [
        { id: '101', date: 'Feb 10, 2026', doctorName: 'Dr. Nguyen Van A', specialty: 'Cardiology', diagnosis: 'Mild Hypertension' },
        { id: '102', date: 'Jan 28, 2026', doctorName: 'Dr. Tran Thi B', specialty: 'General', diagnosis: 'Seasonal Flu' },
    ];

    const columns: Column<MedicalRecord>[] = [
        { header: 'Date', accessor: 'date' },
        { header: 'Doctor', accessor: 'doctorName' },
        { header: 'Specialty', accessor: 'specialty' },
        { header: 'Diagnosis', accessor: 'diagnosis' },
        {
            header: 'Action',
            accessor: (item) => (
                <Link to={`/records/${item.id}`}>
                    <Button variant="ghost" size="sm" className="text-primary-500 hover:text-primary-400">
                        Details
                    </Button>
                </Link>
            )
        },
    ];

    return (
        <div className="space-y-8 animate-fade-in">
            {/* Welcome Section */}
            <section>
                <h1 className="text-3xl font-bold text-dark-50 tracking-tight">
                    Hello, <span className="text-primary-500">{user?.fullName || 'Patient'}</span>
                </h1>
                <p className="text-dark-400 mt-2 text-lg">
                    Welcome to your health dashboard. Stay updated with your appointments and medical history.
                </p>
            </section>

            {/* Stats/Summary Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Upcoming Appointment Widget */}
                <Card className="lg:col-span-2">
                    <CardHeader
                        title="Upcoming Appointment"
                        description="Your next visit to the clinic"
                        action={
                            <Link to="/appointments">
                                <Button variant="ghost" size="sm" className="text-primary-500">
                                    View All <ArrowRight size={16} className="ml-2" />
                                </Button>
                            </Link>
                        }
                    />
                    <CardContent>
                        {upcomingAppointment ? (
                            <div className="flex items-center gap-6 p-4 bg-dark-800/40 rounded-xl border border-dark-700/50">
                                <div className="h-16 w-16 bg-primary-900/40 rounded-2xl flex items-center justify-center text-primary-400">
                                    <Calendar size={32} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between mb-1">
                                        <h4 className="text-lg font-semibold text-dark-50 truncate">{upcomingAppointment.doctorName}</h4>
                                        <Badge variant="primary">{upcomingAppointment.status}</Badge>
                                    </div>
                                    <p className="text-dark-400 text-sm font-medium">{upcomingAppointment.specialty}</p>
                                    <p className="text-dark-300 text-sm mt-2 flex items-center gap-4">
                                        <span className="flex items-center gap-1 font-semibold text-primary-400">
                                            {upcomingAppointment.date}
                                        </span>
                                        <span className="h-1 w-1 rounded-full bg-dark-600" />
                                        <span>{upcomingAppointment.time}</span>
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <div className="py-6 text-center">
                                <p className="text-dark-400">No upcoming appointments scheduled.</p>
                                <Button variant="outline" size="sm" className="mt-4">Book Now</Button>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Quick Actions Widget */}
                <Card>
                    <CardHeader title="Quick Actions" />
                    <CardContent className="space-y-3">
                        <Link to="/booking/specialty" className="block">
                            <Button fullWidth className="justify-start gap-4 h-14 bg-primary-600 hover:bg-primary-500 text-lg shadow-lg shadow-primary-900/10">
                                <PlusCircle size={24} />
                                Book Appointment
                            </Button>
                        </Link>
                        <Button fullWidth variant="outline" className="justify-start gap-4 h-14 text-lg">
                            <Clipboard size={24} />
                            Medical History
                        </Button>
                    </CardContent>
                </Card>
            </div>

            {/* Recent Records Section */}
            <section>
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-dark-50">Recent Medical Records</h3>
                    <Link to="/records" className="text-sm font-medium text-primary-500 hover:text-primary-400">
                        View All History
                    </Link>
                </div>
                <Table
                    columns={columns}
                    data={recentRecords}
                    keyExtractor={(item) => item.id}
                    className="shadow-xl"
                />
            </section>
        </div>
    );
};

export default DashboardPage;
