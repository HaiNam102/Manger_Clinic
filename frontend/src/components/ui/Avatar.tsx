import { HTMLAttributes, forwardRef } from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export interface AvatarProps extends HTMLAttributes<HTMLDivElement> {
    src?: string;
    alt?: string;
    fallback?: string;
    size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
}

const Avatar = forwardRef<HTMLDivElement, AvatarProps>(
    ({ className, src, alt, fallback, size = 'md', ...props }, ref) => {
        const sizeClasses = {
            xs: 'h-6 w-6 text-[10px]',
            sm: 'h-8 w-8 text-xs',
            md: 'h-10 w-10 text-sm',
            lg: 'h-12 w-12 text-base',
            xl: 'h-16 w-16 text-xl',
        };

        return (
            <div
                ref={ref}
                className={cn(
                    'relative flex shrink-0 overflow-hidden rounded-full bg-dark-800 border-2 border-dark-700',
                    sizeClasses[size],
                    className
                )}
                {...props}
            >
                {src ? (
                    <img
                        src={src}
                        alt={alt || 'Avatar'}
                        className="h-full w-full object-cover"
                        onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none';
                        }}
                    />
                ) : null}

                {/* Fallback initials if image fails or no src */}
                <div className="flex h-full w-full items-center justify-center font-semibold uppercase text-dark-300 bg-dark-800">
                    {fallback?.substring(0, 2) || (alt?.substring(0, 1) || '?')}
                </div>
            </div>
        );
    }
);

Avatar.displayName = 'Avatar';

export { Avatar };
