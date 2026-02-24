import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Stethoscope, Heart, Eye, Brain, Baby, Bone, Activity, Search, Loader2, LucideIcon, Ear, Smile, Pill } from 'lucide-react';
import { SpecialtyCard } from '@components/appointments/SpecialtyCard';
import { Input } from '@components/ui/Input';
import { getAllSpecialties } from '@services/patientService';
import type { SpecialtyResponse } from '@/types';

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
        <div className="space-y-8 animate-fade-in">
            <section className="max-w-xl">
                <h1 className="text-3xl font-bold text-dark-50 tracking-tight">Chuyên khoa khám bệnh</h1>
                <p className="text-dark-400 mt-2 text-lg">
                    Chọn chuyên khoa bạn muốn đặt lịch khám.
                </p>
            </section>

            <div className="max-w-md relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-500" size={20} />
                <Input
                    placeholder="Tìm kiếm chuyên khoa..."
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {isLoading ? (
                <div className="flex items-center justify-center py-20">
                    <Loader2 size={32} className="animate-spin text-primary-500" />
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredSpecialties.map((specialty) => (
                        <SpecialtyCard
                            key={specialty.id}
                            name={specialty.name}
                            description={specialty.description || ''}
                            icon={iconMap[specialty.icon || ''] || Stethoscope}
                            onClick={() => handleSelect(specialty.id)}
                        />
                    ))}
                    {filteredSpecialties.length === 0 && (
                        <div className="col-span-full py-12 text-center bg-dark-900/30 rounded-2xl border border-dashed border-dark-700">
                            <p className="text-dark-400">Không tìm thấy chuyên khoa phù hợp với tìm kiếm của bạn.</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default SelectSpecialtyPage;
