import { ReactNode } from 'react';

export const AuthLayout = ({ children, title, subtitle }: { children: ReactNode, title: string, subtitle?: string }) => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-dark-950 p-4">
            <div className="w-full max-w-md space-y-8 animate-fade-in">
                <div className="text-center">
                    <div className="mx-auto h-16 w-16 rounded-2xl bg-primary-600 flex items-center justify-center shadow-lg shadow-primary-900/20 mb-6">
                        <span className="text-white text-3xl font-bold">C</span>
                    </div>
                    <h1 className="text-3xl font-bold text-dark-50 tracking-tight">
                        Clinic<span className="text-primary-500">Pro</span>
                    </h1>
                    <h2 className="mt-4 text-xl font-semibold text-dark-50">{title}</h2>
                    {subtitle && <p className="mt-2 text-sm text-dark-400">{subtitle}</p>}
                </div>

                <div className="bg-dark-900 border border-dark-700/50 rounded-2xl p-8 shadow-xl shadow-black/20">
                    {children}
                </div>

                <p className="text-center text-xs text-dark-500">
                    &copy; 2026 ClinicPro Modern Management System. All rights reserved.
                </p>
            </div>
        </div>
    );
};
