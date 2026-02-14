import { Menu, Bell } from 'lucide-react';
import { Avatar } from '@components/ui/Avatar';

export const Header = ({ onMenuClick }: { onMenuClick?: () => void }) => {
    return (
        <header className="sticky top-0 z-40 w-full border-b border-dark-700 bg-dark-950/80 backdrop-blur-md">
            <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
                <div className="flex items-center gap-4">
                    <button
                        onClick={onMenuClick}
                        className="p-2 text-dark-400 lg:hidden hover:bg-dark-800 rounded-lg"
                    >
                        <Menu size={24} />
                    </button>
                    <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-lg bg-primary-600 flex items-center justify-center">
                            <span className="text-white font-bold">C</span>
                        </div>
                        <span className="text-xl font-bold tracking-tight text-dark-50 hidden sm:block">
                            Clinic<span className="text-primary-500">Pro</span>
                        </span>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <button className="relative p-2 text-dark-400 hover:text-dark-50 hover:bg-dark-800 rounded-full transition-colors">
                        <Bell size={20} />
                        <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-error" />
                    </button>

                    <div className="h-6 w-px bg-dark-700 mx-2" />

                    <div className="flex items-center gap-3 pl-2">
                        <div className="hidden text-right md:block">
                            <p className="text-sm font-medium text-dark-50">Dr. Nguyen Van A</p>
                            <p className="text-xs text-dark-400">Doctor</p>
                        </div>
                        <Avatar fallback="NV" size="sm" className="cursor-pointer" />
                    </div>
                </div>
            </div>
        </header>
    );
};
