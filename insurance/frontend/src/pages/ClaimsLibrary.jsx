import React from 'react';
import { Filter, Download, FileText, ChevronRight, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ClaimsLibrary = () => {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = React.useState('');
    const [statusFilter, setStatusFilter] = React.useState('All Status');
    const [scoreFilter, setScoreFilter] = React.useState('All Scores');

    const [claims, setClaims] = React.useState([]);
    const [loading, setLoading] = React.useState(true);

    const fetchClaims = () => {
        setLoading(true);
        fetch('http://localhost:8000/documents/all_claims')
            .then(res => res.json())
            .then(data => {
                const claimsList = Object.entries(data).map(([id, details]) => ({
                    id: id,
                    patient: details.claim_details?.patient_name || 'N/A',
                    provider: details.claim_details?.insurance_company || 'N/A',
                    date: details.timestamp ? details.timestamp.split('T')[0] : 'N/A',
                    amount: '$' + (details.claim_details?.amount || '0.00'),
                    score: details.validation_report ? '85%' : 'N/A', // Placeholder score
                    status: details.status || 'Pending',
                    raw: details
                })).reverse();
                setClaims(claimsList);
            })
            .catch(err => console.error("Error fetching claims:", err))
            .finally(() => setLoading(false));
    };

    React.useEffect(() => {
        fetchClaims();
    }, []);

    const filteredClaims = claims.filter(claim => {
        const matchesSearch =
            claim.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
            claim.patient.toLowerCase().includes(searchQuery.toLowerCase()) ||
            claim.provider.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesStatus = statusFilter === 'All Status' || claim.status === statusFilter;

        let matchesScore = true;
        if (scoreFilter === '> 90%') {
            matchesScore = parseInt(claim.score) > 90;
        } else if (scoreFilter === '> 70%') {
            matchesScore = parseInt(claim.score) > 70;
        }

        return matchesSearch && matchesStatus && matchesScore;
    });

    const getStatusBadge = (status) => {
        switch (status) {
            case 'Validated':
            case 'Success':
            case 'Approved': return <span className="badge badge-success">Approved</span>;
            case 'Rejected':
            case 'Error': return <span className="badge badge-danger">Rejected</span>;
            case 'In Review':
            case 'Needs Review': return <span className="badge" style={{ backgroundColor: '#e0f2fe', color: '#0ea5e9' }}>In Review</span>;
            case 'Pending': return <span className="badge badge-warning">Pending</span>;
            default: return <span className="badge badge-neutral">{status}</span>;
        }
    };

    const getScoreColor = (score) => {
        if (score === 'N/A') return '#94a3b8';
        const val = parseInt(score);
        if (val > 90) return '#10b981'; // green
        if (val > 70) return '#f59e0b'; // orange
        return '#ef4444'; // red
    }

    const handleViewClaim = (claim) => {
        navigate('/validation', {
            state: {
                claimId: claim.id,
                validationReport: claim.raw.validation_report
            }
        });
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Claims</h1>
                    <p className="text-slate-500">Manage and validate healthcare insurance claims</p>
                </div>
                <button
                    className="btn btn-primary gap-2"
                    onClick={() => navigate('/documents')}
                >
                    + New Claim
                </button>
            </div>

            <div className="card p-4 mb-6 flex gap-4 items-center flex-wrap">
                <div className="flex-1 min-w-[200px]">
                    <input
                        type="text"
                        placeholder="Search by claim number, patient..."
                        className="input"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <div className="w-40">
                    <select
                        className="input"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                    >
                        <option>All Status</option>
                        <option>Approved</option>
                        <option>Pending</option>
                        <option>In Review</option>
                        <option>Rejected</option>
                    </select>
                </div>
                <div className="w-40">
                    <select
                        className="input"
                        value={scoreFilter}
                        onChange={(e) => setScoreFilter(e.target.value)}
                    >
                        <option>All Scores</option>
                        <option>{'>'} 90%</option>
                        <option>{'>'} 70%</option>
                    </select>
                </div>
                <button className="btn btn-outline p-2 border-slate-300 transform hover:bg-slate-50">
                    <Filter size={18} className="text-slate-500" />
                </button>
                <button
                    className="btn btn-outline gap-2 border-slate-300 text-slate-600 transform hover:bg-slate-50"
                    onClick={() => alert(`Exporting ${filteredClaims.length} claims...`)}
                >
                    <Download size={18} />
                    Export
                </button>
            </div>

            <div className="card p-0 overflow-hidden">
                {loading ? (
                    <div className="p-20 text-center">
                        <Loader2 className="animate-spin text-blue-500 mx-auto mb-4" size={32} />
                        <p className="text-slate-500">Loading claims library...</p>
                    </div>
                ) : (
                    <>
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-slate-50">
                                <tr className="text-slate-500 text-xs font-semibold uppercase tracking-wider border-b border-slate-100">
                                    <th className="py-4 px-6">Claim</th>
                                    <th className="py-4 px-6">Patient / Provider</th>
                                    <th className="py-4 px-6">Date</th>
                                    <th className="py-4 px-6">Amount</th>
                                    <th className="py-4 px-6">Validation</th>
                                    <th className="py-4 px-6">Status</th>
                                    <th className="py-4 px-6 text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredClaims.length > 0 ? filteredClaims.map((claim, idx) => (
                                    <tr key={idx} className="border-b border-slate-50 hover:bg-slate-50 text-sm">
                                        <td className="py-4 px-6">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded bg-blue-50 flex items-center justify-center text-blue-600">
                                                    <FileText size={16} />
                                                </div>
                                                <span className="font-medium text-slate-800 font-mono">{claim.id}</span>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6">
                                            <div className="font-medium text-slate-800">{claim.patient}</div>
                                            <div className="text-xs text-slate-500">{claim.provider}</div>
                                        </td>
                                        <td className="py-4 px-6 text-slate-600">{claim.date}</td>
                                        <td className="py-4 px-6 font-medium text-slate-800">{claim.amount}</td>
                                        <td className="py-4 px-6">
                                            <div className="flex items-center gap-2">
                                                <div className="w-4 h-4 rounded-full border-2 flex items-center justify-center" style={{ borderColor: getScoreColor(claim.score) }}>
                                                    <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: getScoreColor(claim.score) }}></div>
                                                </div>
                                                <span style={{ color: getScoreColor(claim.score), fontWeight: 500 }}>{claim.score}</span>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6">{getStatusBadge(claim.status)}</td>
                                        <td className="py-4 px-6 text-right">
                                            <button
                                                onClick={() => handleViewClaim(claim)}
                                                className="text-blue-600 hover:text-blue-800 font-medium inline-flex items-center text-sm"
                                            >
                                                View <ChevronRight size={14} />
                                            </button>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan="7" className="py-10 text-center text-slate-400">No claims found matching your criteria.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>

                        <div className="p-4 border-t border-slate-100 flex justify-between items-center text-sm text-slate-500">
                            <div>Showing {filteredClaims.length} of {claims.length} claims</div>
                            <div className="flex gap-2">
                                <button className="btn btn-outline py-1 px-3 text-sm">Previous</button>
                                <button className="btn btn-outline py-1 px-3 text-sm">Next</button>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default ClaimsLibrary;
