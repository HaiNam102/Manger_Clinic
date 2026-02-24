import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Search, FileText, Loader2 } from 'lucide-react';
import { Card, CardHeader, CardContent } from '@components/ui/Card';
import { Input } from '@components/ui/Input';
import { Table, Column } from '@components/ui/Table';
import { Button } from '@components/ui/Button';
import { useAuth } from '@contexts/AuthContext';
import { getMyRecords } from '@services/patientService';
import type { MedicalRecordResponse } from '@/types';

const MedicalHistoryPage = () => {
    const { user } = useAuth();
    const [records, setRecords] = useState<MedicalRecordResponse[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        if (!user?.id) return;
        const load = async () => {
            try {
                setIsLoading(true);
                const data = await getMyRecords();
                setRecords(data);
            } catch (error) {
                console.error('Failed to load medical records:', error);
            } finally {
                setIsLoading(false);
            }
        };
        load();
    }, [user?.id]);

    const filteredRecords = useMemo(() => {
        if (!searchQuery.trim()) return records;
        const q = searchQuery.toLowerCase();
        return records.filter(r =>
            r.doctorName.toLowerCase().includes(q) ||
            r.diagnosis.toLowerCase().includes(q) ||
            r.symptoms?.toLowerCase().includes(q)
        );
    }, [records, searchQuery]);

    const columns: Column<MedicalRecordResponse>[] = [
        {
            header: 'Ngày khám',
            accessor: (item) => new Date(item.createdAt).toLocaleDateString('vi-VN', {
                year: 'numeric', month: 'short', day: 'numeric',
            }),
        },
        { header: 'Bác sĩ', accessor: 'doctorName' },
        { header: 'Chẩn đoán', accessor: 'diagnosis' },
        {
            header: 'Hành động',
            accessor: (item) => (
                <Link to={`/medical-history/${item.id}`}>
                    <Button variant="ghost" size="sm" className="text-primary-500">
                        Xem chi tiết
                    </Button>
                </Link>
            )
        },
    ];

    return (
        <div className="space-y-8 animate-fade-in">
            <section>
                <h1 className="text-3xl font-bold text-dark-50 tracking-tight">Lịch sử khám bệnh</h1>
                <p className="text-dark-400 mt-2 text-lg">
                    Theo dõi các buổi khám, chẩn đoán và đơn thuốc của bạn.
                </p>
            </section>

            <Card>
                <CardHeader
                    title="Tìm kiếm lịch sử"
                    description="Lọc hồ sơ theo bác sĩ, ngày hoặc chẩn đoán"
                />
                <CardContent>
                    <div className="max-w-md relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-500" size={20} />
                        <Input
                            placeholder="Tìm kiếm hồ sơ..."
                            className="pl-10"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </CardContent>
            </Card>

            {isLoading ? (
                <div className="flex items-center justify-center py-20">
                    <Loader2 size={32} className="animate-spin text-primary-500" />
                </div>
            ) : (
                <Card className="overflow-hidden">
                    {filteredRecords.length > 0 ? (
                        <Table
                            columns={columns}
                            data={filteredRecords}
                            keyExtractor={(item) => item.id}
                        />
                    ) : (
                        <div className="p-20 text-center">
                            <div className="mx-auto h-20 w-20 bg-dark-800 rounded-full flex items-center justify-center text-dark-400 mb-4">
                                <FileText size={40} />
                            </div>
                            <p className="text-dark-400">
                                {searchQuery ? 'Không tìm thấy hồ sơ phù hợp.' : "Bạn chưa có bệnh án nào."}
                            </p>
                        </div>
                    )}
                </Card>
            )}
        </div>
    );
};

export default MedicalHistoryPage;
