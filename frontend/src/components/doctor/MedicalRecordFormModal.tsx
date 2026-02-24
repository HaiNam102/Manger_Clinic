import { useState, useEffect, useMemo } from 'react';
import {
    X, Save, Plus, Trash2, Search, Pill, FileText,
    Stethoscope, Calendar, Eye, Edit3, AlertCircle, Activity
} from 'lucide-react';
import { Button } from '@components/ui/Button';
import { getAllMedicines } from '@services/doctorService';
import type { MedicineResponse } from '@/types';

// ============ Types ============
interface PrescriptionItem {
    medicineId: number;
    medicineName: string;
    dosage: string;
    frequency: string;
    duration: string;
    instructions: string;
    quantity: number;
}

interface VitalSigns {
    bloodPressure: string;
    heartRate: string;
    temperature: string;
    weight: string;
}

interface MedicalRecordData {
    diagnosis: string;
    symptoms: string;
    vitalSigns: VitalSigns;
    treatment: string;
    notes: string;
    followUpDate: string;
    prescriptionNotes: string;
    prescriptionDetails: PrescriptionItem[];
}

interface EditRecord {
    id: string;
    diagnosis: string;
    symptoms: string;
    vitalSigns: Record<string, any>;
    treatment: string;
    notes: string;
    followUpDate?: string;
    prescription?: {
        notes: string;
        details: {
            id: number;
            medicineName: string;
            dosage: string;
            frequency: string;
            duration: string;
            instructions: string;
            quantity: number;
        }[];
    };
}

interface Props {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: MedicalRecordData) => void;
    editData?: EditRecord | null;
    patientName: string;
}

type TabView = 'form' | 'preview';

