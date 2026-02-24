import { Link } from 'react-router-dom';
import { Button } from '@components/ui/Button';

const HomePage = () => {
    return (
        <div className="min-h-screen bg-dark-950 flex flex-col items-center justify-center p-4">
            <div className="text-center max-w-2xl animate-fade-in">
                <div className="mx-auto h-20 w-20 rounded-2xl bg-primary-600 flex items-center justify-center shadow-2xl shadow-primary-900/30 mb-8">
                    <span className="text-white text-4xl font-bold">C</span>
                </div>
                <h1 className="text-5xl font-extrabold text-dark-50 tracking-tight mb-4">
                    Clinic<span className="text-primary-500">Pro</span>
                </h1>
                <p className="text-xl text-dark-400 mb-10 leading-relaxed">
                    The all-in-one clinic management system designed for modern healthcare providers.
                    Efficiency, security, and patient care at your fingertips.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Link to="/login">
                        <Button size="lg" className="px-8 h-14 text-lg">
                            Get Started
                        </Button>
                    </Link>
                    <Link to="/register">
                        <Button variant="outline" size="lg" className="px-8 h-14 text-lg">
                            Create Account
                        </Button>
                    </Link>
                </div>

                <div className="mt-16 pt-8 border-t border-dark-900 grid grid-cols-3 gap-8">
                    {[
                        { label: 'Clinics', value: '100+' },
                        { label: 'Doctors', value: '500+' },
                        { label: 'Patients', value: '10k+' },
                    ].map((stat) => (
                        <div key={stat.label}>
                            <p className="text-2xl font-bold text-dark-50">{stat.value}</p>
                            <p className="text-sm text-dark-500">{stat.label}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default HomePage;
