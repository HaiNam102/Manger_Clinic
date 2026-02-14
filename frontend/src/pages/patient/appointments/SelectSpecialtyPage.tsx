import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Stethoscope, Heart, Eye, Brain, Baby, Bone, Activity, Search } from 'lucide-react';
import { SpecialtyCard } from '@components/appointments/SpecialtyCard';
import { Input } from '@components/ui/Input';

const specialties = [
    { id: '1', name: 'General Medicine', description: 'Comprehensive primary care for adults and children.', icon: Stethoscope },
    { id: '2', name: 'Cardiology', description: 'Advanced heart care and cardiovascular diagnosis.', icon: Heart },
    { id: '3', name: 'Ophthalmology', description: 'Complete eye exams and vision health services.', icon: Eye },
    { id: '4', name: 'Neurology', description: 'Expert care for brain and nervous system disorders.', icon: Brain },
    { id: '5', name: 'Pediatrics', description: 'Compassionate medical care for infants, children, and teens.', icon: Baby },
    { id: '6', name: 'Orthopedics', description: 'Specialized care for bones, joints, and ligaments.', icon: Bone },
    { id: '7', name: 'Dermatology', description: 'Skin health diagnosis and professional treatments.', icon: Activity },
];

const SelectSpecialtyPage = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');

    const filteredSpecialties = specialties.filter(s =>
        s.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleSelect = (id: string) => {
        navigate(`/booking/doctor/${id}`);
    };

    return (
        <div className="space-y-8 animate-fade-in">
            <section className="max-w-xl">
                <h1 className="text-3xl font-bold text-dark-50 tracking-tight">Select a Specialty</h1>
                <p className="text-dark-400 mt-2 text-lg">
                    Choose the medical department you would like to book an appointment with.
                </p>
            </section>

            {/* Search Section */}
            <div className="max-w-md relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-500" size={20} />
                <Input
                    placeholder="Search specialties..."
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredSpecialties.map((specialty) => (
                    <SpecialtyCard
                        key={specialty.id}
                        name={specialty.name}
                        description={specialty.description}
                        icon={specialty.icon}
                        onClick={() => handleSelect(specialty.id)}
                    />
                ))}
                {filteredSpecialties.length === 0 && (
                    <div className="col-span-full py-12 text-center bg-dark-900/30 rounded-2xl border border-dashed border-dark-700">
                        <p className="text-dark-400">No specialties found matching your search.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SelectSpecialtyPage;
