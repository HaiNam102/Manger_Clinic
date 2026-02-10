import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import HomePage from '@pages/HomePage';

function App() {
    return (
        <div className="min-h-screen bg-dark-950">
            {/* Toast notifications */}
            <Toaster
                position="top-right"
                toastOptions={{
                    duration: 4000,
                    style: {
                        background: '#1F2937',
                        color: '#F9FAFB',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                    },
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

            {/* Routes */}
            <Routes>
                <Route path="/" element={<HomePage />} />
                {/* Add more routes as we implement them */}
                {/* <Route path="/login" element={<LoginPage />} /> */}
                {/* <Route path="/register" element={<RegisterPage />} /> */}
                {/* <Route path="/dashboard" element={<DashboardPage />} /> */}
            </Routes>
        </div>
    );
}

export default App;
