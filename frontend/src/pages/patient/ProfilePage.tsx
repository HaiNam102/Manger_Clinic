import { useState, useEffect } from 'react';
import {
    User, Phone, Shield, Save, Loader2,
    MapPin, CreditCard, Activity, AlertCircle
} from 'lucide-react';
import { Card, CardContent } from '@components/ui/Card';
import { Button } from '@components/ui/Button';
import { Input } from '@components/ui/Input';
import { Select } from '@components/ui/Select';
import { Textarea } from '@components/ui/Textarea';
import { useAuth } from '@contexts/AuthContext';
import { useToast } from '@hooks/useToast';
import { Avatar } from '@components/ui/Avatar';
import { getMyProfile, updateMyProfile, getAllSpecialties } from '@services/patientService';
import type { Gender, SpecialtyResponse } from '@/types';

const ProfilePage = () => {
    const { user } = useAuth();
    const { showToast } = useToast();

    const [formData, setFormData] = useState({
        // User fields
        fullName: user?.fullName || '',
        email: user?.email || '',
        phone: '',

        // Common fields
        dateOfBirth: '',
        gender: '' as Gender | '',
        address: '',
        city: '',

        // Patient specific
        bloodType: '',
        allergies: '',
        chronicDiseases: '',
        emergencyContactName: '',
        emergencyContactPhone: '',
        insuranceNumber: '',

        // Doctor specific
        bio: '',
        experienceYears: 0,
        licenseNumber: '',
        consultationFee: 0,
        specialtyName: '',
        specialtyId: '',
        education: '',
        certifications: '',
    });

    const [specialties, setSpecialties] = useState<SpecialtyResponse[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    // Load profile and specialties from API
    useEffect(() => {
        const load = async () => {
            try {
                setIsLoading(true);
                const [profile, specialtiesList] = await Promise.all([
                    getMyProfile(),
                    getAllSpecialties(),
                ]);

                setSpecialties(specialtiesList);

                setFormData({
                    fullName: profile.fullName || '',
                    email: profile.email || '',
                    phone: profile.phone || '',

                    // Common
                    dateOfBirth: profile.dateOfBirth || '',
                    gender: (profile.gender as Gender) || '',
                    address: profile.address || '',
                    city: profile.city || '',

                    // Patient fields
                    bloodType: profile.bloodType || '',
                    allergies: profile.allergies?.join(', ') || '',
                    chronicDiseases: profile.chronicDiseases?.join(', ') || '',
                    emergencyContactName: profile.emergencyContactName || '',
                    emergencyContactPhone: profile.emergencyContactPhone || '',
                    insuranceNumber: profile.insuranceNumber || '',

                    // Doctor fields
                    bio: profile.bio || '',
                    experienceYears: profile.experienceYears || 0,
                    licenseNumber: profile.licenseNumber || '',
                    consultationFee: profile.consultationFee || 0,
                    specialtyId: profile.specialtyId || '',
                    specialtyName: profile.specialtyName || '',
                    education: profile.education?.join(', ') || '',
                    certifications: profile.certifications?.join(', ') || '',
                });
            } catch (error) {
                console.error('Failed to load profile:', error);
            } finally {
                setIsLoading(false);
            }
        };
        load();
    }, []);

    const handleSave = async () => {
        try {
            setIsSaving(true);
            showToast.loading('Đang cập nhật hồ sơ...');

            await updateMyProfile({
                fullName: formData.fullName,
                phone: formData.phone || undefined,
                dateOfBirth: formData.dateOfBirth || undefined,
                gender: formData.gender || undefined,
                address: formData.address || undefined,
                city: formData.city || undefined,

                // Doctor fields
                bio: formData.bio,
                experienceYears: formData.experienceYears,
                licenseNumber: formData.licenseNumber,
                consultationFee: formData.consultationFee,
                education: formData.education ? formData.education.split(',').map(s => s.trim()).filter(Boolean) : [],
                certifications: formData.certifications ? formData.certifications.split(',').map(s => s.trim()).filter(Boolean) : [],
                specialtyId: formData.specialtyId || undefined,

                // Patient fields
                bloodType: formData.bloodType || undefined,
                allergies: formData.allergies ? formData.allergies.split(',').map(s => s.trim()).filter(Boolean) : [],
                chronicDiseases: formData.chronicDiseases ? formData.chronicDiseases.split(',').map(s => s.trim()).filter(Boolean) : [],
                emergencyContactName: formData.emergencyContactName || undefined,
                emergencyContactPhone: formData.emergencyContactPhone || undefined,
                insuranceNumber: formData.insuranceNumber || undefined,
            });

            showToast.success('Cập nhật hồ sơ thành công!');
        } catch (error: any) {
            const msg = error?.response?.data?.message || 'Cập nhật hồ sơ thất bại.';
            showToast.error(msg);
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-20">
                <Loader2 size={32} className="animate-spin text-primary-500" />
            </div>
        );
    }

    const genderOptions = [
        { label: 'Nam', value: 'MALE' },
        { label: 'Nữ', value: 'FEMALE' },
        { label: 'Khác', value: 'OTHER' }
    ];

    const bloodTypeOptions = [
        { label: 'A+', value: 'A+' },
        { label: 'A-', value: 'A-' },
        { label: 'B+', value: 'B+' },
        { label: 'B-', value: 'B-' },
        { label: 'AB+', value: 'AB+' },
        { label: 'AB-', value: 'AB-' },
        { label: 'O+', value: 'O+' },
        { label: 'O-', value: 'O-' }
    ];

    const specialtyOptions = [
        { label: 'Chọn chuyên khoa', value: '' },
        ...specialties.map(s => ({ label: s.name, value: s.id }))
    ];

    const isDoctor = user?.role === 'DOCTOR';

    return (
        <div className="space-y-8 animate-fade-in max-w-6xl mx-auto pb-10">
            <section className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-dark-50 tracking-tight">Hồ sơ của bạn</h1>
                    <p className="text-dark-400 mt-2 text-lg">
                        Quản lý thông tin cá nhân và thiết lập tài khoản của bạn.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="outline" className="gap-2">
                        <Shield size={18} /> Bảo mật
                    </Button>
                    <Button onClick={handleSave} disabled={isSaving} className="gap-2 px-6">
                        {isSaving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                        Lưu thay đổi
                    </Button>
                </div>
            </section>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Avatar & Quick Info */}
                <div className="space-y-6">
                    <Card>
                        <CardContent className="pt-8 flex flex-col items-center text-center">
                            <div className="relative group">
                                <Avatar
                                    size="xxl"
                                    fallback={formData.fullName.split(' ').map(n => n[0]).join('')}
                                    className="rounded-3xl border-4 border-dark-700/50 shadow-2xl"
                                />
                                <button className="absolute inset-0 bg-dark-950/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-3xl flex items-center justify-center text-white text-sm font-medium">
                                    Thay đổi ảnh
                                </button>
                            </div>
                            <h2 className="mt-6 text-xl font-semibold text-dark-50">{formData.fullName}</h2>
                            <p className="text-dark-400 text-sm mt-1 flex items-center gap-1.5 capitalize">
                                <Shield size={14} className="text-primary-500" />
                                {user?.role?.toLowerCase()}
                            </p>
                            <div className="w-full h-px bg-dark-700/50 my-6" />
                            <div className="w-full space-y-4">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-dark-400">Email</span>
                                    <span className="text-dark-100">{formData.email}</span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-dark-400">Trạng thái</span>
                                    <span className="inline-flex items-center gap-1.5 text-success px-2 py-0.5 rounded-full bg-success/10 text-xs font-medium border border-success/20">
                                        <div className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
                                        Hoạt động
                                    </span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-primary-500/10 to-transparent border-primary-500/20">
                        <CardContent className="p-6">
                            <h3 className="text-lg font-medium text-dark-50 flex items-center gap-2">
                                <Activity size={18} className="text-primary-500" /> Mẹo hoàn thiện
                            </h3>
                            <p className="text-dark-300 text-sm mt-2 leading-relaxed">
                                Hãy chắc chắn rằng thông tin của bạn là chính xác nhất để bác sĩ có cái nhìn tổng quan tốt hơn về tình trạng sức khỏe của bạn.
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Right Column: Detailed Info */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Basic Information Section */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 px-2">
                            <div className="p-2 rounded-lg bg-primary-500/10 text-primary-500">
                                <User size={20} />
                            </div>
                            <h3 className="text-xl font-semibold text-dark-50">Thông tin cá nhân</h3>
                        </div>
                        <Card>
                            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
                                <Input
                                    label="Họ và tên"
                                    value={formData.fullName}
                                    onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                                    leftIcon={<User size={16} />}
                                    fullWidth
                                />
                                <Input
                                    label="Số điện thoại"
                                    value={formData.phone}
                                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                    leftIcon={<Phone size={16} />}
                                    fullWidth
                                />
                                <Input
                                    label="Ngày sinh"
                                    type="date"
                                    value={formData.dateOfBirth}
                                    onChange={e => setFormData({ ...formData, dateOfBirth: e.target.value })}
                                    fullWidth
                                />
                                <Select
                                    label="Giới tính"
                                    value={formData.gender}
                                    onChange={e => setFormData({ ...formData, gender: e.target.value as Gender })}
                                    options={genderOptions}
                                    placeholder="Chọn giới tính"
                                    fullWidth
                                />
                                <Input
                                    label="Địa chỉ"
                                    value={formData.address}
                                    onChange={e => setFormData({ ...formData, address: e.target.value })}
                                    leftIcon={<MapPin size={16} />}
                                    fullWidth
                                    className="md:col-span-2"
                                />
                                <Input
                                    label="Thành phố"
                                    value={formData.city}
                                    onChange={e => setFormData({ ...formData, city: e.target.value })}
                                    leftIcon={<MapPin size={16} />}
                                    fullWidth
                                />
                            </CardContent>
                        </Card>
                    </div>

                    {/* Professional/Medical Section */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 px-2">
                            <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-500">
                                {isDoctor ? <Shield size={20} /> : <Activity size={20} />}
                            </div>
                            <h3 className="text-xl font-semibold text-dark-50">
                                {isDoctor ? 'Thông tin nghề nghiệp' : 'Thông tin y tế'}
                            </h3>
                        </div>
                        <Card>
                            <CardContent className="space-y-6 pt-6">
                                {isDoctor ? (
                                    <>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <Select
                                                label="Chuyên khoa"
                                                value={formData.specialtyId}
                                                onChange={e => setFormData({ ...formData, specialtyId: e.target.value })}
                                                options={specialtyOptions}
                                                fullWidth
                                            />
                                            <Input
                                                label="Số GPKD / License"
                                                value={formData.licenseNumber}
                                                onChange={e => setFormData({ ...formData, licenseNumber: e.target.value })}
                                                fullWidth
                                            />
                                            <Input
                                                label="Số năm kinh nghiệm"
                                                type="number"
                                                value={formData.experienceYears}
                                                onChange={e => setFormData({ ...formData, experienceYears: parseInt(e.target.value) || 0 })}
                                                fullWidth
                                            />
                                            <Input
                                                label="Phí khám (VNĐ)"
                                                type="number"
                                                value={formData.consultationFee}
                                                onChange={e => setFormData({ ...formData, consultationFee: parseInt(e.target.value) || 0 })}
                                                fullWidth
                                            />
                                        </div>
                                        <Textarea
                                            label="Giới thiệu bản thân"
                                            value={formData.bio}
                                            onChange={e => setFormData({ ...formData, bio: e.target.value })}
                                            placeholder="Giới thiệu về kỹ năng, kinh nghiệm..."
                                            fullWidth
                                        />
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <Textarea
                                                label="Học vấn"
                                                value={formData.education}
                                                onChange={e => setFormData({ ...formData, education: e.target.value })}
                                                placeholder="VD: Thạc sĩ, Đại học Y Hà Nội..."
                                                fullWidth
                                            />
                                            <Textarea
                                                label="Chứng chỉ"
                                                value={formData.certifications}
                                                onChange={e => setFormData({ ...formData, certifications: e.target.value })}
                                                placeholder="VD: Chứng chỉ hành nghề X..."
                                                fullWidth
                                            />
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <Select
                                                label="Nhóm máu"
                                                value={formData.bloodType}
                                                onChange={e => setFormData({ ...formData, bloodType: e.target.value })}
                                                options={bloodTypeOptions}
                                                placeholder="Chọn nhóm máu"
                                                fullWidth
                                            />
                                            <Input
                                                label="Số thẻ bảo hiểm"
                                                value={formData.insuranceNumber}
                                                onChange={e => setFormData({ ...formData, insuranceNumber: e.target.value })}
                                                leftIcon={<CreditCard size={16} />}
                                                fullWidth
                                            />
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <Textarea
                                                label="Dị ứng"
                                                value={formData.allergies}
                                                onChange={e => setFormData({ ...formData, allergies: e.target.value })}
                                                placeholder="VD: Hải sản, Phấn hoa..."
                                                error={formData.allergies ? undefined : undefined}
                                                helperText="Cách nhau bằng dấu phẩy"
                                                fullWidth
                                            />
                                            <Textarea
                                                label="Bệnh mãn tính"
                                                value={formData.chronicDiseases}
                                                onChange={e => setFormData({ ...formData, chronicDiseases: e.target.value })}
                                                placeholder="VD: Tiểu đường, Cao huyết áp..."
                                                helperText="Cách nhau bằng dấu phẩy"
                                                fullWidth
                                            />
                                        </div>
                                        <div className="pt-4 border-t border-dark-700/50">
                                            <h4 className="text-sm font-medium text-dark-100 flex items-center gap-2 mb-4">
                                                <AlertCircle size={16} className="text-danger" /> Liên hệ khẩn cấp
                                            </h4>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <Input
                                                    label="Tên người liên hệ"
                                                    value={formData.emergencyContactName}
                                                    onChange={e => setFormData({ ...formData, emergencyContactName: e.target.value })}
                                                    placeholder="Tên người thân"
                                                    fullWidth
                                                />
                                                <Input
                                                    label="Số điện thoại khẩn cấp"
                                                    value={formData.emergencyContactPhone}
                                                    onChange={e => setFormData({ ...formData, emergencyContactPhone: e.target.value })}
                                                    placeholder="0123456789"
                                                    fullWidth
                                                />
                                            </div>
                                        </div>
                                    </>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Danger Zone Section */}
                    <div className="pt-6 border-t border-dark-700/50">
                        <Card className="border-danger/20 bg-danger/5">
                            <CardContent className="flex flex-col md:flex-row md:items-center justify-between gap-4 py-6">
                                <div>
                                    <h4 className="text-lg font-semibold text-danger">Vô hiệu hóa tài khoản</h4>
                                    <p className="text-dark-400 text-sm mt-1 max-w-sm">
                                        Một khi bạn vô hiệu hóa tài khoản, bạn sẽ không thể truy cập lại dữ liệu của mình.
                                    </p>
                                </div>
                                <Button variant="ghost" className="text-danger hover:bg-danger/10 border border-danger/20">
                                    Vô hiệu hóa ngay
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
