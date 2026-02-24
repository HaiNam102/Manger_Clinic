import { useState, useEffect } from 'react';
import { User, Mail, Phone, Shield, Bell, Save, Loader2 } from 'lucide-react';
import { Card, CardHeader, CardContent } from '@components/ui/Card';
import { Button } from '@components/ui/Button';
import { Input } from '@components/ui/Input';
import { useAuth } from '@contexts/AuthContext';
import { useToast } from '@hooks/useToast';
import { Avatar } from '@components/ui/Avatar';
import { getMyProfile, updateMyProfile } from '@services/patientService';

const ProfilePage = () => {
    const { user } = useAuth();
    const { showToast } = useToast();

    const [formData, setFormData] = useState({
        fullName: user?.fullName || '',
        email: user?.email || '',
        phone: '',
    });
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    // Load profile from API
    useEffect(() => {
        const load = async () => {
            try {
                setIsLoading(true);
                const profile = await getMyProfile();
                setFormData({
                    fullName: profile.fullName || '',
                    email: profile.email || '',
                    phone: profile.phone || '',
                });
            } catch (error) {
                console.error('Failed to load profile:', error);
                // Fallback to auth context data
                setFormData({
                    fullName: user?.fullName || '',
                    email: user?.email || '',
                    phone: '',
                });
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

    return (
        <div className="space-y-8 animate-fade-in max-w-5xl mx-auto">
            <section>
                <h1 className="text-3xl font-bold text-dark-50 tracking-tight">Hồ sơ của bạn</h1>
                <p className="text-dark-400 mt-2 text-lg">
                    Quản lý cài đặt tài khoản và thông tin cá nhân của bạn.
                </p>
            </section>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Navigation Sidebar */}
                <div className="lg:col-span-1 space-y-2">
                    <Button variant="primary" fullWidth className="justify-start gap-3">
                        <User size={18} /> Thông tin cá nhân
                    </Button>
                    <Button variant="ghost" fullWidth className="justify-start gap-3 text-dark-400">
                        <Shield size={18} /> Bảo mật
                    </Button>
                    <Button variant="ghost" fullWidth className="justify-start gap-3 text-dark-400">
                        <Bell size={18} /> Thông báo
                    </Button>
                </div>

                {/* Main Form */}
                <div className="lg:col-span-3 space-y-6">
                    <Card>
                        <CardHeader title="Thông tin cá nhân" />
                        <CardContent className="space-y-6">
                            <div className="flex items-center gap-6 pb-6 border-b border-dark-700/50">
                                <Avatar
                                    size="xl"
                                    fallback={formData.fullName.split(' ').map(n => n[0]).join('')}
                                    className="rounded-2xl"
                                />
                                <div>
                                    <Button variant="outline" size="sm">Đổi ảnh đại diện</Button>
                                    <p className="text-xs text-dark-500 mt-2">Định dạng JPG, GIF hoặc PNG. Tối đa 800K</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-dark-300 flex items-center gap-2">
                                        <User size={14} className="text-primary-500" /> Họ và tên
                                    </label>
                                    <Input
                                        value={formData.fullName}
                                        onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-dark-300 flex items-center gap-2">
                                        <Mail size={14} className="text-primary-500" /> Địa chỉ Email
                                    </label>
                                    <Input
                                        disabled
                                        value={formData.email}
                                        className="bg-dark-900/50 cursor-not-allowed"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-dark-300 flex items-center gap-2">
                                        <Phone size={14} className="text-primary-500" /> Số điện thoại
                                    </label>
                                    <Input
                                        value={formData.phone}
                                        onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="flex justify-end pt-4">
                                <Button onClick={handleSave} disabled={isSaving} className="gap-2 px-8">
                                    {isSaving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                                    Lưu thay đổi
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-danger/20">
                        <CardHeader title="Vô hiệu hóa tài khoản" className="text-danger" />
                        <CardContent className="flex items-center justify-between">
                            <p className="text-dark-400 text-sm max-w-sm">
                                Một khi bạn vô hiệu hóa tài khoản, bạn sẽ không thể quay lại. Hãy chắc chắn về quyết định của mình.
                            </p>
                            <Button variant="ghost" className="text-danger hover:bg-danger/10">
                                Vô hiệu hóa
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
