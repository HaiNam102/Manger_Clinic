import { useEffect, useState } from 'react';
import { Activity, Calendar, Users, Stethoscope, ArrowRight } from 'lucide-react';
import { apiClient } from '@api/client';

interface HealthStatus {
    status: string;
    service: string;
    timestamp: string;
}

function HomePage() {
    const [health, setHealth] = useState<HealthStatus | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const checkHealth = async () => {
            try {
                const response = await apiClient.get<HealthStatus>('/api/health');
                setHealth(response.data);
            } catch (err) {
                setError('Cannot connect to backend API');
            } finally {
                setLoading(false);
            }
        };

        checkHealth();
    }, []);

    return (
        <div className="min-h-screen flex flex-col">
            {/* Navigation */}
            <nav className="bg-dark-900 border-b border-white/5">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16 items-center">
                        <div className="flex items-center gap-2">
                            <Stethoscope className="h-8 w-8 text-primary" />
                            <span className="text-xl font-bold text-white">ClinicPro</span>
                        </div>
                        <div className="flex items-center gap-4">
                            <button className="btn btn-ghost btn-md">
                                Đăng nhập
                            </button>
                            <button className="btn btn-primary btn-md">
                                Đăng ký
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="flex-1 flex items-center justify-center py-20 px-4">
                <div className="text-center max-w-3xl">
                    <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6">
                        Hệ thống quản lý phòng khám{' '}
                        <span className="text-primary">thông minh</span>
                    </h1>
                    <p className="text-lg text-gray-400 mb-8">
                        Đặt lịch khám dễ dàng, quản lý hồ sơ bệnh án hiệu quả,
                        tích hợp AI để nâng cao chất lượng dịch vụ y tế.
                    </p>
                    <div className="flex flex-wrap justify-center gap-4">
                        <button className="btn btn-primary btn-lg">
                            <Calendar className="h-5 w-5" />
                            Đặt lịch khám ngay
                        </button>
                        <button className="btn btn-secondary btn-lg">
                            Tìm hiểu thêm
                            <ArrowRight className="h-5 w-5" />
                        </button>
                    </div>
                </div>
            </section>

            {/* Features Grid */}
            <section className="py-16 px-4 bg-dark-900/50">
                <div className="max-w-6xl mx-auto">
                    <h2 className="text-2xl font-bold text-center text-white mb-12">
                        Tại sao chọn ClinicPro?
                    </h2>
                    <div className="grid md:grid-cols-3 gap-6">
                        {/* Feature 1 */}
                        <div className="card text-center">
                            <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                                <Calendar className="h-7 w-7 text-primary" />
                            </div>
                            <h3 className="text-lg font-semibold text-white mb-2">
                                Đặt lịch thông minh
                            </h3>
                            <p className="text-gray-400 text-sm">
                                Tối ưu hóa việc đặt lịch với AI, giảm thời gian chờ đợi
                            </p>
                        </div>

                        {/* Feature 2 */}
                        <div className="card text-center">
                            <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-success/10 flex items-center justify-center">
                                <Users className="h-7 w-7 text-success" />
                            </div>
                            <h3 className="text-lg font-semibold text-white mb-2">
                                Đội ngũ bác sĩ chuyên môn
                            </h3>
                            <p className="text-gray-400 text-sm">
                                Kết nối với bác sĩ giỏi, đánh giá minh bạch từ bệnh nhân
                            </p>
                        </div>

                        {/* Feature 3 */}
                        <div className="card text-center">
                            <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-info/10 flex items-center justify-center">
                                <Activity className="h-7 w-7 text-info" />
                            </div>
                            <h3 className="text-lg font-semibold text-white mb-2">
                                Quản lý hồ sơ bệnh án
                            </h3>
                            <p className="text-gray-400 text-sm">
                                Lưu trữ an toàn, truy cập mọi lúc mọi nơi
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* API Status */}
            <section className="py-8 px-4 border-t border-white/5">
                <div className="max-w-xl mx-auto text-center">
                    <p className="text-sm text-gray-500 mb-2">Backend API Status</p>
                    {loading ? (
                        <div className="flex justify-center items-center gap-2 text-gray-400">
                            <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                            <span>Đang kiểm tra kết nối...</span>
                        </div>
                    ) : error ? (
                        <div className="badge badge-cancelled">
                            <span className="w-2 h-2 rounded-full bg-error" />
                            {error}
                        </div>
                    ) : health ? (
                        <div className="badge badge-confirmed">
                            <span className="w-2 h-2 rounded-full bg-success" />
                            {health.service}: {health.status}
                        </div>
                    ) : null}
                </div>
            </section>

            {/* Footer */}
            <footer className="py-6 px-4 bg-dark-900 border-t border-white/5">
                <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
                    <div className="flex items-center gap-2">
                        <Stethoscope className="h-5 w-5 text-primary" />
                        <span className="text-sm text-gray-400">
                            © 2026 ClinicPro. All rights reserved.
                        </span>
                    </div>
                    <div className="flex gap-6 text-sm text-gray-500">
                        <a href="#" className="hover:text-primary transition-colors">Điều khoản</a>
                        <a href="#" className="hover:text-primary transition-colors">Bảo mật</a>
                        <a href="#" className="hover:text-primary transition-colors">Liên hệ</a>
                    </div>
                </div>
            </footer>
        </div>
    );
}

export default HomePage;
