import { useState } from 'react';
import { User, Mail, Phone, MapPin, Shield, Bell, Save } from 'lucide-react';
import { Card, CardHeader, CardContent } from '@components/ui/Card';
import { Button } from '@components/ui/Button';
import { Input } from '@components/ui/Input';
import { useAuth } from '@contexts/AuthContext';
import { useToast } from '@hooks/useToast';
import { Avatar } from '@components/ui/Avatar';

const ProfilePage = () => {
    const { user } = useAuth();
    const { showToast } = useToast();

    const [formData, setFormData] = useState({
        fullName: user?.fullName || '',
        email: user?.email || '',
        phone: '0987 654 321', // Example mock
        address: '123 Medical St, Da Nang, Vietnam',
    });

    const handleSave = () => {
        showToast.loading('Updating profile...');
        setTimeout(() => {
            showToast.success('Profile updated successfully!');
        }, 1000);
    };

    return (
        <div className="space-y-8 animate-fade-in max-w-5xl mx-auto">
            <section>
                <h1 className="text-3xl font-bold text-dark-50 tracking-tight">Your Profile</h1>
                <p className="text-dark-400 mt-2 text-lg">
                    Manage your account settings and personal information.
                </p>
            </section>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Navigation Sidebar */}
                <div className="lg:col-span-1 space-y-2">
                    <Button variant="primary" fullWidth className="justify-start gap-3">
                        <User size={18} /> Personal Info
                    </Button>
                    <Button variant="ghost" fullWidth className="justify-start gap-3 text-dark-400">
                        <Shield size={18} /> Security
                    </Button>
                    <Button variant="ghost" fullWidth className="justify-start gap-3 text-dark-400">
                        <Bell size={18} /> Notifications
                    </Button>
                </div>

                {/* Main Form */}
                <div className="lg:col-span-3 space-y-6">
                    <Card>
                        <CardHeader title="Personal Information" />
                        <CardContent className="space-y-6">
                            <div className="flex items-center gap-6 pb-6 border-b border-dark-700/50">
                                <Avatar
                                    size="xl"
                                    fallback={formData.fullName.split(' ').map(n => n[0]).join('')}
                                    className="rounded-2xl"
                                />
                                <div>
                                    <Button variant="outline" size="sm">Change Photo</Button>
                                    <p className="text-xs text-dark-500 mt-2">JPG, GIF or PNG. Max size of 800K</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-dark-300 flex items-center gap-2">
                                        <User size={14} className="text-primary-500" /> Full Name
                                    </label>
                                    <Input
                                        value={formData.fullName}
                                        onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-dark-300 flex items-center gap-2">
                                        <Mail size={14} className="text-primary-500" /> Email Address
                                    </label>
                                    <Input
                                        disabled
                                        value={formData.email}
                                        className="bg-dark-900/50 cursor-not-allowed"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-dark-300 flex items-center gap-2">
                                        <Phone size={14} className="text-primary-500" /> Phone Number
                                    </label>
                                    <Input
                                        value={formData.phone}
                                        onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-dark-300 flex items-center gap-2">
                                        <MapPin size={14} className="text-primary-500" /> Address
                                    </label>
                                    <Input
                                        value={formData.address}
                                        onChange={e => setFormData({ ...formData, address: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="flex justify-end pt-4">
                                <Button onClick={handleSave} className="gap-2 px-8">
                                    <Save size={18} /> Save Changes
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-danger/20">
                        <CardHeader title="Deactivate Account" className="text-danger" />
                        <CardContent className="flex items-center justify-between">
                            <p className="text-dark-400 text-sm max-w-sm">
                                Once you deactivate your account, there is no going back. Please be certain.
                            </p>
                            <Button variant="ghost" className="text-danger hover:bg-danger/10">
                                Deactivate
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
