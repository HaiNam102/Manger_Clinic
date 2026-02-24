import { NavLink } from 'react-router-dom';
import {
    LayoutDashboard,
    Calendar,
    Users,
    ClipboardList,
    Settings,
    X,
    PlusCircle,
    FileText,
    Clock,
    UserCircle
} from 'lucide-react';

import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { useAuth } from '@contexts/AuthContext';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

// Role-based navigation items
const doctorNavItems = [
    { name: 'Dashboard', icon: LayoutDashboard, href: '/doctor/dashboard' },
    { name: 'Lịch hẹn', icon: Calendar, href: '/doctor/appointments' },
    { name: 'Lịch tuần', icon: Clock, href: '/doctor/calendar' },
    { name: 'Bệnh nhân', icon: Users, href: '/doctor/patients' },
    { name: 'Lịch làm việc', icon: ClipboardList, href: '/doctor/schedule' },
    { name: 'Hồ sơ', icon: UserCircle, href: '/profile' },
];


const patientNavItems = [
    { name: 'Dashboard', icon: LayoutDashboard, href: '/dashboard' },
    { name: 'Đặt lịch khám', icon: PlusCircle, href: '/booking/specialty' },
    { name: 'Lịch hẹn của tôi', icon: Calendar, href: '/appointments' },
    { name: 'Bệnh án', icon: FileText, href: '/medical-history' },
    { name: 'Hồ sơ', icon: UserCircle, href: '/profile' },
];

const adminNavItems = [
    { name: 'Dashboard', icon: LayoutDashboard, href: '/admin/dashboard' },
    { name: 'Doctors', icon: Users, href: '/admin/doctors' },
    { name: 'Appointments', icon: Calendar, href: '/admin/appointments' },
    { name: 'Medical Records', icon: ClipboardList, href: '/admin/records' },
    { name: 'Settings', icon: Settings, href: '/admin/settings' },
];

function getNavItems(role?: string) {
    switch (role) {
        case 'DOCTOR':
            return doctorNavItems;
        case 'ADMIN':
            return adminNavItems;
        default:
            return patientNavItems;
    }
}

export const Sidebar = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
    const { user } = useAuth();
    const navItems = getNavItems(user?.role);

    return (
        <>
            {/* Mobile Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/60 lg:hidden"
                    onClick={onClose}
                />
            )}

            <aside
                className={cn(
                    'fixed inset-y-0 left-0 z-50 w-64 bg-dark-900 border-r border-dark-700 transition-transform duration-300 ease-in-out lg:static lg:translate-x-0',
                    isOpen ? 'translate-x-0' : '-translate-x-full'
                )}
            >
                <div className="flex flex-col h-full">
                    {/* Logo / Brand */}
                    <div className="flex h-16 items-center justify-between px-6 border-b border-dark-700">
                        <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-lg bg-primary-600 flex items-center justify-center">
                                <span className="text-white font-bold text-sm">CP</span>
                            </div>
                            <span className="text-lg font-bold text-dark-50">ClinicPro</span>
                        </div>
                        <button onClick={onClose} className="p-2 text-dark-400 hover:bg-dark-800 rounded-lg lg:hidden">
                            <X size={24} />
                        </button>
                    </div>

                    <nav className="flex-1 space-y-1 px-4 py-6">
                        {navItems.map((item) => (
                            <NavLink
                                key={item.name}
                                to={item.href}
                                className={({ isActive }) =>
                                    cn(
                                        'group flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors',
                                        isActive
                                            ? 'bg-primary-900/40 text-primary-400 border border-primary-700/30'
                                            : 'text-dark-300 hover:text-dark-50 hover:bg-dark-800'
                                    )
                                }
                                onClick={() => {
                                    if (window.innerWidth < 1024) onClose();
                                }}
                            >
                                <item.icon className="mr-3 h-5 w-5 flex-shrink-0" />
                                {item.name}
                            </NavLink>
                        ))}
                    </nav>

                    {/* User info */}
                    <div className="p-4 border-t border-dark-700">
                        <div className="bg-dark-800/50 rounded-xl p-4 border border-dark-700">
                            <p className="text-xs text-dark-400 mb-1">
                                {user?.role === 'DOCTOR' ? '🩺 Doctor' : user?.role === 'ADMIN' ? '⚙️ Admin' : '👤 Patient'}
                            </p>
                            <p className="text-sm font-semibold text-dark-50 truncate">
                                {user?.fullName || 'User'}
                            </p>
                            <p className="text-xs text-dark-500 truncate mt-0.5">
                                {user?.email || ''}
                            </p>
                        </div>
                    </div>
                </div>
            </aside>
        </>
    );
};
