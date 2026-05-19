import React from 'react';
import { useVendors } from '../../../components/Shared/VendorContext';
import { useToast } from '../../../components/Shared/ToastContext';
import { Eye, Check, X, FileSearch } from 'lucide-react';
import '../../VendorDashboard/Orders/VendorOrders.css';

const VendorApproval = () => {
    const { vendors, updateVendorStatus } = useVendors();
    const { addToast } = useToast();

    const handleAction = (id, storeName, newStatus) => {
        updateVendorStatus(id, newStatus);
        const type = newStatus === 'Approved' ? 'success' : 'error';
        addToast(`Store "${storeName}" has been ${newStatus.toLowerCase()}!`, type);
    };

    return (
        <div className="admin-vendors">
            <div className="dashboard-header mb-8 flex justify-between items-end">
                <div>
                    <h1>Vendor Requests & Approval</h1>
                    <p className="text-secondary">Maintain and review listing requests for new stores onto the platform.</p>
                </div>
            </div>

            <div className="card">
                <table className="dashboard-table">
                    <thead>
                        <tr>
                            <th>Request ID</th>
                            <th>Store Name</th>
                            <th>Category</th>
                            <th>Application Date</th>
                            <th>Documents</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {vendors.length === 0 ? (
                            <tr>
                                <td colSpan="7" className="text-center py-20">
                                    <div className="opacity-20 mb-4 flex justify-center"><FileSearch size={48} /></div>
                                    <p className="text-muted">No vendor applications found.</p>
                                </td>
                            </tr>
                        ) : (
                            vendors.map(vendor => (
                                <tr key={vendor.id}>
                                    <td className="font-semibold text-xs">{vendor.id}</td>
                                    <td className="font-bold">{vendor.name}</td>
                                    <td>{vendor.category}</td>
                                    <td>{vendor.dateApplied}</td>
                                    <td><button className="text-primary text-xs font-semibold underline flex items-center gap-1"><Eye size={12} /> {vendor.doc}</button></td>
                                    <td>
                                        <span className={`status-badge sm ${vendor.status.toLowerCase()}`}>
                                            {vendor.status}
                                        </span>
                                    </td>
                                    <td>
                                        <div className="flex gap-2">
                                            {vendor.status === 'Pending' && (
                                                <>
                                                    <button className="btn-action accept flex items-center gap-1" onClick={() => handleAction(vendor.id, vendor.name, 'Approved')}>
                                                        <Check size={14} /> Approve
                                                    </button>
                                                    <button className="btn-action flex items-center gap-1" style={{ background: '#fee2e2', color: '#991b1b', borderColor: '#fecaca', padding: '0 0.75rem', width: 'auto' }} onClick={() => handleAction(vendor.id, vendor.name, 'Rejected')}>
                                                        <X size={14} /> Reject
                                                    </button>
                                                </>
                                            )}
                                            {vendor.status !== 'Pending' && (
                                                <button className="btn-action view" title="View Profile">
                                                    <Eye size={16} />
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default VendorApproval;
