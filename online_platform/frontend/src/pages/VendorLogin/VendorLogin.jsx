import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useVendors } from '../../components/Shared/VendorContext';
import { useToast } from '../../components/Shared/ToastContext';
import { Store, LogIn, ShieldAlert, ArrowRight, Lock } from 'lucide-react';
import './VendorLogin.css';

const VendorLogin = () => {
    const { vendors, loginAsVendor } = useVendors();
    const { addToast } = useToast();
    const navigate = useNavigate();
    const [selectedVendorId, setSelectedVendorId] = useState('');

    const approvedVendors = vendors.filter(v => v.status === 'Approved');

    const handleLogin = (e) => {
        e.preventDefault();
        if (!selectedVendorId) {
            addToast('Please select a store to login.', 'info');
            return;
        }

        const success = loginAsVendor(selectedVendorId);
        if (success) {
            const vendor = vendors.find(v => v.id === selectedVendorId);
            addToast(`Welcome back, ${vendor.name}!`, 'success');
            navigate('/dashboard');
        } else {
            addToast('Login failed. Ensure the store is approved.', 'error');
        }
    };

    return (
        <div className="vendor-login-page py-20 bg-main">
            <div className="container">
                <div className="login-card card mx-auto" style={{ maxWidth: '500px' }}>
                    <div className="text-center mb-10">
                        <div className="login-icon-wrapper mx-auto mb-6">
                            <Lock size={32} className="text-white" />
                        </div>
                        <h2>Vendor Store Login</h2>
                        <p className="text-secondary mt-2">Select your approved store to manage inventory and orders.</p>
                    </div>

                    <form onSubmit={handleLogin} className="grid gap-6">
                        <div className="form-group">
                            <label className="block mb-2 font-semibold text-sm">Select Your Store</label>
                            <div className="custom-select-wrapper">
                                <select
                                    className="btn btn-outline w-full text-left"
                                    value={selectedVendorId}
                                    onChange={(e) => setSelectedVendorId(e.target.value)}
                                    style={{ paddingLeft: '1rem', appearance: 'auto' }}
                                >
                                    <option value="" disabled>Choose your business...</option>
                                    {approvedVendors.map(v => (
                                        <option key={v.id} value={v.id}>{v.name}</option>
                                    ))}
                                </select>
                            </div>
                            {approvedVendors.length === 0 && (
                                <p className="text-xs text-red-500 mt-2 flex items-center gap-1">
                                    <ShieldAlert size={12} /> No approved stores found.
                                </p>
                            )}
                        </div>

                        <button
                            type="submit"
                            className="btn btn-primary btn-lg w-full flex justify-center gap-2"
                            disabled={approvedVendors.length === 0}
                        >
                            Enter Dashboard <ArrowRight size={18} />
                        </button>

                        <div className="login-footer text-center mt-6">
                            <p className="text-sm text-muted">
                                Don't have a store yet? <br />
                                <button type="button" onClick={() => navigate('/sell')} className="text-primary font-bold underline mt-2">
                                    Apply for Merchant Account
                                </button>
                            </p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default VendorLogin;
