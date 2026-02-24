import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Filter, Loader2 } from 'lucide-react';
import { Button } from '@components/ui/Button';
import { DoctorCard } from '@components/appointments/DoctorCard';
import { DoctorReviewsModal } from '@components/appointments/DoctorReviewsModal';
import { getDoctorsBySpecialty, getAllSpecialties } from '@services/patientService';
import type { DoctorResponse, SpecialtyResponse } from '@/types';

const SelectDoctorPage = () => {
    const { specialtyId } = useParams<{ specialtyId: string }>();
    const navigate = useNavigate();
    const [doctors, setDoctors] = useState<DoctorResponse[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [specialtyName, setSpecialtyName] = useState('Chuyên khoa');
    const [selectedDoctorForReviews, setSelectedDoctorForReviews] = useState<{ id: string; name: string } | null>(null);

    useEffect(() => {
        if (!specialtyId) return;
        const load = async () => {
            try {
                setIsLoading(true);
                const [doctorsData, specialtiesData] = await Promise.all([
                    getDoctorsBySpecialty(specialtyId),
                    getAllSpecialties()
                ]);

                setDoctors(doctorsData);

                // Try to get name from doctors first, then from specialty list
                const nameFromDoctors = doctorsData[0]?.specialtyName;
                const nameFromList = (specialtiesData as SpecialtyResponse[]).find(s => s.id === specialtyId)?.name;
                setSpecialtyName(nameFromDoctors || nameFromList || 'Chuyên khoa');

            } catch (error) {
                console.error('Failed to load doctors:', error);
            } finally {
                setIsLoading(false);
            }
        };
        load();
    }, [specialtyId]);

    const handleSelect = (doctorId: string) => {
        navigate(`/booking/date-time/${specialtyId}/${doctorId}`);
    };

    return (
        <div className="space-y-8 animate-fade-in">
            <section className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div className="space-y-2">
                    <Button
                        variant="ghost"
                        size="sm"
                        className="p-0 text-dark-400 hover:text-dark-200"
                        onClick={() => navigate('/booking/specialty')}
                    >
                        <ArrowLeft size={16} className="mr-1" /> Quay lại chuyên khoa
                    </Button>
                    <h1 className="text-3xl font-bold text-dark-50 tracking-tight">
                        Chọn bác sĩ <span className="text-primary-500">{specialtyName}</span>
                    </h1>
                    <p className="text-dark-400 text-lg">
                        Tìm thấy {doctors.length} bác sĩ trong chuyên khoa này.
                    </p>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" size="sm" className="gap-2">
                        <Filter size={16} /> Bộ lọc
                    </Button>
                </div>
            </section>

            {isLoading ? (
                <div className="flex items-center justify-center py-20">
                    <Loader2 size={32} className="animate-spin text-primary-500" />
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {doctors.map((doctor) => (
                        <DoctorCard
                            key={doctor.id}
                            name={doctor.fullName}
                            specialty={doctor.specialtyName || ''}
                            rating={doctor.avgRating || 0}
                            reviewCount={doctor.totalReviews || 0}
                            location={doctor.bio || ''}
                            onViewReviews={() => setSelectedDoctorForReviews({ id: doctor.id, name: doctor.fullName })}
                            onClick={() => handleSelect(doctor.id)}
                        />
                    ))}
                    {doctors.length === 0 && (
                        <div className="col-span-full py-16 text-center bg-dark-900/30 rounded-2xl border border-dashed border-dark-700">
                            <p className="text-dark-400 text-lg">Hiện tại không có bác sĩ nào thuộc chuyên khoa này.</p>
                            <Button variant="outline" className="mt-4" onClick={() => navigate('/booking/specialty')}>
                                Chọn chuyên khoa khác
                            </Button>
                        </div>
                    )}
                </div>
            )}

            {selectedDoctorForReviews && (
                <DoctorReviewsModal
                    isOpen={!!selectedDoctorForReviews}
                    onClose={() => setSelectedDoctorForReviews(null)}
                    doctorId={selectedDoctorForReviews.id}
                    doctorName={selectedDoctorForReviews.name}
                />
            )}
        </div>
    );
};

export default SelectDoctorPage;
