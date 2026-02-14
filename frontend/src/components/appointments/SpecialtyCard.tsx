import { LucideIcon } from 'lucide-react';
import { Card, CardContent } from '@components/ui/Card';
import { cn } from '@utils';

interface SpecialtyCardProps {
    name: string;
    description: string;
    icon: LucideIcon;
    onClick?: () => void;
    className?: string;
}

export const SpecialtyCard = ({ name, description, icon: Icon, onClick, className }: SpecialtyCardProps) => {
    return (
        <Card
            className={cn(
                "cursor-pointer group transition-all duration-300 hover:border-primary-500/50 hover:shadow-2xl hover:shadow-primary-900/20 active:scale-95",
                className
            )}
            onClick={onClick}
        >
            <CardContent className="p-6">
                <div className="flex flex-col items-center text-center">
                    <div className="h-16 w-16 bg-dark-800 rounded-2xl flex items-center justify-center text-primary-400 mb-4 group-hover:bg-primary-900/40 group-hover:text-primary-300 transition-colors duration-300">
                        <Icon size={32} />
                    </div>
                    <h3 className="text-xl font-bold text-dark-50 mb-2 group-hover:text-primary-400 transition-colors">
                        {name}
                    </h3>
                    <p className="text-dark-400 text-sm leading-relaxed line-clamp-2">
                        {description}
                    </p>
                </div>
            </CardContent>
        </Card>
    );
};
