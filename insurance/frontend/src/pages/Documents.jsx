import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, FileText, File, Image as ImageIcon, Receipt, X } from 'lucide-react';

const Documents = () => {
    const navigate = useNavigate();
    // New Form Fields State
    const [policyNumber, setPolicyNumber] = useState('');
    const [insuranceCompany, setInsuranceCompany] = useState('');
    const [tpaName, setTpaName] = useState('');
    const [claimId, setClaimId] = useState('');
    const [patientName, setPatientName] = useState('');
    const [policyHolderName, setPolicyHolderName] = useState('');
    const [employeeId, setEmployeeId] = useState('');
    const [idProof, setIdProof] = useState('');

    const [files, setFiles] = useState([]);
    const [loading, setLoading] = useState(true);
    const fileInputRef = useRef(null);

    const [recentDocs, setRecentDocs] = useState([]);
    const [categories, setCategories] = useState([
        { name: 'Discharge Summaries', count: 0, icon: FileText, color: '#3b82f6' },
        { name: 'Lab Reports', count: 0, icon: File, color: '#312e81' },
        { name: 'Prescriptions', count: 0, icon: FileText, color: '#1e40af' },
        { name: 'Imaging Reports', count: 0, icon: ImageIcon, color: '#1d4ed8' },
        { name: 'Itemized Bills', count: 0, icon: Receipt, color: '#2563eb' }
    ]);

    const fetchDocuments = async () => {
        setLoading(true);
        try {
            const response = await fetch('http://localhost:8000/documents/all_claims');
            const data = await response.json();

            const claimsArray = [];
            const counts = { 'Discharge Summaries': 0, 'Lab Reports': 0, 'Prescriptions': 0, 'Imaging Reports': 0, 'Itemized Bills': 0 };

            Object.entries(data).forEach(([claimId, claim]) => {
                const docs = claim.extracted_text || {};
                const docNames = Object.keys(docs);
                const timestamp = claim.timestamp ? new Date(claim.timestamp).toISOString().split('T')[0] : '2024-01-26';
                const patientName = claim.claim_details?.patient_name || 'Anonymous';

                // Track category counts across all individual docs
                docNames.forEach(docName => {
                    const nameLower = docName.toLowerCase();
                    if (nameLower.includes('lab') || nameLower.includes('blood') || nameLower.includes('report')) counts['Lab Reports']++;
                    else if (nameLower.includes('mri') || nameLower.includes('scan') || nameLower.includes('imaging')) counts['Imaging Reports']++;
                    else if (nameLower.includes('rx') || nameLower.includes('prescription')) counts['Prescriptions']++;
                    else if (nameLower.includes('bill') || nameLower.includes('invoice') || nameLower.includes('receipt')) counts['Itemized Bills']++;
                    else counts['Discharge Summaries']++;
                });

                // Add as a single "Person" entry to the recent list
                claimsArray.push({
                    name: patientName,
                    type: docNames.length > 1 ? `${docNames.length} Documents` : '1 Document',
                    size: claimId, // Showing Claim ID in the "Size" column slot
                    date: timestamp,
                    icon: FileText,
                    claimId: claimId
                });
            });

            // Sort claims by date (desc) and take top 5
            setRecentDocs(claimsArray.sort((a, b) => b.date.localeCompare(a.date)).slice(0, 5));

            // Update counts for the overview bubbles
            setCategories(prev => prev.map(cat => ({ ...cat, count: counts[cat.name] || 0 })));

        } catch (error) {
            console.error("Error fetching documents:", error);
        } finally {
            setLoading(false);
        }

    };

    React.useEffect(() => {
        fetchDocuments();
    }, []);

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files.length > 0) {
            const newFiles = Array.from(e.target.files).map(file => ({
                file,
                type: 'Discharge Summaries' // Default type
            }));
            setFiles(prev => [...prev, ...newFiles]);
        }

    };

    const handleTypeChange = (index, newType) => {
        setFiles(prev => prev.map((item, i) =>
            i === index ? { ...item, type: newType } : item
        ));
    };

    const triggerFileInput = () => {
        fileInputRef.current.click();
    };

    const removeFile = (index) => {
        setFiles(prev => prev.filter((_, i) => i !== index));
    };

    const isFormValid = () => {
        return (
            policyNumber.trim() &&
            insuranceCompany.trim() &&
            claimId.trim() &&
            patientName.trim() &&
            policyHolderName.trim() &&
            idProof.trim()
            // TPA and Employee ID can be optional as per common business logic, 
            // but user said "filling these details... then submit option enable", implying extensive validation.
            // Let's assume all are required based on strict user request, except maybe TPA ("if any").
            // For now, I will require everything except TPA and Employee ID to be safe, or just require all if user implied "these details".
            // Let's require all except TPA (user explicitly said "if any").
        );
    };

    const handleSubmit = async () => {
        if (!isFormValid()) {
            alert('Please fill in all required fields.');
            return;
        }
        if (files.length === 0) {
            alert('Please upload at least one document.');
            return;
        }

        const formData = new FormData();
        formData.append('health_policy_number', policyNumber);
        formData.append('insurance_company', insuranceCompany);
        formData.append('tpa_name', tpaName || '');
        formData.append('claim_id_ref_no', claimId);
        formData.append('patient_name', patientName);
        formData.append('policyholder_name', policyHolderName);
        formData.append('employee_id', employeeId || '');
        formData.append('valid_id_proof', idProof);

        // Append files
        files.forEach(({ file }) => {
            formData.append('files', file);
        });

        try {
            const response = await fetch('http://localhost:8000/documents/submit_claim', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                console.error("Backend error:", errorData);
                throw new Error('Failed to submit claim to backend');
            }

            const data = await response.json();

            console.log("Validation Report:", data.validation_report);

            // Navigate to Validation Results
            navigate('/validation', {
                state: {
                    validationReport: data.validation_report,
                    claimId: data.claim_id || claimId
                }
            });

        } catch (error) {
            console.error('Error submitting claim:', error);
            alert('Error submitting claim. Please ensure the backend is running on port 8000.');
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <div>

                    <h1 className="text-2xl font-bold text-slate-800">Documents</h1>
                    <p className="text-slate-500">Manage clinical documents for claim validation</p>
                </div>
                {/* <button
                    className="btn btn-primary gap-2"
                    onClick={() => {
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                >
                    <Upload size={18} />
                    Upload Documents
                </button> */}
            </div>

            <div className="card mb-8" style={{ display: 'flex', flexDirection: 'column' }}>
                <h2 className="text-lg font-bold text-slate-800 mb-4">Create New Claim</h2>
                <div className="grid grid-cols-2 gap-6 mb-6">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Health Policy Number <span className="text-red-500">*</span></label>
                        <input
                            type="text"
                            placeholder="e.g. POL-12345678"
                            className="input w-full"
                            value={policyNumber}
                            onChange={(e) => setPolicyNumber(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Insurance Company <span className="text-red-500">*</span></label>
                        <input
                            type="text"
                            placeholder="e.g. Medicare Ltd"
                            className="input w-full"
                            value={insuranceCompany}
                            onChange={(e) => setInsuranceCompany(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">TPA Name</label>
                        <input
                            type="text"
                            placeholder="Optional"
                            className="input w-full"
                            value={tpaName}
                            onChange={(e) => setTpaName(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Claim ID / Ref No <span className="text-red-500">*</span></label>
                        <input
                            type="text"
                            placeholder="e.g. CLM-2024-001"
                            className="input w-full"
                            value={claimId}
                            onChange={(e) => setClaimId(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Patient Name <span className="text-red-500">*</span></label>
                        <input
                            type="text"
                            placeholder="As per policy"
                            className="input w-full"
                            value={patientName}
                            onChange={(e) => setPatientName(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Policyholder Name <span className="text-red-500">*</span></label>
                        <input
                            type="text"
                            placeholder="Name of policy owner"
                            className="input w-full"
                            value={policyHolderName}
                            onChange={(e) => setPolicyHolderName(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Employee ID</label>
                        <input
                            type="text"
                            placeholder="If corporate insurance"
                            className="input w-full"
                            value={employeeId}
                            onChange={(e) => setEmployeeId(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Valid ID Proof <span className="text-red-500">*</span></label>
                        <input
                            type="text"
                            placeholder="Aadhaar / PAN"
                            className="input w-full"
                            value={idProof}
                            onChange={(e) => setIdProof(e.target.value)}
                        />
                    </div>
                </div>

                <div className="border-dashed border-2 border-slate-200 bg-slate-50 rounded-lg flex flex-col items-center justify-center py-12 mb-6 transition-colors hover:bg-slate-100">
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm mb-4">
                        <Upload size={24} className="text-slate-400" />
                    </div>
                    <p className="font-medium text-slate-800 mb-1">Drop clinical documents here</p>
                    <p className="text-sm text-slate-500 mb-4">Supports PDF, JPG, PNG up to 25MB</p>
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        style={{ display: 'none' }}
                        multiple
                    />
                    <button
                        className="btn bg-white border border-slate-200 text-slate-700 hover:bg-slate-50"
                        onClick={triggerFileInput}
                    >
                        Upload Files
                    </button>
                </div>

                {/* Selected Files List */}
                {files.length > 0 && (
                    <div className="mb-6 space-y-2">
                        <h4 className="text-sm font-medium text-slate-700">Selected Documents ({files.length})</h4>
                        {files.map((fileObj, idx) => (
                            <div key={idx} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-200">
                                <div className="flex items-center gap-3 flex-1">
                                    <FileText size={16} className="text-blue-500" />
                                    <div className="flex flex-col">
                                        <span className="text-sm text-slate-700">{fileObj.file.name}</span>
                                        <span className="text-xs text-slate-400">({(fileObj.file.size / 1024).toFixed(1)} KB)</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <select
                                        className="input text-xs py-1 px-2 h-auto"
                                        value={fileObj.type}
                                        onChange={(e) => handleTypeChange(idx, e.target.value)}
                                    >
                                        <option>Discharge Summaries</option>
                                        <option>Lab Reports</option>
                                        <option>Prescriptions</option>
                                        <option>Imaging Reports</option>
                                        <option>Itemized Bills</option>
                                    </select>
                                    <button onClick={() => removeFile(idx)} className="text-slate-400 hover:text-red-500">
                                        <X size={16} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                <div className="flex justify-end">
                    <button
                        className="btn btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                        onClick={handleSubmit}
                        disabled={!isFormValid() || files.length === 0}
                    >
                        Submit Claim for Review
                    </button>
                </div>
            </div>

            <h2 className="font-bold text-slate-800 mb-4">Document Categories</h2>
            <div className="grid grid-cols-5 gap-4 mb-8">
                {categories.map((cat, idx) => (
                    <div key={idx} className="card p-4 hover:shadow-md transition-shadow cursor-pointer">
                        <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center mb-3">
                            <cat.icon size={20} className="text-blue-600" />
                        </div>
                        <div className="font-medium text-slate-800 text-sm">{cat.name}</div>
                        <div className="text-xs text-slate-500">{cat.count} files</div>
                    </div>
                ))}
            </div>

            <div className="card">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="font-bold text-slate-800">Recent Documents</h2>
                    <div className="w-64">
                        <input type="text" placeholder="Search documents..." className="input text-sm py-1" />
                    </div>
                </div>

                <div className="flex flex-col">
                    {loading ? (
                        <div className="p-8 text-center text-slate-400">Loading recent documents...</div>
                    ) : recentDocs.length > 0 ? recentDocs.map((doc, idx) => (
                        <div key={idx} className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-lg border-b border-slate-50 last:border-0">
                            <div className="flex items-center gap-4">
                                <div className="p-2 bg-blue-50 rounded text-blue-600">
                                    <doc.icon size={18} />
                                </div>
                                <div>
                                    <div className="text-sm font-medium text-slate-800">{doc.name}</div>
                                    <div className="text-xs text-slate-500">{doc.type}</div>
                                </div>
                            </div>
                            <div className="flex items-center gap-8 text-sm text-slate-500">
                                <span>{doc.size}</span>
                                <span>{doc.date}</span>
                                <button
                                    onClick={() => navigate('/validation', { state: { claimId: doc.claimId } })}
                                    className="font-medium text-slate-700 hover:text-blue-600"
                                >
                                    View
                                </button>
                            </div>
                        </div>
                    )) : (
                        <div className="p-8 text-center text-slate-400">No documents uploaded yet.</div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Documents;
