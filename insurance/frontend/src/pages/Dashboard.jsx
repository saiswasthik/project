import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, AlertTriangle, CheckCircle, Clock, Loader2 } from 'lucide-react';
import StatsCard from '../components/dashboard/StatsCard';

const Dashboard = () => {
    const navigate = useNavigate();
    const [claims, setClaims] = React.useState([]);
    const [stats, setStats] = React.useState([]);
    const [loading, setLoading] = React.useState(true);

    const fetchDashboardData = () => {
        setLoading(true);
        fetch('http://localhost:8000/documents/all_claims')
            .then(res => res.json())
            .then(data => {
                // Convert object of claims to array and map to original structure
                const claimsList = Object.entries(data).map(([id, details]) => ({
                    id: id,
                    patientId: details.claim_details?.patient_name || 'N/A',
                    type: details.claim_details?.insurance_company || 'Insurance',
                    status: details.status || 'Pending',
                    updated: details.timestamp || 'Just now',
                    raw: details
                })).reverse();

                setClaims(claimsList);

                // Calculate stats matching the original appearance
                const total = claimsList.length;
                const successCount = claimsList.filter(c => c.status === 'Validated' || c.status === 'Success').length;
                const pendingCount = claimsList.filter(c => c.status === 'Pending').length;

                setStats([
                    {
                        title: 'Total Claims Reviewed',
                        value: total.toString(),
                        icon: FileText,
                        color: '#3b82f6',
                        subValue: 'All time'
                    },
                    {
                        title: 'Claims Ready for Submission',
                        value: successCount.toString(),
                        icon: CheckCircle,
                        color: '#10b981',
                        status: 'success',
                        statusText: 'Validated successfully',
                        subValue: 'Validated successfully'
                    },
                    {
                        title: 'Pending Validation',
                        value: pendingCount.toString(),
                        icon: Clock,
                        color: '#f59e0b',
                        status: 'warning',
                        statusText: 'In queue',
                        subValue: 'In queue'
                    }
                ]);
            })
            .catch(err => console.error("Error fetching dashboard data:", err))
            .finally(() => setLoading(false));
    };

    React.useEffect(() => {
        fetchDashboardData();
    }, []);

    const getStatusBadge = (status) => {
        switch (status) {
            case 'Validated':
            case 'Success':
            case 'Approved':
                return <span className="badge badge-success border border-black">Approved</span>;
            case 'Rejected':
            case 'Error':
                return <span className="badge badge-danger border border-black">Rejected</span>;
            case 'In Review':
            case 'Needs Review':
                return <span className="badge border border-blue" style={{ backgroundColor: '#e0f2fe', color: '#0ea5e9' }}>In Review</span>;
            default:
                return <span className="badge badge-warning border border-black">Pending</span>;
        }
    };

    const getTypeBadge = (type) => {
        return <span className="badge badge-neutral">{type}</span>;
    }

    const handleRowClick = (claim) => {
        navigate('/validation', {
            state: {
                claimId: claim.id,
                validationReport: claim.raw.validation_report
            }
        });
    };

    if (loading && claims.length === 0) {
        return <div className="flex items-center justify-center min-h-[50vh]"><Loader2 className="animate-spin text-blue-500" /></div>;
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Dashboard</h1>
                    <p className="text-slate-500">Overview of claim validation activity</p>
                </div>
                <button
                    className="btn btn-primary"
                    onClick={() => navigate('/documents')}
                >
                    New Claim Review
                </button>
            </div>

            <div className="flex gap-4 mb-8 flex-wrap">
                {stats.map((stat, index) => (
                    <StatsCard key={index} {...stat} />
                ))}
            </div>

            <div className="card">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-lg font-bold text-slate-800">Recent Claims</h2>
                    <button
                        className="text-blue-600 text-sm font-medium"
                        onClick={() => navigate('/claims')}
                    >
                        View all claims
                    </button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="text-slate-500 text-sm border-b border-slate-100">
                                <th className="py-3 font-medium">Claim ID</th>
                                <th className="py-3 font-medium">Patient ID</th>
                                <th className="py-3 font-medium">Claim Type</th>
                                <th className="py-3 font-medium">Status</th>
                                <th className="py-3 font-medium">Last Updated</th>
                            </tr>
                        </thead>
                        <tbody>
                            {claims.map((claim, idx) => (
                                <tr key={idx} className="border-b border-slate-50 hover:bg-slate-50 text-sm cursor-pointer" onClick={() => handleRowClick(claim)}>
                                    <td className="py-4 font-medium text-blue-600 font-mono">{claim.id}</td>
                                    <td className="py-4 text-slate-600">{claim.patientId}</td>
                                    <td className="py-4">{getTypeBadge(claim.type)}</td>
                                    <td className="py-4">{getStatusBadge(claim.status)}</td>
                                    <td className="py-4 text-slate-500">{claim.updated}</td>
                                </tr>
                            ))}
                            {claims.length === 0 && (
                                <tr>
                                    <td colSpan="5" className="py-10 text-center text-slate-400">No recent claims found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="mt-4 flex items-center gap-2 text-xs text-slate-400">
                    <AlertTriangle size={14} />
                    <span>AI-assisted validation. Does not constitute medical or coverage decisions.</span>
                </div>
            </div>
        </div>
    );
};

export default Dashboard
