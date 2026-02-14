import { NavLink } from 'react-router-dom';
import {
    LayoutDashboard,
    Calendar,
    Users,
    ClipboardList,
    Settings,
    X
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

const navItems = [
    { name: 'Dashboard', icon: LayoutDashboard, href: '/dashboard' },
    { name: 'Appointments', icon: Calendar, href: '/appointments' },
    { name: 'Patients', icon: Users, href: '/patients' },
    { name: 'Medical Records', icon: ClipboardList, href: '/records' },
    { name: 'Settings', icon: Settings, href: '/settings' },
];

export const Sidebar = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
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
                    <div className="flex h-16 items-center justify-between px-6 lg:hidden border-b border-dark-700">
                        <span className="text-xl font-bold text-dark-50">Menu</span>
                        <button onClick={onClose} className="p-2 text-dark-400 hover:bg-dark-800 rounded-lg">
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
                                        'group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors',
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

                    <div className="p-4 border-t border-dark-700">
                        <div className="bg-dark-800/50 rounded-xl p-4 border border-dark-700">
                            <p className="text-xs text-dark-400 mb-2">Logged in as</p>
                            <p className="text-sm font-semibold text-dark-50 truncate">nguyen.van.a@clinic.com</p>
                        </div>
                    </div>
                </div>
            </aside>
        </>
    );
};
