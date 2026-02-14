import { Star, MapPin } from 'lucide-react';
import { Card, CardContent } from '@components/ui/Card';
import { Button } from '@components/ui/Button';
import { Avatar } from '@components/ui/Avatar';
import { cn } from '@utils';

interface DoctorCardProps {
    name: string;
    specialty: string;
    rating: number;
    reviewCount: number;
    location: string;
    avatarSrc?: string;
    onClick?: () => void;
    className?: string;
}

export const DoctorCard = ({
    name,
    specialty,
    rating,
    reviewCount,
    location,
    avatarSrc,
    onClick,
    className,
}: DoctorCardProps) => {
    return (
        <Card
            className={cn(
                "group transition-all duration-300 hover:border-primary-500/50 hover:shadow-xl",
                className
            )}
        >
            <CardContent className="p-5">
                <div className="flex gap-4">
                    <Avatar
                        src={avatarSrc}
                        fallback={name.split(' ').map(n => n[0]).join('')}
                        size="lg"
                        className="rounded-2xl shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-bold text-dark-50 truncate group-hover:text-primary-400 transition-colors">
                            {name}
                        </h3>
                        <p className="text-primary-500 text-sm font-medium mb-2">{specialty}</p>

                        <div className="flex items-center gap-1 mb-3">
                            <Star className="text-warning fill-warning" size={16} />
                            <span className="text-dark-100 font-bold text-sm">{rating.toFixed(1)}</span>
                            <span className="text-dark-400 text-xs">({reviewCount} reviews)</span>
                        </div>

                        <div className="flex items-center gap-1 text-dark-400 text-xs mb-4">
                            <MapPin size={14} />
                            <span className="truncate">{location}</span>
                        </div>

                        <Button size="sm" fullWidth onClick={onClick}>
                            Select Doctor
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};
