import { Toaster } from 'react-hot-toast';
import { AuthProvider } from '@contexts/AuthContext';
import { AppRouter } from './router/AppRouter';

function App() {
    return (
        <AuthProvider>
            <div className="min-h-screen bg-dark-950">
                {/* Toast notifications */}
                <Toaster
                    position="top-right"
                    toastOptions={{
                        duration: 4000,
                        className: 'bg-dark-800 text-dark-50 border border-dark-700',
                        success: {
                            iconTheme: {
                                primary: '#10B981',
                                secondary: '#F9FAFB',
                            },
                        },
                        error: {
                            iconTheme: {
                                primary: '#EF4444',
                                secondary: '#F9FAFB',
                            },
                        },
                    }}
                />

                {/* Router Settings */}
                <AppRouter />
            </div>
        </AuthProvider>
    );
}

export default App;
