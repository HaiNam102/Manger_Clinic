import { Link } from 'react-router-dom';
import { CheckCircle2, Calendar, LayoutDashboard, ArrowRight } from 'lucide-react';
import { Button } from '@components/ui/Button';

const BookingSuccessPage = () => {
    return (
        <div className="min-h-[80vh] flex flex-col items-center justify-center p-4 animate-scale-in">
            <div className="h-24 w-24 bg-success/10 rounded-full flex items-center justify-center mb-8 border border-success/20">
                <CheckCircle2 className="text-success" size={64} />
            </div>

            <div className="text-center space-y-4 max-w-md">
                <h1 className="text-4xl font-black text-dark-50">Đặt lịch thành công!</h1>
                <p className="text-dark-400 text-lg leading-relaxed">
                    Lịch hẹn của bạn đã được sắp xếp thành công. Chúng tôi đã gửi thông tin chi tiết đến email của bạn.
                </p>
            </div>

            <div className="mt-12 flex flex-col sm:flex-row gap-4 w-full max-w-sm">
                <Link to="/dashboard" className="flex-1">
                    <Button variant="outline" fullWidth className="h-12 border-dark-700 hover:bg-dark-800">
                        <LayoutDashboard size={18} className="mr-2" /> Bảng điều khiển
                    </Button>
                </Link>
                <Link to="/appointments" className="flex-1">
                    <Button fullWidth className="h-12 bg-primary-600 hover:bg-primary-500 shadow-xl shadow-primary-900/20">
                        Lịch hẹn của tôi <ArrowRight size={18} className="ml-2" />
                    </Button>
                </Link>
            </div>

            <div className="mt-16 p-6 bg-dark-900/50 rounded-2xl border border-dark-700/50 flex items-center gap-4 max-w-sm">
                <div className="bg-primary-900/30 p-3 rounded-xl text-primary-400">
                    <Calendar size={24} />
                </div>
                <div>
                    <p className="text-sm font-bold text-dark-50">Thêm vào lịch</p>
                    <p className="text-xs text-dark-500 mt-1">Đừng bỏ lỡ buổi khám của bạn.</p>
                </div>
            </div>
        </div>
    );
};

export default BookingSuccessPage;
