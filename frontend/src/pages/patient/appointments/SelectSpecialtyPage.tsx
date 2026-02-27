import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Stethoscope, Heart, Eye, Brain, Baby, Bone, Activity, Search, Loader2, LucideIcon, Ear, Smile, Pill } from 'lucide-react';
import { SpecialtyCard } from '@components/appointments/SpecialtyCard';
import { Input } from '@components/ui/Input';
import { getAllSpecialties } from '@services/patientService';
import type { SpecialtyResponse } from '@/types';

import { BookingStepper } from '@components/appointments/BookingStepper';
import { SpecialtySkeleton } from '@components/appointments/BookingSkeletons';

// Map icon name from DB → Lucide component
const iconMap: Record<string, LucideIcon> = {
    Stethoscope, Heart, Eye, Brain, Baby, Bone, Activity, Ear, Smile, Pill,
};

const SelectSpecialtyPage = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [specialties, setSpecialties] = useState<SpecialtyResponse[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            try {
                setIsLoading(true);
                const data = await getAllSpecialties();
                setSpecialties(data);
            } catch (error) {
                console.error('Failed to load specialties:', error);
            } finally {
                setIsLoading(false);
            }
        };
        load();
    }, []);

    const filteredSpecialties = useMemo(() =>
        specialties.filter(s => s.name.toLowerCase().includes(searchTerm.toLowerCase())),
        [specialties, searchTerm]
    );

    const handleSelect = (id: string) => {
        navigate(`/booking/doctor/${id}`);
    };

    return (
        <div className="max-w-7xl mx-auto space-y-12 animate-fade-in pb-20">
            <BookingStepper currentStep={1} />

            <section className="text-center space-y-4 max-w-2xl mx-auto">
                <h1 className="text-4xl font-extrabold text-dark-50 tracking-tight sm:text-5xl">
                    Đặt lịch khám chuyên khoa
                </h1>
                <p className="text-dark-400 text-lg">
                    Hệ thống bác sĩ hàng đầu, trang thiết bị hiện đại. Hãy chọn chuyên khoa bạn cần tư vấn.
                </p>

                <div className="pt-4 max-w-md mx-auto relative group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-dark-500 group-focus-within:text-primary-500 transition-colors" size={20} />
                    <Input
                        placeholder="Tìm kiếm chuyên khoa (ví dụ: Nội khoa, Tim mạch...)"
                        className="pl-12 py-6 bg-dark-900/50 border-dark-700/50 focus:bg-dark-800 transition-all rounded-2xl"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </section>

            {isLoading ? (
                <SpecialtySkeleton />
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 px-4 sm:px-0">
                    {filteredSpecialties.map((specialty) => (
                        <SpecialtyCard
                            key={specialty.id}
                            name={specialty.name}
                            description={specialty.description || ''}
                            icon={iconMap[specialty.icon || ''] || Stethoscope}
                            onClick={() => handleSelect(specialty.id)}
                            className="h-full"
                        />
                    ))}
                    {filteredSpecialties.length === 0 && (
                        <div className="col-span-full py-20 text-center bg-dark-900/30 rounded-3xl border border-dashed border-dark-700">
                            <div className="h-20 w-20 bg-dark-800 rounded-full flex items-center justify-center mx-auto mb-4 text-dark-500">
                                <Search size={32} />
                            </div>
                            <h3 className="text-xl font-bold text-dark-200">Không tìm thấy chuyên khoa</h3>
                            <p className="text-dark-400 mt-2">Vui lòng thử từ khóa khác hoặc liên hệ hotline để được hỗ trợ.</p>
                            <Button variant="ghost" className="mt-6 text-primary-500" onClick={() => setSearchTerm('')}>
                                Xóa tìm kiếm
                            </Button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default SelectSpecialtyPage;
