import { Link } from 'react-router-dom';
import { Search, FileText } from 'lucide-react';
import { Card, CardHeader, CardContent } from '@components/ui/Card';
import { Input } from '@components/ui/Input';
import { Table, Column } from '@components/ui/Table';
import { Button } from '@components/ui/Button';

interface MedicalRecord {
    id: string;
    date: string;
    doctorName: string;
    specialtyName: string;
    diagnosis: string;
}

const mockRecords: MedicalRecord[] = [
    { id: '101', date: 'Feb 10, 2026', doctorName: 'Dr. Nguyen Van A', specialtyName: 'Cardiology', diagnosis: 'Mild Hypertension' },
    { id: '102', date: 'Jan 28, 2026', doctorName: 'Dr. Tran Thi B', specialtyName: 'General Medicine', diagnosis: 'Seasonal Flu' },
    { id: '103', date: 'Dec 15, 2025', doctorName: 'Dr. Le Van C', specialtyName: 'Dermatology', diagnosis: 'Skin Allergy' },
];

const MedicalHistoryPage = () => {
    const columns: Column<MedicalRecord>[] = [
        { header: 'Date', accessor: 'date' },
        { header: 'Doctor', accessor: 'doctorName' },
        { header: 'Specialty', accessor: 'specialtyName' },
        { header: 'Diagnosis', accessor: 'diagnosis' },
        {
            header: 'Action',
            accessor: (item) => (
                <Link to={`/medical-history/${item.id}`}>
                    <Button variant="ghost" size="sm" className="text-primary-500">
                        View Details
                    </Button>
                </Link>
            )
        },
    ];

    return (
        <div className="space-y-8 animate-fade-in">
            <section>
                <h1 className="text-3xl font-bold text-dark-50 tracking-tight">Medical History</h1>
                <p className="text-dark-400 mt-2 text-lg">
                    Keep track of your past consultations, diagnoses, and prescriptions.
                </p>
            </section>

            <Card>
                <CardHeader
                    title="Search History"
                    description="Filter your records by doctor, date, or diagnosis"
                />
                <CardContent>
                    <div className="max-w-md relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-500" size={20} />
                        <Input placeholder="Search records..." className="pl-10" />
                    </div>
                </CardContent>
            </Card>

            <Card className="overflow-hidden">
                <Table
                    columns={columns}
                    data={mockRecords}
                    keyExtractor={(item) => item.id}
                />
                {mockRecords.length === 0 && (
                    <div className="p-20 text-center">
                        <div className="mx-auto h-20 w-20 bg-dark-800 rounded-full flex items-center justify-center text-dark-400 mb-4">
                            <FileText size={40} />
                        </div>
                        <p className="text-dark-400">You don't have any medical records yet.</p>
                    </div>
                )}
            </Card>
        </div>
    );
};

export default MedicalHistoryPage;