// ============ Component ============
const MedicalRecordFormModal = ({ isOpen, onClose, onSave, editData, patientName }: Props) => {
    const isEditing = !!editData;

    const [formData, setFormData] = useState<MedicalRecordData>(() => {
        let parsedVitals: VitalSigns = { bloodPressure: '', heartRate: '', temperature: '', weight: '' };
        if (editData?.vitalSigns) {
            if (typeof editData.vitalSigns === 'object') {
                parsedVitals = { ...parsedVitals, ...editData.vitalSigns };
            } else if (typeof editData.vitalSigns === 'string') {
                try {
                    parsedVitals = JSON.parse(editData.vitalSigns);
                } catch (e) {
                    console.error('Failed to parse vital signs:', e);
                }
            }
        }

        return {
            diagnosis: editData?.diagnosis || '',
            symptoms: editData?.symptoms || '',
            vitalSigns: parsedVitals,
            treatment: editData?.treatment || '',
            notes: editData?.notes || '',
            followUpDate: editData?.followUpDate || '',
            prescriptionNotes: editData?.prescription?.notes || '',
            prescriptionDetails: editData?.prescription?.details.map(d => ({
                medicineId: d.id, medicineName: d.medicineName, dosage: d.dosage,
                frequency: d.frequency, duration: d.duration, instructions: d.instructions, quantity: d.quantity,
            })) || [],
        };
    });

    const [activeTab, setActiveTab] = useState<TabView>('form');
    const [medicineSearch, setMedicineSearch] = useState('');
    const [showMedicineDropdown, setShowMedicineDropdown] = useState(false);
    const [medicines, setMedicines] = useState<MedicineResponse[]>([]);

    // Load medicines from API
    useEffect(() => {
        if (!isOpen) return;
        const loadMedicines = async () => {
            try {
                const data = await getAllMedicines();
                setMedicines(data);
            } catch (error) {
                console.error('Failed to load medicines:', error);
            }
        };
        loadMedicines();
    }, [isOpen]);

    // Reset form when editData changes
    useEffect(() => {
        if (editData) {
            let parsedVitals: VitalSigns = { bloodPressure: '', heartRate: '', temperature: '', weight: '' };
            if (editData.vitalSigns) {
                if (typeof editData.vitalSigns === 'object') {
                    parsedVitals = { ...parsedVitals, ...editData.vitalSigns };
                } else if (typeof editData.vitalSigns === 'string') {
                    try {
                        parsedVitals = JSON.parse(editData.vitalSigns);
                    } catch (e) {
                        console.error('Failed to parse vital signs:', e);
                    }
                }
            }

            setFormData({
                diagnosis: editData.diagnosis, symptoms: editData.symptoms,
                vitalSigns: parsedVitals, treatment: editData.treatment,
                notes: editData.notes, followUpDate: editData.followUpDate || '',
                prescriptionNotes: editData.prescription?.notes || '',
                prescriptionDetails: editData.prescription?.details.map(d => ({
                    medicineId: d.id, medicineName: d.medicineName, dosage: d.dosage,
                    frequency: d.frequency, duration: d.duration, instructions: d.instructions, quantity: d.quantity,
                })) || [],
            });
        }
    }, [editData]);

    const filteredMedicines = useMemo(() => {
        if (!medicineSearch.trim()) return medicines.slice(0, 8);
        const q = medicineSearch.toLowerCase();
        return medicines.filter(m => m.name.toLowerCase().includes(q));
    }, [medicineSearch, medicines]);

    const updateField = (field: keyof MedicalRecordData, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const updateVitalSign = (field: keyof VitalSigns, value: string) => {
        setFormData(prev => ({
            ...prev,
            vitalSigns: { ...prev.vitalSigns, [field]: value }
        }));
    };

    const addMedicine = (medicine: MedicineResponse) => {
        setFormData(prev => ({
            ...prev,
            prescriptionDetails: [...prev.prescriptionDetails, {
                medicineId: medicine.id, medicineName: medicine.name,
                dosage: medicine.strength || '', frequency: '', duration: '', instructions: '', quantity: 1,
            }],
        }));
        setMedicineSearch('');
        setShowMedicineDropdown(false);
    };

    const updatePrescriptionItem = (index: number, field: keyof PrescriptionItem, value: string | number) => {
        setFormData(prev => ({
            ...prev,
            prescriptionDetails: prev.prescriptionDetails.map((item, i) => i === index ? { ...item, [field]: value } : item),
        }));
    };

    const removePrescriptionItem = (index: number) => {
        setFormData(prev => ({
            ...prev,
            prescriptionDetails: prev.prescriptionDetails.filter((_, i) => i !== index),
        }));
    };

    const isFormValid = formData.diagnosis.trim() && formData.symptoms.trim();

    const handleSubmit = () => {
        if (!isFormValid) return;

        // Clean up data before submission
        const submitData = {
            ...formData,
            treatment: formData.treatment?.trim() || null,
            notes: formData.notes?.trim() || null,
            followUpDate: formData.followUpDate || null,
            prescriptionDetails: formData.prescriptionDetails.map(p => ({
                ...p,
                duration: p.duration?.trim() || null,
                instructions: p.instructions?.trim() || null
            }))
        };

        onSave(submitData as any);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-4 px-4 pb-4 overflow-y-auto">
            <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
            <div className="relative bg-dark-900 border border-dark-700 rounded-2xl shadow-2xl w-full max-w-4xl animate-fade-in max-h-[95vh] flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between p-5 border-b border-dark-700 flex-shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-lg bg-primary-900/30 flex items-center justify-center"><Stethoscope size={18} className="text-primary-400" /></div>
                        <div>
                            <h2 className="text-lg font-bold text-dark-50">{isEditing ? 'Chỉnh sửa bệnh án' : 'Tạo bệnh án mới'}</h2>
                            <p className="text-xs text-dark-400">Bệnh nhân: {patientName}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="flex bg-dark-800 rounded-lg p-0.5 mr-2">
                            <button onClick={() => setActiveTab('form')} className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${activeTab === 'form' ? 'bg-primary-600 text-white' : 'text-dark-400 hover:text-dark-200'}`}>
                                <Edit3 size={12} className="inline mr-1" /> Nhập liệu
                            </button>
                            <button onClick={() => setActiveTab('preview')} className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${activeTab === 'preview' ? 'bg-primary-600 text-white' : 'text-dark-400 hover:text-dark-200'}`}>
                                <Eye size={12} className="inline mr-1" /> Xem trước
                            </button>
                        </div>
                        <button onClick={onClose} className="p-2 rounded-lg text-dark-400 hover:text-dark-200 hover:bg-dark-800 transition-all"><X size={18} /></button>
                    </div>
                </div>

                {/* Body */}
                <div className="flex-1 overflow-y-auto p-5">
                    {activeTab === 'form' ? (
                        <FormView
                            formData={formData} updateField={updateField} updateVitalSign={updateVitalSign}
                            medicineSearch={medicineSearch} setMedicineSearch={setMedicineSearch}
                            showMedicineDropdown={showMedicineDropdown} setShowMedicineDropdown={setShowMedicineDropdown}
                            filteredMedicines={filteredMedicines} addMedicine={addMedicine}
                            updatePrescriptionItem={updatePrescriptionItem} removePrescriptionItem={removePrescriptionItem} />
                    ) : (
                        <PreviewView formData={formData} patientName={patientName} />
                    )}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between p-5 border-t border-dark-700 flex-shrink-0">
                    <div>{!isFormValid && <span className="text-xs text-amber-400 flex items-center gap-1"><AlertCircle size={12} /> Cần nhập chẩn đoán và triệu chứng</span>}</div>
                    <div className="flex items-center gap-2">
                        <Button variant="ghost" onClick={onClose}>Hủy</Button>
                        <Button className="bg-primary-600 hover:bg-primary-500" onClick={handleSubmit} disabled={!isFormValid}>
                            <Save size={16} className="mr-2" />{isEditing ? 'Cập nhật' : 'Lưu bệnh án'}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

// ============ Form View ============
interface FormViewProps {
    formData: MedicalRecordData;
    updateField: (field: keyof MedicalRecordData, value: any) => void;
    updateVitalSign: (field: keyof VitalSigns, value: string) => void;
    medicineSearch: string;
    setMedicineSearch: (v: string) => void;
    showMedicineDropdown: boolean;
    setShowMedicineDropdown: (v: boolean) => void;
    filteredMedicines: MedicineResponse[];
    addMedicine: (m: MedicineResponse) => void;
    updatePrescriptionItem: (idx: number, field: keyof PrescriptionItem, value: string | number) => void;
    removePrescriptionItem: (idx: number) => void;
}

const FormView = ({ formData, updateField, updateVitalSign, medicineSearch, setMedicineSearch, showMedicineDropdown, setShowMedicineDropdown, filteredMedicines, addMedicine, updatePrescriptionItem, removePrescriptionItem }: FormViewProps) => (
    <div className="space-y-6">
        <div>
            <h3 className="text-sm font-bold text-dark-200 flex items-center gap-2 mb-4"><Stethoscope size={16} className="text-primary-400" /> Thông tin lâm sàng</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-xs font-semibold text-dark-400 mb-1.5 uppercase tracking-wider">Triệu chứng <span className="text-red-400">*</span></label>
                    <textarea value={formData.symptoms} onChange={(e) => updateField('symptoms', e.target.value)} placeholder="Mô tả triệu chứng..." rows={3} className="w-full bg-dark-800 border border-dark-600 rounded-lg px-3 py-2.5 text-sm text-dark-200 placeholder-dark-500 focus:outline-none focus:ring-2 focus:ring-primary-500/30 resize-none" />
                </div>
                <div>
                    <label className="block text-xs font-semibold text-dark-400 mb-2 uppercase tracking-wider">Sinh hiệu</label>
                    <div className="grid grid-cols-2 gap-2 bg-dark-800/50 p-3 rounded-lg border border-dark-700/50">
                        <div>
                            <label className="block text-[10px] text-dark-500 mb-1">Huyết áp (mmHg)</label>
                            <input type="text" value={formData.vitalSigns.bloodPressure} onChange={(e) => updateVitalSign('bloodPressure', e.target.value)} placeholder="120/80" className="w-full bg-dark-800 border border-dark-700 rounded px-2.5 py-1.5 text-xs text-dark-200 focus:outline-none focus:ring-1 focus:ring-primary-500" />
                        </div>
                        <div>
                            <label className="block text-[10px] text-dark-500 mb-1">Nhịp tim (bpm)</label>
                            <input type="text" value={formData.vitalSigns.heartRate} onChange={(e) => updateVitalSign('heartRate', e.target.value)} placeholder="75" className="w-full bg-dark-800 border border-dark-700 rounded px-2.5 py-1.5 text-xs text-dark-200 focus:outline-none focus:ring-1 focus:ring-primary-500" />
                        </div>
                        <div>
                            <label className="block text-[10px] text-dark-500 mb-1">Nhiệt độ (°C)</label>
                            <input type="text" value={formData.vitalSigns.temperature} onChange={(e) => updateVitalSign('temperature', e.target.value)} placeholder="37" className="w-full bg-dark-800 border border-dark-700 rounded px-2.5 py-1.5 text-xs text-dark-200 focus:outline-none focus:ring-1 focus:ring-primary-500" />
                        </div>
                        <div>
                            <label className="block text-[10px] text-dark-500 mb-1">Cân nặng (kg)</label>
                            <input type="text" value={formData.vitalSigns.weight} onChange={(e) => updateVitalSign('weight', e.target.value)} placeholder="65" className="w-full bg-dark-800 border border-dark-700 rounded px-2.5 py-1.5 text-xs text-dark-200 focus:outline-none focus:ring-1 focus:ring-primary-500" />
                        </div>
                    </div>
                </div>
                <div>
                    <label className="block text-xs font-semibold text-dark-400 mb-1.5 uppercase tracking-wider">Chẩn đoán <span className="text-red-400">*</span></label>
                    <input type="text" value={formData.diagnosis} onChange={(e) => updateField('diagnosis', e.target.value)} placeholder="VD: Viêm họng cấp (J02.9)" className="w-full bg-dark-800 border border-dark-600 rounded-lg px-3 py-2.5 text-sm text-dark-200 placeholder-dark-500 focus:outline-none focus:ring-2 focus:ring-primary-500/30" />
                </div>
                <div>
                    <label className="block text-xs font-semibold text-dark-400 mb-1.5 uppercase tracking-wider">Phương pháp điều trị</label>
                    <input type="text" value={formData.treatment} onChange={(e) => updateField('treatment', e.target.value)} placeholder="Mô tả hướng điều trị..." className="w-full bg-dark-800 border border-dark-600 rounded-lg px-3 py-2.5 text-sm text-dark-200 placeholder-dark-500 focus:outline-none focus:ring-2 focus:ring-primary-500/30" />
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div>
                    <label className="block text-xs font-semibold text-dark-400 mb-1.5 uppercase tracking-wider">Ghi chú</label>
                    <textarea value={formData.notes} onChange={(e) => updateField('notes', e.target.value)} placeholder="Ghi chú thêm..." rows={2} className="w-full bg-dark-800 border border-dark-600 rounded-lg px-3 py-2.5 text-sm text-dark-200 placeholder-dark-500 focus:outline-none focus:ring-2 focus:ring-primary-500/30 resize-none" />
                </div>
                <div>
                    <label className="block text-xs font-semibold text-dark-400 mb-1.5 uppercase tracking-wider">Ngày tái khám</label>
                    <input type="date" value={formData.followUpDate} onChange={(e) => updateField('followUpDate', e.target.value)} className="w-full bg-dark-800 border border-dark-600 rounded-lg px-3 py-2.5 text-sm text-dark-200 focus:outline-none focus:ring-2 focus:ring-primary-500/30" />
                </div>
            </div>
        </div>

        <div>
            <h3 className="text-sm font-bold text-dark-200 flex items-center gap-2 mb-4"><Pill size={16} className="text-emerald-400" /> Đơn thuốc</h3>
            <div className="relative mb-4">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-500" />
                <input type="text" value={medicineSearch}
                    onChange={(e) => { setMedicineSearch(e.target.value); setShowMedicineDropdown(true); }}
                    onFocus={() => setShowMedicineDropdown(true)}
                    placeholder="Tìm thuốc để thêm vào đơn..."
                    className="w-full bg-dark-800 border border-dark-600 rounded-lg pl-10 pr-3 py-2.5 text-sm text-dark-200 placeholder-dark-500 focus:outline-none focus:ring-2 focus:ring-primary-500/30" />
                {showMedicineDropdown && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-dark-800 border border-dark-600 rounded-lg shadow-xl max-h-48 overflow-y-auto z-10">
                        {filteredMedicines.map(med => (
                            <button key={med.id} onClick={() => addMedicine(med)} className="w-full text-left px-3 py-2 text-sm text-dark-200 hover:bg-dark-700 transition-colors flex items-center justify-between">
                                <span>{med.name}{med.strength ? ` ${med.strength}` : ''}</span>
                                <Plus size={14} className="text-primary-400" />
                            </button>
                        ))}
                        {filteredMedicines.length === 0 && <p className="px-3 py-2 text-xs text-dark-500">Không tìm thấy thuốc</p>}
                    </div>
                )}
            </div>

            {formData.prescriptionDetails.length > 0 && (
                <div className="space-y-2 mb-4">
                    {formData.prescriptionDetails.map((item, idx) => (
                        <div key={idx} className="border border-dark-700/50 rounded-xl p-3 bg-dark-800/20">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium text-dark-100">{idx + 1}. {item.medicineName}</span>
                                <button onClick={() => removePrescriptionItem(idx)} className="p-1 rounded text-red-400/60 hover:text-red-400 hover:bg-red-900/20 transition-all"><Trash2 size={14} /></button>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                                <div><label className="text-[10px] text-dark-500 block mb-0.5">Liều lượng</label><input type="text" value={item.dosage} onChange={(e) => updatePrescriptionItem(idx, 'dosage', e.target.value)} placeholder="500mg" className="w-full bg-dark-800 border border-dark-700 rounded-md px-2 py-1.5 text-xs text-dark-200 placeholder-dark-600 focus:outline-none focus:ring-1 focus:ring-primary-500" /></div>
                                <div><label className="text-[10px] text-dark-500 block mb-0.5">Tần suất</label><input type="text" value={item.frequency} onChange={(e) => updatePrescriptionItem(idx, 'frequency', e.target.value)} placeholder="3 lần/ngày" className="w-full bg-dark-800 border border-dark-700 rounded-md px-2 py-1.5 text-xs text-dark-200 placeholder-dark-600 focus:outline-none focus:ring-1 focus:ring-primary-500" /></div>
                                <div><label className="text-[10px] text-dark-500 block mb-0.5">Thời gian</label><input type="text" value={item.duration} onChange={(e) => updatePrescriptionItem(idx, 'duration', e.target.value)} placeholder="5 ngày" className="w-full bg-dark-800 border border-dark-700 rounded-md px-2 py-1.5 text-xs text-dark-200 placeholder-dark-600 focus:outline-none focus:ring-1 focus:ring-primary-500" /></div>
                                <div><label className="text-[10px] text-dark-500 block mb-0.5">Số lượng</label><input type="number" min={1} value={item.quantity} onChange={(e) => updatePrescriptionItem(idx, 'quantity', Number(e.target.value))} className="w-full bg-dark-800 border border-dark-700 rounded-md px-2 py-1.5 text-xs text-dark-200 focus:outline-none focus:ring-1 focus:ring-primary-500" /></div>
                                <div><label className="text-[10px] text-dark-500 block mb-0.5">Hướng dẫn</label><input type="text" value={item.instructions} onChange={(e) => updatePrescriptionItem(idx, 'instructions', e.target.value)} placeholder="Uống sau ăn" className="w-full bg-dark-800 border border-dark-700 rounded-md px-2 py-1.5 text-xs text-dark-200 placeholder-dark-600 focus:outline-none focus:ring-1 focus:ring-primary-500" /></div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {formData.prescriptionDetails.length === 0 && (
                <div className="text-center py-6 border border-dashed border-dark-700 rounded-xl mb-4">
                    <Pill size={32} className="mx-auto text-dark-600 mb-2" />
                    <p className="text-sm text-dark-500">Chưa có thuốc nào trong đơn</p>
                    <p className="text-xs text-dark-600 mt-0.5">Tìm kiếm thuốc ở trên để thêm</p>
                </div>
            )}

            <div>
                <label className="block text-xs font-semibold text-dark-400 mb-1.5 uppercase tracking-wider">Ghi chú đơn thuốc</label>
                <input type="text" value={formData.prescriptionNotes} onChange={(e) => updateField('prescriptionNotes', e.target.value)} placeholder="VD: Uống sau ăn, tránh rượu bia..." className="w-full bg-dark-800 border border-dark-600 rounded-lg px-3 py-2.5 text-sm text-dark-200 placeholder-dark-500 focus:outline-none focus:ring-2 focus:ring-primary-500/30" />
            </div>
        </div>
    </div>
);

// ============ Preview View ============
const PreviewView = ({ formData, patientName }: { formData: MedicalRecordData; patientName: string }) => {
    const today = new Date().toLocaleDateString('vi-VN', { weekday: 'long', day: '2-digit', month: '2-digit', year: 'numeric' });
    return (
        <div className="space-y-5">
            <div className="text-center border-b border-dark-700 pb-4">
                <p className="text-lg font-bold text-dark-50">🏥 PHÒNG KHÁM CLINICPRO</p>
                <p className="text-xs text-dark-400 mt-1">PHIẾU KHÁM BỆNH</p>
                <p className="text-xs text-dark-500 mt-0.5">{today}</p>
            </div>
            <div className="flex items-center gap-2 text-sm text-dark-200"><strong className="text-dark-400">Bệnh nhân:</strong> {patientName}</div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {formData.symptoms && <PreviewField label="Triệu chứng" value={formData.symptoms} icon={<FileText size={14} />} />}
                {(formData.vitalSigns.bloodPressure || formData.vitalSigns.temperature) && (
                    <PreviewField
                        label="Sinh hiệu"
                        value={`${formData.vitalSigns.bloodPressure ? `HA: ${formData.vitalSigns.bloodPressure}mmHg` : ''} ${formData.vitalSigns.temperature ? `| T°: ${formData.vitalSigns.temperature}°C` : ''}`}
                        icon={<Activity size={14} />}
                    />
                )}
                {formData.diagnosis && <PreviewField label="Chẩn đoán" value={formData.diagnosis} icon={<Stethoscope size={14} />} highlight />}
                {formData.treatment && <PreviewField label="Điều trị" value={formData.treatment} icon={<FileText size={14} />} />}
            </div>
            {formData.notes && <PreviewField label="Ghi chú" value={formData.notes} icon={<FileText size={14} />} />}
            {formData.followUpDate && (
                <div className="flex items-center gap-2 text-sm"><Calendar size={14} className="text-amber-400" /><span className="text-amber-400 font-medium">Tái khám: {new Date(formData.followUpDate).toLocaleDateString('vi-VN')}</span></div>
            )}
            {formData.prescriptionDetails.length > 0 && (
                <div className="border border-dark-700/50 rounded-xl p-4 bg-dark-800/20">
                    <div className="flex items-center gap-2 mb-3"><Pill size={16} className="text-emerald-400" /><p className="text-sm font-bold text-dark-50">ĐƠN THUỐC</p></div>
                    <div className="overflow-x-auto"><table className="w-full text-sm"><thead><tr className="text-[10px] text-dark-500 uppercase tracking-wider border-b border-dark-700/50"><th className="text-left py-2 pr-2">#</th><th className="text-left py-2 pr-2">Tên thuốc</th><th className="text-left py-2 pr-2">Liều</th><th className="text-left py-2 pr-2">Tần suất</th><th className="text-left py-2 pr-2">Thời gian</th><th className="text-left py-2 pr-2">SL</th><th className="text-left py-2">Hướng dẫn</th></tr></thead><tbody>
                        {formData.prescriptionDetails.map((item, i) => (<tr key={i} className="border-b border-dark-800/50 last:border-0"><td className="py-2 pr-2 text-dark-500">{i + 1}</td><td className="py-2 pr-2 text-dark-100 font-medium">{item.medicineName}</td><td className="py-2 pr-2 text-dark-300">{item.dosage || '—'}</td><td className="py-2 pr-2 text-dark-300">{item.frequency || '—'}</td><td className="py-2 pr-2 text-dark-300">{item.duration || '—'}</td><td className="py-2 pr-2 text-dark-300">{item.quantity}</td><td className="py-2 text-dark-400 text-xs">{item.instructions || '—'}</td></tr>))}
                    </tbody></table></div>
                    {formData.prescriptionNotes && <p className="text-xs text-dark-400 mt-3 italic">📝 {formData.prescriptionNotes}</p>}
                </div>
            )}
            {!formData.diagnosis && !formData.symptoms && (
                <div className="text-center py-8"><Eye size={40} className="mx-auto text-dark-600 mb-3" /><p className="text-dark-400">Chưa có dữ liệu để xem trước</p><p className="text-xs text-dark-500 mt-1">Chuyển sang tab "Nhập liệu" để điền bệnh án</p></div>
            )}
        </div>
    );
};

const PreviewField = ({ label, value, icon, highlight }: { label: string; value: string; icon: React.ReactNode; highlight?: boolean }) => (
    <div>
        <p className="text-[10px] font-bold text-dark-500 uppercase tracking-wider mb-1 flex items-center gap-1">{icon} {label}</p>
        <p className={`text-sm ${highlight ? 'text-dark-50 font-semibold' : 'text-dark-300'}`}>{value}</p>
    </div>
);

export default MedicalRecordFormModal;
