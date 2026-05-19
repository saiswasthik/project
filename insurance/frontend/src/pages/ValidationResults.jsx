import React from 'react';
import { AlertTriangle, FileX, ShieldAlert, Lightbulb, Check, Loader2, X, FileText, Search, Edit3, Save } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';

const ValidationResults = () => {
    const location = useLocation();
    const navigate = useNavigate();

    // Core State
    const [claimId, setClaimId] = React.useState('');
    const [validationReport, setValidationReport] = React.useState(null);
    const [extractedTextData, setExtractedTextData] = React.useState(null);
    const [corrections, setCorrections] = React.useState({});
    const [selectedDoc, setSelectedDoc] = React.useState(null);

    // UI State
    const [searchInput, setSearchInput] = React.useState('');
    const [loading, setLoading] = React.useState(false);
    const [isSaving, setIsSaving] = React.useState(false);

    // Filtered Content State
    const [missingDocsItems, setMissingDocsItems] = React.useState([]);
    const [inconsistencyItems, setInconsistencyItems] = React.useState([]);
    const [highRiskItems, setHighRiskItems] = React.useState([]);
    const [suggestionItems, setSuggestionItems] = React.useState([]);

    const fetchClaimData = (id) => {
        if (!id) return;
        setLoading(true);
        setExtractedTextData(null);
        setCorrections({});

        fetch(`http://localhost:8000/documents/get_claim_details?claim_id=${id}`)
            .then(res => res.json())
            .then(data => {
                if (data.error) {
                    alert("Claim ID not found.");
                } else {
                    setValidationReport(data.validation_report);
                    setExtractedTextData(data.extracted_text || {});

                    const merged = {
                        ...(data.extracted_text || {}),
                        ...(data.updated_text || {})
                    };
                    setCorrections(merged);

                    const docList = Object.keys(data.extracted_text || {});
                    if (docList.length > 0) {
                        setSelectedDoc(docList[0]);
                    }

                    setClaimId(id);
                    navigate('.', {
                        state: { ...location.state, claimId: id, validationReport: data.validation_report },
                        replace: true
                    });
                }
            })
            .catch(err => {
                console.error("Fetch error:", err);
            })
            .finally(() => setLoading(false));
    };

    React.useEffect(() => {
        const idFromState = location.state?.claimId;
        if (idFromState && idFromState !== claimId) {
            setClaimId(idFromState);
            fetchClaimData(idFromState);
        }
    }, [location.state]);

    React.useEffect(() => {
        if (!claimId && location.state?.claimId) {
            setClaimId(location.state.claimId);
        }
    }, []);

    React.useEffect(() => {
        if (!validationReport) {
            setMissingDocsItems([]); setInconsistencyItems([]); setHighRiskItems([]); setSuggestionItems([]);
            return;
        }

        const missing = [];
        const inconsistencies = [];
        const risks = [];
        const suggestions = [];

        Object.keys(validationReport).forEach(key => {
            const data = validationReport[key];
            const getVal = (obj, keys) => {
                if (!obj) return null;
                for (const k of keys) {
                    if (obj[k]) return obj[k];
                    const lowerKey = Object.keys(obj).find(ok => ok.toLowerCase() === k.toLowerCase());
                    if (lowerKey) return obj[lowerKey];
                }
                return null;
            };

            const mField = getVal(data, ["missing fields", "Missing fields", "missing_fields"]);
            if (mField) {
                if (Array.isArray(mField)) {
                    mField.forEach(f => { if (f && f.length > 2) missing.push(`${key}: ${f}`) });
                } else if (typeof mField === 'string' && mField.toLowerCase() !== 'none' && mField.length > 2) {
                    missing.push(`${key}: ${mField}`);
                }
            }

            const iNote = getVal(data, ["Notes on inconsistencies", "details", "inconsistencies", "notes"]);
            if (iNote) {
                if (Array.isArray(iNote)) {
                    iNote.forEach(n => { if (n && n.length > 2) inconsistencies.push(`${key}: ${n}`) });
                } else if (typeof iNote === 'string' && iNote.toLowerCase() !== 'none' && iNote.length > 2) {
                    inconsistencies.push(`${key}: ${iNote}`);
                }
            }

            if (key === "Overall Validation") {
                const crit = getVal(data, ["Critical Discrepancies", "critical_discrepancies"]);
                if (crit) inconsistencies.push(`Critical: ${crit}`);
                const nm = getVal(data, ["Patient Name Match", "patient_name_match"]);
                if (nm === "No") risks.push("Patient Name Mismatch detected");
            }
        });

        setMissingDocsItems(missing.length > 0 ? missing : ["No missing documents identified."]);
        setInconsistencyItems(inconsistencies.length > 0 ? inconsistencies : ["No data inconsistencies found."]);
        setHighRiskItems(risks.length > 0 ? risks : ["No high-risk warnings."]);
        setSuggestionItems(suggestions.length > 0 ? suggestions : ["Ready for processing."]);
    }, [validationReport]);

    const handleSearch = () => {
        if (searchInput.trim()) {
            fetchClaimData(searchInput.trim());
        }
    };

    const handleCorrectionChange = (e) => {
        if (!selectedDoc) return;
        setCorrections(prev => ({
            ...prev,
            [selectedDoc]: e.target.value
        }));
    };

    const [isRevalidating, setIsRevalidating] = React.useState(false);

    const handleRevalidate = () => {
        if (!claimId) return;
        setIsRevalidating(true);
        const formData = new FormData();
        formData.append('claim_id', claimId);

        fetch('http://localhost:8000/documents/revalidate_claim', {
            method: 'POST',
            body: formData
        })
            .then(res => res.json())
            .then(data => {
                if (data.status === 'Success') {
                    setValidationReport(data.validation_report);
                    alert("AI Analysis refreshed with your corrections!");
                } else {
                    alert("Analysis refresh failed.");
                }
            })
            .catch(err => console.error("Re-validation error:", err))
            .finally(() => setIsRevalidating(false));
    };

    const handleSubmitCorrections = () => {
        if (!selectedDoc || !claimId) return;

        setIsSaving(true);
        const formData = new FormData();
        formData.append('claim_id', claimId);
        formData.append('document_name', selectedDoc);
        formData.append('corrected_text', corrections[selectedDoc] || '');

        fetch('http://localhost:8000/documents/update_claim_data', {
            method: 'POST',
            body: formData
        })
            .then(res => res.json())
            .then(data => {
                if (data.status === 'Success') {
                    alert("Document text saved! Click 'Re-run AI Analysis' to update the findings above.");
                } else {
                    alert("Failed to save correction.");
                }
            })
            .catch(err => {
                console.error("Save error:", err);
            })
            .finally(() => setIsSaving(false));
    };

    const IssueCard = ({ title, items, icon: Icon, colorClass, bgClass, borderClass }) => (
        <div className={`card border-l-4 ${borderClass} h-full min-h-[160px]`}>
            <div className="flex items-center gap-3 mb-3">
                <div className={`w-10 h-10 rounded-lg ${bgClass} flex items-center justify-center ${colorClass}`}>
                    <Icon size={20} />
                </div>
                <div>
                    <h3 className="font-bold text-slate-800 text-sm whitespace-nowrap">{title}</h3>
                </div>
            </div>
            <ul className="space-y-1 overflow-y-auto max-h-32 pr-2">
                {items.map((item, idx) => (
                    <li key={idx} className="text-[11px] text-slate-600 bg-slate-50 p-1.5 rounded border border-slate-100">
                        {item}
                    </li>
                ))}
            </ul>
        </div>
    );

    return (
        <div className="container mx-auto p-4 max-w-7xl">
            {/* Header Content */}
            <div className="mb-6 flex justify-between items-end">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Validation & Review</h1>
                    <p className="text-slate-500 text-sm">Analyze claim discrepancies and correct extraction errors</p>
                </div>
                <div className="text-right">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active claim-ID</span>
                    <p className="text-xl font-mono font-bold text-blue-600">{claimId || 'NO_CLAIM_LOADED'}</p>
                </div>
            </div>

            {/* AI Findings */}
            <div className="grid grid-cols-4 gap-4 mb-6 animate-in fade-in duration-300">
                <IssueCard title="Missing Info" items={missingDocsItems} icon={FileX} colorClass="text-red-500" bgClass="bg-red-50" borderClass="border-l-red-500" />
                <IssueCard title="Inconsistencies" items={inconsistencyItems} icon={AlertTriangle} colorClass="text-orange-500" bgClass="bg-orange-50" borderClass="border-l-orange-500" />
                <IssueCard title="High Risk" items={highRiskItems} icon={ShieldAlert} colorClass="text-yellow-600" bgClass="bg-yellow-50" borderClass="border-l-yellow-600" />
                <IssueCard title="Suggestions" items={suggestionItems} icon={Lightbulb} colorClass="text-blue-500" bgClass="bg-blue-50" borderClass="border-l-blue-500" />
            </div>

            {/* Search Repository */}
            <div className="flex gap-4 mb-8 bg-white p-4 rounded-lg shadow-sm border border-slate-200 items-center">
                <div className="flex-1 flex items-center gap-3 bg-slate-50 px-4 py-2 rounded-lg border border-slate-100">
                    <Search size={18} className="text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search by Claim ID (e.g. CLM-2024-001)..."
                        className="bg-transparent flex-1 outline-none text-slate-700 text-sm"
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                    />
                </div>
                <button
                    disabled={loading}
                    className="btn btn-primary px-8 flex items-center gap-2"
                    onClick={handleSearch}
                >
                    {loading ? <Loader2 size={16} className="animate-spin" /> : <Search size={16} />}
                    Search Claim
                </button>
            </div>

            {/* Document Editor Center */}
            <div className="bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden animate-in slide-in-from-bottom-4 duration-500">
                {/* Multi-Document Tabs */}
                <div className="flex border-b border-slate-200 bg-slate-50 px-4 pt-4 gap-2">
                    {extractedTextData && Object.keys(extractedTextData).length > 0 ? Object.keys(extractedTextData).map((docName) => (
                        <button
                            key={docName}
                            onClick={() => setSelectedDoc(docName)}
                            className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-all duration-200 flex items-center gap-2 ${selectedDoc === docName
                                ? 'bg-white text-blue-600 border-t border-l border-r border-slate-200 -mb-px shadow-sm z-10'
                                : 'text-slate-500 hover:text-slate-700 hover:bg-slate-100'
                                }`}
                        >
                            <FileText size={14} />
                            <span className="max-w-[150px] truncate uppercase text-[10px] tracking-widest">{docName}</span>
                        </button>
                    )) : (
                        <div className="p-4 text-slate-400 italic text-sm">No documents found for this claim.</div>
                    )}
                </div>

                {/* Split Panel View */}
                <div className="grid grid-cols-2 divide-x divide-slate-200 h-[700px]">
                    {/* Source Panel */}
                    <div className="p-0 flex flex-col h-full bg-white">
                        <div className="p-3 bg-slate-50/50 border-b border-slate-100 text-[10px] font-bold text-slate-400 tracking-widest uppercase flex justify-between">
                            <span>Source Extraction</span>
                            <span>Read Only Mode</span>
                        </div>
                        <div className="flex-1 p-6 overflow-auto font-mono text-xs text-slate-500 leading-relaxed whitespace-pre-wrap">
                            {extractedTextData && selectedDoc ? extractedTextData[selectedDoc] : "Select a document tab above to view text."}
                        </div>
                    </div>

                    {/* Editor Panel */}
                    <div className="p-0 flex flex-col h-full bg-slate-50/10">
                        <div className="p-3 bg-white border-b border-slate-200 text-[10px] font-bold text-blue-500 tracking-widest uppercase flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Edit3 size={12} />
                                <span>Correction Editor</span>
                            </div>
                            <span className="text-slate-400 lowercase font-normal italic">Manual Override Layer</span>
                        </div>
                        <div className="flex-1 p-6 flex flex-col h-full">
                            <textarea
                                className="w-full flex-1 p-4 border border-slate-200 rounded-lg shadow-inner focus:ring-2 focus:ring-blue-500/10 focus:border-blue-300 outline-none text-xs font-mono resize-none transition-all leading-relaxed text-slate-700 h-full"
                                placeholder="Edit the extracted text here to correct errors identified in the findings above..."
                                value={selectedDoc ? (corrections[selectedDoc] || '') : ''}
                                onChange={handleCorrectionChange}
                                disabled={!selectedDoc}
                            ></textarea>

                            <div className="mt-4 flex justify-between items-center px-1">
                                <div className="flex flex-col">
                                    <span className="text-[10px] text-slate-400 italic font-medium">1. Save changes to storage.</span>
                                    <span className="text-[10px] text-slate-400 italic font-medium">2. Refresh analysis to update cards.</span>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        disabled={isRevalidating || !claimId}
                                        className="btn btn-outline btn-sm flex items-center gap-2 text-blue-600 border-blue-200"
                                        onClick={handleRevalidate}
                                    >
                                        {isRevalidating ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
                                        Re-run AI Analysis
                                    </button>
                                    <button
                                        disabled={isSaving || !selectedDoc}
                                        className="btn btn-primary btn-sm flex items-center gap-2 hover:shadow-lg transition-all"
                                        onClick={handleSubmitCorrections}
                                    >
                                        {isSaving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                                        Save Text Changes
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ValidationResults;
