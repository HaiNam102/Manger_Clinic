import { useState, useEffect, useMemo } from 'react';
import {
    Calendar, Search, Download,
    Clock, Check, X, ChevronRight,
    RefreshCw, CheckSquare, Square,
    AlertTriangle, Trash2
} from 'lucide-react';
import { Card, CardContent } from '@components/ui/Card';
import { Button } from '@components/ui/Button';
import { Input } from '@components/ui/Input';
import { Badge } from '@components/ui/Badge';
import { Table } from '@components/ui/Table';
import { Avatar } from '@components/ui/Avatar';
import { Select } from '@components/ui/Select';
import { ConfirmationModal } from '@components/ui/ConfirmationModal';
import { CancelAppointmentModal } from '@components/appointments/CancelAppointmentModal';
import adminService from '@services/adminService';
import { useToast } from '@hooks/useToast';
import type { AppointmentResponse } from '@/types';
import { format } from 'date-fns';

const AppointmentListPage = () => {
    const { showToast } = useToast();
    const [appointments, setAppointments] = useState<AppointmentResponse[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState<string>('');
    const [searchQuery, setSearchQuery] = useState('');
    const [dateFrom, setDateFrom] = useState<string>('');
    const [dateTo, setDateTo] = useState<string>('');
    const [cancelTarget, setCancelTarget] = useState<AppointmentResponse | null>(null);

    // Bulk action states
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
    const [bulkAction, setBulkAction] = useState<string>('');
    const [showBulkConfirm, setShowBulkConfirm] = useState(false);
    const [isBulkProcessing, setIsBulkProcessing] = useState(false);

    const loadAppointments = async () => {
        try {
            setIsLoading(true);
            const data = await adminService.getAllAppointments({
                status: statusFilter || undefined,
                dateFrom: dateFrom || undefined,
                dateTo: dateTo || undefined
            });
            setAppointments(data || []);
            setSelectedIds(new Set()); // Clear selection on reload
        } catch (error) {
            console.error('Failed to load appointments:', error);
            showToast.error('Không thể tải danh sách lịch hẹn');
            setAppointments([]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            loadAppointments();
        }, 300);
        return () => clearTimeout(timer);
    }, [statusFilter, dateFrom, dateTo]);

    const filteredAppointments = appointments.filter(a =>
        (a.patientName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (a.doctorName || '').toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Conflict detection: find appointments with same doctor, same date, overlapping times
    const conflicts = useMemo(() => {
        const conflictMap = new Map<string, AppointmentResponse[]>();
        const active = appointments.filter(a => a.status === 'CONFIRMED' || a.status === 'PENDING');

        for (let i = 0; i < active.length; i++) {
            for (let j = i + 1; j < active.length; j++) {
                const a = active[i];
                const b = active[j];
                if (
                    a.doctorId === b.doctorId &&
                    a.appointmentDate === b.appointmentDate &&
                    a.appointmentTime === b.appointmentTime
                ) {
                    const key = `${a.doctorId}-${a.appointmentDate}-${a.appointmentTime}`;
                    if (!conflictMap.has(key)) {
                        conflictMap.set(key, [a]);
                    }
                    const arr = conflictMap.get(key)!;
                    if (!arr.find(x => x.id === b.id)) arr.push(b);
                    if (!arr.find(x => x.id === a.id)) arr.push(a);
                }
            }
        }

        const conflictIds = new Set<string>();
        conflictMap.forEach(items => items.forEach(item => conflictIds.add(item.id)));
        return conflictIds;
    }, [appointments]);

    const handleExport = async () => {
        try {
            showToast.loading('Đang chuẩn bị báo cáo...');
            await adminService.exportAppointments(dateFrom, dateTo);
            showToast.dismiss();
            showToast.success('Đã tải xuống báo cáo lịch hẹn');
        } catch (error) {
            console.error('Export failed:', error);
            showToast.dismiss();
            showToast.error('Xuất báo cáo thất bại');
        }
    };

    const handleUpdateStatus = async (id: string, status: string) => {
        try {
            await adminService.updateAppointmentStatus(id, status);
            showToast.success(`Đã cập nhật trạng thái lịch hẹn`);
            loadAppointments();
        } catch (error) {
            showToast.error('Cập nhật trạng thái thất bại');
        }
    };

    const handleCancel = async (reason: string) => {
        if (!cancelTarget) return;

        try {
            await adminService.cancelAppointment(cancelTarget.id, reason.trim() || 'Admin cancelled');
            showToast.success('Đã hủy lịch hẹn');
            loadAppointments();
        } catch (error) {
            showToast.error('Hủy lịch hẹn thất bại');
            throw error;
        }
    };

    // Bulk selection handlers
    const toggleSelect = (id: string) => {
        setSelectedIds(prev => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });
    };

    const toggleSelectAll = () => {
        if (selectedIds.size === filteredAppointments.length) {
            setSelectedIds(new Set());
        } else {
            setSelectedIds(new Set(filteredAppointments.map(a => a.id)));
        }
    };

    const handleBulkAction = async () => {
        if (!bulkAction || selectedIds.size === 0) return;

        setIsBulkProcessing(true);
        showToast.loading(`Đang xử lý ${selectedIds.size} lịch hẹn...`);

        let successCount = 0;
        let failCount = 0;

        for (const id of selectedIds) {
            try {
                if (bulkAction === 'CANCEL') {
                    await adminService.cancelAppointment(id, 'Hủy hàng loạt bởi Admin');
                } else {
                    await adminService.updateAppointmentStatus(id, bulkAction);
                }
                successCount++;
            } catch {
                failCount++;
            }
        }

        showToast.dismiss();

        if (failCount > 0) {
            showToast.error(`Thành công: ${successCount}, Thất bại: ${failCount}`);
        } else {
            showToast.success(`Đã xử lý ${successCount} lịch hẹn thành công`);
        }

        setIsBulkProcessing(false);
        setShowBulkConfirm(false);
        setSelectedIds(new Set());
        setBulkAction('');
        loadAppointments();
    };

    const getStatusBadge = (status: string, id?: string) => {
        const variants: Record<string, { label: string; variant: "warning" | "primary" | "success" | "error" | "info" }> = {
            'PENDING': { label: 'Chờ xác nhận', variant: 'warning' },
            'CONFIRMED': { label: 'Đã xác nhận', variant: 'primary' },
            'COMPLETED': { label: 'Đã khám xong', variant: 'success' },
            'CANCELLED': { label: 'Đã hủy', variant: 'error' }
        };

        const config = variants[status] || { label: status, variant: 'info' };
        const isConflict = id && conflicts.has(id);

        return (
            <div className="flex items-center gap-1.5">
                <Badge variant={config.variant} size="sm" className="font-semibold px-2.5">
                    <span className="flex items-center gap-1.5">
                        <span className={`w-1.5 h-1.5 rounded-full bg-current`} />
                        {config.label}
                    </span>
                </Badge>
                {isConflict && (
                    <span title="Xung đột lịch - Cùng bác sĩ, cùng thời gian">
                        <AlertTriangle size={14} className="text-amber-400 animate-pulse" />
                    </span>
                )}
            </div>
        );
    };

    const formatApptDate = (dateStr: string | null | undefined) => {
        if (!dateStr) return 'N/A';
        try {
            return format(new Date(dateStr), 'dd/MM/yyyy');
        } catch (e) {
            return dateStr;
        }
    };

    const getBulkActionLabel = () => {
        switch (bulkAction) {
            case 'CONFIRMED': return 'xác nhận';
            case 'COMPLETED': return 'hoàn thành';
            case 'CANCEL': return 'hủy';
            default: return '';
        }
    };

    const columns = [
        {
            header: (
                <button onClick={toggleSelectAll} className="flex items-center justify-center w-full">
                    {selectedIds.size > 0 && selectedIds.size === filteredAppointments.length
                        ? <CheckSquare size={16} className="text-primary-500" />
                        : <Square size={16} className="text-dark-500" />
                    }
                </button>
            ),
            className: 'w-10',
            accessor: (a: AppointmentResponse) => (
                <button onClick={() => toggleSelect(a.id)} className="flex items-center justify-center w-full">
                    {selectedIds.has(a.id)
                        ? <CheckSquare size={16} className="text-primary-500" />
                        : <Square size={16} className="text-dark-600 hover:text-dark-400 transition-colors" />
                    }
                </button>
            )
        },
        {
            header: 'Thời gian',
            accessor: (a: AppointmentResponse) => (
                <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2 text-dark-50 font-medium">
                        <Calendar size={14} className="text-primary-500" />
                        {formatApptDate(a.appointmentDate)}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-dark-400">
                        <Clock size={14} />
                        {a.appointmentTime || '--:--'}
                    </div>
                </div>
            )
        },
        {
            header: 'Bệnh nhân',
            accessor: (a: AppointmentResponse) => (
                <div className="flex items-center gap-3">
                    <Avatar
                        src={undefined}
                        alt={a.patientName}
                        fallback={a.patientName?.split(' ').map(n => n[0]).join('')}
                        size="sm"
                        className="border-success/20"
                    />
                    <div className="flex flex-col">
                        <span className="font-medium text-dark-50">{a.patientName || 'N/A'}</span>
                        <span className="text-[10px] text-dark-400">ID: {a.id.slice(0, 8)}</span>
                    </div>
                </div>
            )
        },
        {
            header: 'Bác sĩ',
            accessor: (a: AppointmentResponse) => (
                <div className="flex items-center gap-3">
                    <Avatar
                        src={undefined}
                        alt={a.doctorName}
                        fallback={a.doctorName?.split(' ').map(n => n[0]).join('')}
                        size="sm"
                        className="border-primary-500/20"
                    />
                    <div className="flex flex-col">
                        <div className="flex items-center gap-1.5 font-medium text-dark-100">
                            {a.doctorName || 'N/A'}
                        </div>
                        <span className="text-[10px] text-primary-400 uppercase font-bold tracking-wider">
                            {a.specialtyName || 'Tổng quát'}
                        </span>
                    </div>
                </div>
            )
        },
        {
            header: 'Trạng thái',
            accessor: (a: AppointmentResponse) => getStatusBadge(a.status, a.id)
        },
        {
            header: 'Thao tác',
            className: 'text-right',
            accessor: (a: AppointmentResponse) => (
                <div className="flex items-center justify-end gap-1.5">
                    {a.status === 'PENDING' && (
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-emerald-500 hover:bg-emerald-500/10 hover:text-emerald-400 transition-colors"
                            title="Xác nhận"
                            onClick={() => handleUpdateStatus(a.id, 'CONFIRMED')}
                        >
                            <Check size={18} />
                        </Button>
                    )}
                    {(a.status === 'PENDING' || a.status === 'CONFIRMED') && (
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-error hover:bg-error/10 hover:text-error transition-colors"
                            title="Hủy hẹn"
                            onClick={() => setCancelTarget(a)}
                        >
                            <X size={16} />
                        </Button>
                    )}
                </div>
            )
        }
    ];

    return (
        <div className="space-y-6 animate-fade-in p-2">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-dark-50 flex items-center gap-2">
                        <Calendar className="text-primary-500" size={24} />
                        Quản lý lịch hẹn
                    </h1>
                    <p className="text-dark-400 text-sm mt-1">
                        Theo dõi và quản lý tất cả lịch hẹn trong hệ thống
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => loadAppointments()}
                        className="text-dark-400 hover:text-primary-400"
                    >
                        <RefreshCw size={16} className={isLoading ? 'animate-spin' : ''} />
                    </Button>
                    <Button variant="outline" size="sm" onClick={handleExport} className="border-dark-700 hover:bg-dark-800">
                        <Download size={16} className="mr-2 text-primary-500" /> Xuất Excel
                    </Button>
                </div>
            </div>

            {/* Conflict Alert */}
            {conflicts.size > 0 && (
                <div className="flex items-center gap-3 p-4 bg-amber-500/5 border border-amber-500/20 rounded-xl animate-fade-in">
                    <AlertTriangle className="text-amber-400 shrink-0" size={20} />
                    <div>
                        <p className="text-sm font-semibold text-dark-50">Phát hiện xung đột lịch hẹn</p>
                        <p className="text-xs text-dark-400">
                            Có <strong className="text-amber-400">{conflicts.size}</strong> lịch hẹn bị xung đột (cùng bác sĩ, cùng ngày, cùng giờ). Vui lòng kiểm tra và xử lý.
                        </p>
                    </div>
                </div>
            )}

            {/* Bulk Action Bar */}
            {selectedIds.size > 0 && (
                <div className="flex items-center gap-3 p-3 bg-primary-900/20 border border-primary-500/20 rounded-xl animate-fade-in">
                    <CheckSquare size={18} className="text-primary-400" />
                    <span className="text-sm text-dark-100 font-medium">
                        Đã chọn <strong className="text-primary-400">{selectedIds.size}</strong> lịch hẹn
                    </span>
                    <div className="flex-1" />
                    <select
                        value={bulkAction}
                        onChange={(e) => setBulkAction(e.target.value)}
                        className="bg-dark-900 border border-dark-700 rounded-lg px-3 py-1.5 text-dark-200 text-sm outline-none focus:ring-1 focus:ring-primary-500"
                    >
                        <option value="">Chọn thao tác...</option>
                        <option value="CONFIRMED">✅ Xác nhận tất cả</option>
                        <option value="COMPLETED">✔️ Đánh dấu hoàn thành</option>
                        <option value="CANCEL">❌ Hủy tất cả</option>
                    </select>
                    <Button
                        size="sm"
                        variant={bulkAction === 'CANCEL' ? 'outline' : 'primary'}
                        className={bulkAction === 'CANCEL' ? 'border-error/50 text-error hover:bg-error/10' : ''}
                        disabled={!bulkAction || isBulkProcessing}
                        onClick={() => setShowBulkConfirm(true)}
                    >
                        Áp dụng
                    </Button>
                    <Button
                        size="sm"
                        variant="ghost"
                        className="text-dark-400"
                        onClick={() => { setSelectedIds(new Set()); setBulkAction(''); }}
                    >
                        Bỏ chọn
                    </Button>
                </div>
            )}

            <Card>
                <CardContent className="p-4 flex flex-col gap-4">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-500" size={18} />
                            <Input
                                placeholder="Tìm theo tên bệnh nhân hoặc bác sĩ..."
                                className="pl-10"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <div className="w-full md:w-64">
                            <Select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                options={[
                                    { label: 'Tất cả trạng thái', value: '' },
                                    { label: 'Chờ xác nhận', value: 'PENDING' },
                                    { label: 'Đã xác nhận', value: 'CONFIRMED' },
                                    { label: 'Đã khám xong', value: 'COMPLETED' },
                                    { label: 'Đã hủy', value: 'CANCELLED' }
                                ]}
                            />
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 pt-2 border-t border-dark-800">
                        <div className="flex items-center gap-2">
                            <span className="text-xs text-dark-400">Từ ngày:</span>
                            <Input
                                type="date"
                                className="w-40 h-8 text-xs"
                                value={dateFrom}
                                onChange={(e) => setDateFrom(e.target.value)}
                            />
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-xs text-dark-400">Đến ngày:</span>
                            <Input
                                type="date"
                                className="w-40 h-8 text-xs"
                                value={dateTo}
                                onChange={(e) => setDateTo(e.target.value)}
                            />
                        </div>
                        {(dateFrom || dateTo) && (
                            <Button
                                variant="ghost"
                                size="sm"
                                className="text-xs"
                                onClick={() => { setDateFrom(''); setDateTo(''); }}
                            >
                                Xóa lọc ngày
                            </Button>
                        )}
                    </div>
                </CardContent>
            </Card>

            <Table
                columns={columns}
                data={filteredAppointments}
                keyExtractor={(a) => a.id}
                isLoading={isLoading}
                emptyMessage="Không có lịch hẹn nào phù hợp"
            />

            <CancelAppointmentModal
                isOpen={!!cancelTarget}
                onClose={() => setCancelTarget(null)}
                onConfirm={handleCancel}
                appointment={cancelTarget}
            />

            {/* Bulk Action Confirmation */}
            <ConfirmationModal
                isOpen={showBulkConfirm}
                onClose={() => setShowBulkConfirm(false)}
                onConfirm={handleBulkAction}
                title={`${getBulkActionLabel().charAt(0).toUpperCase() + getBulkActionLabel().slice(1)} ${selectedIds.size} lịch hẹn`}
                message={`Bạn có chắc chắn muốn ${getBulkActionLabel()} ${selectedIds.size} lịch hẹn đã chọn? Thao tác này không thể hoàn tác.`}
                confirmText={`${getBulkActionLabel().charAt(0).toUpperCase() + getBulkActionLabel().slice(1)} tất cả`}
                variant={bulkAction === 'CANCEL' ? 'danger' : 'info'}
                icon={bulkAction === 'CANCEL' ? Trash2 : Check}
            />
        </div>
    );
};

export default AppointmentListPage;
