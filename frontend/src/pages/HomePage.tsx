import { Link } from 'react-router-dom';
import { Button } from '@components/ui/Button';
import {
    Shield, Calendar, ClipboardList, CreditCard, Clock,
    Users, ArrowRight, Stethoscope, Activity,
    ChevronRight, Star, Heart, Zap, Lock
} from 'lucide-react';

// ─── Feature Card ───────────────────────────────────────
const FeatureCard = ({ icon: Icon, title, description, color, delay }: {
    icon: React.ElementType;
    title: string;
    description: string;
    color: string;
    delay: number;
}) => (
    <div
        className="group relative p-6 rounded-2xl border border-th-800/80 bg-th-900/50 hover:bg-th-900/80 hover:border-primary-700/40 transition-all duration-300 cursor-pointer animate-fade-in-up"
        style={{ animationDelay: `${delay}ms` }}
    >
        <div className={`w-12 h-12 rounded-xl ${color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
            <Icon size={22} />
        </div>
        <h3 className="text-lg font-bold text-th-50 mb-2">{title}</h3>
        <p className="text-th-400 text-sm leading-relaxed">{description}</p>
    </div>
);

// ─── Stat Counter ───────────────────────────────────────
const StatItem = ({ value, label, delay }: { value: string; label: string; delay: number }) => (
    <div className="text-center animate-fade-in-up" style={{ animationDelay: `${delay}ms` }}>
        <p className="text-4xl md:text-5xl font-black text-gradient tracking-tight">{value}</p>
        <p className="text-th-400 text-sm font-medium mt-2">{label}</p>
    </div>
);

// ─── Step Card ──────────────────────────────────────────
const StepCard = ({ step, title, description, delay }: {
    step: number; title: string; description: string; delay: number;
}) => (
    <div className="relative flex flex-col items-center text-center animate-fade-in-up" style={{ animationDelay: `${delay}ms` }}>
        <div className="w-14 h-14 rounded-2xl bg-primary-600 flex items-center justify-center text-white text-xl font-black shadow-lg shadow-primary-900/40 mb-4">
            {step}
        </div>
        <h4 className="text-lg font-bold text-th-50 mb-1">{title}</h4>
        <p className="text-th-400 text-sm leading-relaxed max-w-xs">{description}</p>
    </div>
);

// ─── Testimonial Card ───────────────────────────────────
const TestimonialCard = ({ name, role, text, delay }: {
    name: string; role: string; text: string; delay: number;
}) => (
    <div
        className="p-6 rounded-2xl border border-th-800/80 bg-th-900/40 animate-fade-in-up"
        style={{ animationDelay: `${delay}ms` }}
    >
        <div className="flex gap-1 mb-4">
            {[...Array(5)].map((_, i) => <Star key={i} size={14} className="text-amber-400 fill-amber-400" />)}
        </div>
        <p className="text-th-300 text-sm leading-relaxed mb-5 italic">"{text}"</p>
        <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary-900/40 flex items-center justify-center text-primary-400 font-bold text-sm">
                {name.charAt(0)}
            </div>
            <div>
                <p className="text-th-50 font-semibold text-sm">{name}</p>
                <p className="text-th-500 text-xs">{role}</p>
            </div>
        </div>
    </div>
);

const HomePage = () => {
    return (
        <div className="min-h-screen bg-th-950 overflow-hidden">
            {/* ─── Navbar ─────────────────────────────────── */}
            <nav className="sticky top-0 z-50 bg-th-950/80 backdrop-blur-xl border-b border-th-800/50">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    <Link to="/" className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-xl bg-primary-600 flex items-center justify-center shadow-lg shadow-primary-900/30">
                            <span className="text-white font-bold text-lg">C</span>
                        </div>
                        <span className="text-xl font-bold text-th-50 tracking-tight">
                            Clinic<span className="text-primary-500">Pro</span>
                        </span>
                    </Link>
                    <div className="hidden md:flex items-center gap-8">
                        <a href="#features" className="text-th-400 hover:text-th-50 text-sm font-medium transition-colors">Tính năng</a>
                        <a href="#how-it-works" className="text-th-400 hover:text-th-50 text-sm font-medium transition-colors">Cách hoạt động</a>
                        <a href="#testimonials" className="text-th-400 hover:text-th-50 text-sm font-medium transition-colors">Đánh giá</a>
                    </div>
                    <div className="flex items-center gap-3">
                        <Link to="/login">
                            <Button variant="ghost" size="sm" className="text-th-300 hover:text-th-50">
                                Đăng nhập
                            </Button>
                        </Link>
                        <Link to="/register">
                            <Button size="sm" className="bg-primary-600 hover:bg-primary-500 shadow-lg shadow-primary-900/20 px-5">
                                Đăng ký
                            </Button>
                        </Link>
                    </div>
                </div>
            </nav>

            {/* ─── Hero Section ───────────────────────────── */}
            <section className="relative pt-20 pb-28 md:pt-32 md:pb-36">
                {/* Background decorations */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-20 left-1/4 w-96 h-96 rounded-full bg-primary-600/5 blur-3xl" />
                    <div className="absolute bottom-0 right-1/4 w-80 h-80 rounded-full bg-primary-500/5 blur-3xl" />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full border border-primary-900/10" />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full border border-primary-900/5" />
                </div>

                <div className="max-w-7xl mx-auto px-6 relative">
                    <div className="max-w-3xl mx-auto text-center">
                        {/* Badge */}
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-900/20 border border-primary-700/20 text-primary-400 text-xs font-semibold mb-8 animate-fade-in-up">
                            <Zap size={12} />
                            Nền tảng quản lý phòng khám #1 Việt Nam
                        </div>

                        <h1 className="text-5xl md:text-7xl font-black text-th-50 tracking-tight leading-[1.1] mb-6 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
                            Quản lý phòng khám{' '}
                            <span className="text-gradient">thông minh</span>{' '}
                            và hiệu quả
                        </h1>

                        <p className="text-lg md:text-xl text-th-400 leading-relaxed max-w-2xl mx-auto mb-10 animate-fade-in-up" style={{ animationDelay: '200ms' }}>
                            Đặt lịch khám, quản lý bệnh án, thanh toán trực tuyến — tất cả trong một nền tảng duy nhất.
                            Dành cho bệnh nhân, bác sĩ và quản trị viên.
                        </p>

                        {/* CTA Buttons */}
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up" style={{ animationDelay: '300ms' }}>
                            <Link to="/register">
                                <Button size="lg" className="px-8 h-14 text-lg bg-primary-600 hover:bg-primary-500 shadow-2xl shadow-primary-900/30 group">
                                    Bắt đầu miễn phí
                                    <ArrowRight size={20} className="ml-2 group-hover:translate-x-1 transition-transform" />
                                </Button>
                            </Link>
                            <Link to="/login">
                                <Button variant="outline" size="lg" className="px-8 h-14 text-lg border-th-700 hover:bg-th-900 hover:border-th-600">
                                    Đăng nhập ngay
                                </Button>
                            </Link>
                        </div>

                        {/* Trust indicators */}
                        <div className="flex items-center justify-center gap-6 mt-10 text-th-500 text-xs font-medium animate-fade-in-up" style={{ animationDelay: '400ms' }}>
                            <span className="flex items-center gap-1.5"><Lock size={12} /> Bảo mật SSL</span>
                            <span className="h-1 w-1 rounded-full bg-th-700" />
                            <span className="flex items-center gap-1.5"><Shield size={12} /> Tuân thủ HIPAA</span>
                            <span className="h-1 w-1 rounded-full bg-th-700" />
                            <span className="flex items-center gap-1.5"><Clock size={12} /> Hỗ trợ 24/7</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* ─── Stats Section ──────────────────────────── */}
            <section className="py-16 border-y border-th-800/50 bg-th-900/30">
                <div className="max-w-5xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
                    <StatItem value="100+" label="Phòng khám" delay={0} />
                    <StatItem value="500+" label="Bác sĩ" delay={100} />
                    <StatItem value="10K+" label="Bệnh nhân" delay={200} />
                    <StatItem value="99.9%" label="Uptime" delay={300} />
                </div>
            </section>

            {/* ─── Features Section ──────────────────────── */}
            <section id="features" className="py-24">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <p className="text-primary-400 font-semibold text-sm uppercase tracking-widest mb-3">Tính năng</p>
                        <h2 className="text-3xl md:text-4xl font-black text-th-50 tracking-tight">
                            Mọi thứ bạn cần, trong <span className="text-gradient">một nền tảng</span>
                        </h2>
                        <p className="text-th-400 mt-4 max-w-xl mx-auto">
                            Từ đặt lịch khám đến quản lý bệnh án, thanh toán và phân tích — ClinicPro giúp vận hành phòng khám trơn tru.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <FeatureCard
                            icon={Calendar}
                            title="Đặt lịch thông minh"
                            description="Bệnh nhân đặt lịch 24/7. Tự động check conflict, gửi nhắc hẹn qua email và SMS."
                            color="bg-primary-900/30 text-primary-400"
                            delay={0}
                        />
                        <FeatureCard
                            icon={ClipboardList}
                            title="Bệnh án điện tử"
                            description="Lưu trữ hồ sơ y tế an toàn. Bác sĩ truy cập nhanh tiền sử, chẩn đoán và đơn thuốc."
                            color="bg-blue-900/30 text-blue-400"
                            delay={80}
                        />
                        <FeatureCard
                            icon={CreditCard}
                            title="Thanh toán trực tuyến"
                            description="Tích hợp VNPay, tự động tạo hóa đơn, quản lý công nợ minh bạch."
                            color="bg-emerald-900/30 text-emerald-400"
                            delay={160}
                        />
                        <FeatureCard
                            icon={Shield}
                            title="Bảo mật cao cấp"
                            description="Mã hóa dữ liệu AES-256, phân quyền chi tiết, log audit đầy đủ."
                            color="bg-amber-900/30 text-amber-400"
                            delay={240}
                        />
                        <FeatureCard
                            icon={Activity}
                            title="Dashboard thời gian thực"
                            description="Theo dõi hoạt động phòng khám real-time: lịch hẹn, doanh thu, hiệu suất bác sĩ."
                            color="bg-pink-900/30 text-pink-400"
                            delay={320}
                        />
                        <FeatureCard
                            icon={Users}
                            title="Đa vai trò"
                            description="3 portal riêng biệt cho Bệnh nhân, Bác sĩ và Quản trị viên, tối ưu cho từng nhu cầu."
                            color="bg-indigo-900/30 text-indigo-400"
                            delay={400}
                        />
                    </div>
                </div>
            </section>

            {/* ─── How It Works Section ───────────────────── */}
            <section id="how-it-works" className="py-24 bg-th-900/20 border-y border-th-800/30">
                <div className="max-w-5xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <p className="text-primary-400 font-semibold text-sm uppercase tracking-widest mb-3">Cách hoạt động</p>
                        <h2 className="text-3xl md:text-4xl font-black text-th-50 tracking-tight">
                            Đơn giản chỉ <span className="text-gradient">3 bước</span>
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
                        {/* Connector line */}
                        <div className="hidden md:block absolute top-7 left-[calc(16.67%+28px)] right-[calc(16.67%+28px)] h-px bg-gradient-to-r from-primary-700/50 via-primary-500/30 to-primary-700/50" />

                        <StepCard
                            step={1}
                            title="Đăng ký tài khoản"
                            description="Tạo tài khoản miễn phí chỉ trong 30 giây với email hoặc số điện thoại."
                            delay={0}
                        />
                        <StepCard
                            step={2}
                            title="Chọn bác sĩ & đặt lịch"
                            description="Tìm bác sĩ theo chuyên khoa, xem đánh giá và đặt lịch phù hợp."
                            delay={150}
                        />
                        <StepCard
                            step={3}
                            title="Khám & nhận kết quả"
                            description="Đến khám đúng giờ, nhận bệnh án điện tử và đơn thuốc ngay lập tức."
                            delay={300}
                        />
                    </div>
                </div>
            </section>

            {/* ─── Testimonials Section ───────────────────── */}
            <section id="testimonials" className="py-24">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <p className="text-primary-400 font-semibold text-sm uppercase tracking-widest mb-3">Đánh giá</p>
                        <h2 className="text-3xl md:text-4xl font-black text-th-50 tracking-tight">
                            Được tin tưởng bởi <span className="text-gradient">hàng nghìn</span> người dùng
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <TestimonialCard
                            name="BS. Nguyễn Văn A"
                            role="Bác sĩ Tim mạch"
                            text="ClinicPro giúp tôi quản lý lịch khám và bệnh án hiệu quả hơn rất nhiều. Giao diện trực quan, dễ sử dụng."
                            delay={0}
                        />
                        <TestimonialCard
                            name="Trần Thị B"
                            role="Bệnh nhân"
                            text="Đặt lịch khám online nhanh chóng, không phải chờ đợi. Theo dõi bệnh án mọi lúc mọi nơi rất tiện lợi."
                            delay={100}
                        />
                        <TestimonialCard
                            name="Lê Hoàng C"
                            role="Quản lý phòng khám"
                            text="Dashboard giúp tôi nắm bắt tình hình phòng khám real-time. Doanh thu tăng 40% từ khi sử dụng ClinicPro."
                            delay={200}
                        />
                    </div>
                </div>
            </section>

            {/* ─── CTA Section ────────────────────────────── */}
            <section className="py-24">
                <div className="max-w-4xl mx-auto px-6">
                    <div className="relative rounded-3xl overflow-hidden">
                        {/* Background gradient */}
                        <div className="absolute inset-0 bg-gradient-to-br from-primary-900/60 via-primary-800/40 to-th-900 animate-gradient-shift" />
                        <div className="absolute inset-0 border border-primary-700/20 rounded-3xl" />

                        <div className="relative py-16 px-8 md:px-16 text-center">
                            <Stethoscope size={40} className="text-primary-400 mx-auto mb-6" />
                            <h2 className="text-3xl md:text-4xl font-black text-th-50 tracking-tight mb-4">
                                Sẵn sàng nâng cấp phòng khám?
                            </h2>
                            <p className="text-th-300 text-lg mb-8 max-w-lg mx-auto">
                                Tham gia cùng hàng trăm phòng khám đã tin chọn ClinicPro. Bắt đầu miễn phí hôm nay.
                            </p>
                            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                                <Link to="/register">
                                    <Button size="lg" className="px-10 h-14 text-lg bg-white text-th-900 hover:bg-th-100 font-bold shadow-2xl group">
                                        Tạo tài khoản miễn phí
                                        <ChevronRight size={20} className="ml-2 group-hover:translate-x-1 transition-transform" />
                                    </Button>
                                </Link>
                                <Link to="/login">
                                    <Button variant="ghost" size="lg" className="px-8 h-14 text-lg text-th-200 border border-th-500/30 hover:bg-white/5">
                                        Đăng nhập
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ─── Footer ─────────────────────────────────── */}
            <footer className="border-t border-th-800/50 py-12 bg-th-950">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
                        <div className="col-span-2 md:col-span-1">
                            <div className="flex items-center gap-2 mb-4">
                                <div className="h-8 w-8 rounded-lg bg-primary-600 flex items-center justify-center">
                                    <span className="text-white font-bold">C</span>
                                </div>
                                <span className="text-lg font-bold text-th-50">
                                    Clinic<span className="text-primary-500">Pro</span>
                                </span>
                            </div>
                            <p className="text-th-500 text-sm leading-relaxed">
                                Nền tảng quản lý phòng khám thông minh cho y tế hiện đại.
                            </p>
                        </div>
                        <div>
                            <h4 className="text-th-200 font-semibold text-sm mb-4">Sản phẩm</h4>
                            <ul className="space-y-2.5">
                                <li><a href="#features" className="text-th-500 text-sm hover:text-primary-400 transition-colors">Tính năng</a></li>
                                <li><a href="#how-it-works" className="text-th-500 text-sm hover:text-primary-400 transition-colors">Cách hoạt động</a></li>
                                <li><a href="#" className="text-th-500 text-sm hover:text-primary-400 transition-colors">Bảng giá</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-th-200 font-semibold text-sm mb-4">Hỗ trợ</h4>
                            <ul className="space-y-2.5">
                                <li><a href="#" className="text-th-500 text-sm hover:text-primary-400 transition-colors">Trung tâm hỗ trợ</a></li>
                                <li><a href="#" className="text-th-500 text-sm hover:text-primary-400 transition-colors">Liên hệ</a></li>
                                <li><a href="#" className="text-th-500 text-sm hover:text-primary-400 transition-colors">FAQ</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-th-200 font-semibold text-sm mb-4">Pháp lý</h4>
                            <ul className="space-y-2.5">
                                <li><a href="#" className="text-th-500 text-sm hover:text-primary-400 transition-colors">Điều khoản</a></li>
                                <li><a href="#" className="text-th-500 text-sm hover:text-primary-400 transition-colors">Bảo mật</a></li>
                                <li><a href="#" className="text-th-500 text-sm hover:text-primary-400 transition-colors">Cookie</a></li>
                            </ul>
                        </div>
                    </div>

                    <div className="pt-8 border-t border-th-800/50 flex flex-col md:flex-row items-center justify-between gap-4">
                        <p className="text-th-600 text-xs">© 2024 ClinicPro. All rights reserved.</p>
                        <div className="flex items-center gap-3">
                            <span className="flex items-center gap-1.5 text-th-600 text-xs">
                                <Heart size={12} className="text-red-500" /> Made in Vietnam
                            </span>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default HomePage;
