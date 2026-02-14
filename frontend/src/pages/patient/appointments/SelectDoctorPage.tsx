import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Filter } from 'lucide-react';
import { Button } from '@components/ui/Button';
import { DoctorCard } from '@components/appointments/DoctorCard';

const mockDoctors = [
    { id: '1', name: 'Dr. Nguyen Van A', specialtyId: '2', specialtyName: 'Cardiology', rating: 4.9, reviewCount: 124, location: 'Hai Nam Medical Center - Tower A' },
    { id: '2', name: 'Dr. Tran Van C', specialtyId: '2', specialtyName: 'Cardiology', rating: 4.7, reviewCount: 89, location: 'Hai Nam Medical Center - Tower B' },
    { id: '3', name: 'Dr. Le Thi D', specialtyId: '1', specialtyName: 'General Medicine', rating: 4.8, reviewCount: 210, location: 'Ground Floor, Tower A' },
    { id: '4', name: 'Dr. Pham Van E', specialtyId: '5', specialtyName: 'Pediatrics', rating: 5.0, reviewCount: 45, location: '3rd Floor, Tower B' },
];

const SelectDoctorPage = () => {
    const { specialtyId } = useParams<{ specialtyId: string }>();
    const navigate = useNavigate();

    const doctors = mockDoctors.filter(d => d.specialtyId === specialtyId);
    const specialtyName = doctors[0]?.specialtyName || 'Selected Specialty';

    const handleSelect = (doctorId: string) => {
        navigate(`/booking/date-time/${specialtyId}/${doctorId}`);
    };

    return (
        <div className="space-y-8 animate-fade-in">
            {/* Header */}
            <section className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div className="space-y-2">
                    <Button
                        variant="ghost"
                        size="sm"
                        className="p-0 text-dark-400 hover:text-dark-200"
                        onClick={() => navigate('/booking/specialty')}
                    >
                        <ArrowLeft size={16} className="mr-1" /> Back to Specialties
                    </Button>
                    <h1 className="text-3xl font-bold text-dark-50 tracking-tight">
                        Choose a <span className="text-primary-500">{specialtyName}</span> Specialist
                    </h1>
                    <p className="text-dark-400 text-lg">
                        We found {doctors.length} doctors available for this specialty.
                    </p>
                </div>

                <div className="flex gap-3">
                    <Button variant="outline" size="sm" className="gap-2">
                        <Filter size={16} /> Filters
                    </Button>
                </div>
            </section>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {doctors.map((doctor) => (
                    <DoctorCard
                        key={doctor.id}
                        name={doctor.name}
                        specialty={doctor.specialtyName}
                        rating={doctor.rating}
                        reviewCount={doctor.reviewCount}
                        location={doctor.location}
                        onClick={() => handleSelect(doctor.id)}
                    />
                ))}
                {doctors.length === 0 && (
                    <div className="col-span-full py-16 text-center bg-dark-900/30 rounded-2xl border border-dashed border-dark-700">
                        <p className="text-dark-400 text-lg">No doctors available for this specialty at the moment.</p>
                        <Button variant="outline" className="mt-4" onClick={() => navigate('/booking/specialty')}>
                            Select Another Specialty
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SelectDoctorPage;
