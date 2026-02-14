import { useParams, useNavigate } from 'react-router-dom';
import { useState } from 'react'; // Added useState import
import { ArrowLeft, Printer, FileDown, Activity, ClipboardList, Pill } from 'lucide-react';
import { Button } from '@components/ui/Button';
import { Card, CardHeader, CardContent } from '@components/ui/Card';
import { Badge } from '@components/ui/Badge';
import { ReviewModal } from '@components/appointments/ReviewModal'; // Added ReviewModal import

const RecordDetailPage = () => {
    const { recordId } = useParams<{ recordId: string }>();
    const navigate = useNavigate();
    const [showReviewModal, setShowReviewModal] = useState(false); // Added state

    // Mock data for a single record
    const record = {
        id: recordId,
        date: 'Feb 10, 2026',
        doctorName: 'Dr. Nguyen Van A',
        specialtyName: 'Cardiology',
        symptoms: 'Shortness of breath, fatigue during physical activity.',
        diagnosis: 'Mild Hypertension',
        notes: 'Patient advised to reduce sodium intake and maintain a regular exercise routine. Follow-up in 3 months.',
        prescriptions: [
            { name: 'Amlodipine', dosage: '5mg', instruction: 'Once daily in the morning' },
            { name: 'Multi-vitamin', dosage: '1 tablet', instruction: 'After breakfast' },
        ]
    };

    return (
        <div className="space-y-8 animate-fade-in max-w-4xl">
            {/* Header */}
            <section className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-2">
                    <Button
                        variant="ghost"
                        size="sm"
                        className="p-0 text-dark-400 hover:text-dark-200"
                        onClick={() => navigate('/medical-history')}
                    >
                        <ArrowLeft size={16} className="mr-1" /> Back to History
                    </Button>
                    <div className="flex items-center gap-3">
                        <h1 className="text-3xl font-bold text-dark-50 tracking-tight">Medical Record</h1>
                        <Badge variant="success">Finalized</Badge>
                    </div>
                    <p className="text-dark-400 text-lg">Record ID: {recordId} • Date: {record.date}</p>
                </div>

                <div className="flex gap-3">
                    <Button variant="outline" size="sm" className="gap-2">
                        <Printer size={16} /> Print
                    </Button>
                    <Button variant="outline" size="sm" className="gap-2">
                        <FileDown size={16} /> Download PDF
                    </Button>
                </div>
            </section>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    <Card>
                        <CardHeader title="Diagnosis & Symptoms" icon={<Activity size={20} />} />
                        <CardContent className="space-y-6">
                            <div>
                                <h4 className="text-sm font-bold text-dark-400 uppercase tracking-widest mb-2">Symptoms</h4>
                                <p className="text-dark-50">{record.symptoms}</p>
                            </div>
                            <div>
                                <h4 className="text-sm font-bold text-dark-400 uppercase tracking-widest mb-2">Final Diagnosis</h4>
                                <p className="text-dark-50 text-xl font-bold text-primary-400">{record.diagnosis}</p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader title="Clinical Notes" icon={<ClipboardList size={20} />} />
                        <CardContent>
                            <p className="text-dark-100 leading-relaxed whitespace-pre-wrap">
                                {record.notes}
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Sidebar / Prescription */}
                <div className="space-y-6">
                    <Card className="border-primary-900/30">
                        <CardHeader title="Prescriptions" icon={<Pill size={20} className="text-primary-400" />} />
                        <CardContent className="p-0">
                            <div className="divide-y divide-dark-700/50">
                                {record.prescriptions.map((p, idx) => (
                                    <div key={idx} className="p-4 bg-primary-950/10">
                                        <p className="font-bold text-dark-50">{p.name}</p>
                                        <p className="text-sm text-primary-500 font-medium">{p.dosage}</p>
                                        <p className="text-xs text-dark-400 mt-1">{p.instruction}</p>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader title="Doctor Information" />
                        <CardContent>
                            <p className="font-bold text-dark-50">{record.doctorName}</p>
                            <p className="text-sm text-dark-400">{record.specialtyName}</p>
                            <Button variant="ghost" size="sm" className="p-0 text-primary-500 mt-4">
                                View Doctor Profile
                            </Button>
                        </CardContent>
                    </Card>

                    <Card className="bg-primary-900/10 border-primary-500/20">
                        <CardContent className="p-6 text-center">
                            <h4 className="font-bold text-dark-50 mb-2">How was your visit?</h4>
                            <p className="text-xs text-dark-400 mb-4">Sharing your experience helps others choose the right care.</p>
                            <Button size="sm" fullWidth onClick={() => setShowReviewModal(true)}>
                                Write a Review
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>

            <ReviewModal
                isOpen={showReviewModal}
                onClose={() => setShowReviewModal(false)}
                doctorName={record.doctorName}
                appointmentId={recordId || ''}
            />
        </div>
    );
};

export default RecordDetailPage;
