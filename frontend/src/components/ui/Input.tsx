import { InputHTMLAttributes, forwardRef } from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    helperText?: string;
    fullWidth?: boolean;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ className, label, error, helperText, fullWidth, leftIcon, rightIcon, id, ...props }, ref) => {
        const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

        return (
            <div className={cn('flex flex-col gap-1.5', fullWidth && 'w-full')}>
                {label && (
                    <label
                        htmlFor={inputId}
                        className="text-sm font-medium text-dark-100"
                    >
                        {label}
                    </label>
                )}
                <div className="relative">
                    {leftIcon && (
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-400 pointer-events-none">
                            {leftIcon}
                        </div>
                    )}
                    <input
                        id={inputId}
                        ref={ref}
                        className={cn(
                            'flex h-11 w-full rounded-lg border border-dark-700 bg-dark-800 px-4 py-2 text-sm text-dark-50 ring-offset-dark-950 file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-dark-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-150',
                            leftIcon && 'pl-10',
                            rightIcon && 'pr-10',
                            error && 'border-error focus-visible:ring-error',
                            className
                        )}
                        {...props}
                    />
                    {rightIcon && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-dark-400 pointer-events-none">
                            {rightIcon}
                        </div>
                    )}
                </div>
                {(error || helperText) && (
                    <p
                        className={cn(
                            'text-xs mt-0.5',
                            error ? 'text-error' : 'text-dark-400'
                        )}
                    >
                        {error || helperText}
                    </p>
                )}
            </div>
        );
    }
);

Input.displayName = 'Input';

export { Input };
