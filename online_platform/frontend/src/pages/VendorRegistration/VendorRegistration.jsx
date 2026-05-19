import React, { useState } from 'react';
import { useToast } from '../../components/Shared/ToastContext';
import { useVendors } from '../../components/Shared/VendorContext';
import { Store, FileText, CheckCircle, ArrowRight } from 'lucide-react';
import './VendorRegistration.css';

const VendorRegistration = () => {
    const [step, setStep] = useState(1);
    const { addToast } = useToast();
    const { addVendorRequest } = useVendors();
    const [formData, setFormData] = useState({
        name: '',
        category: 'Electronics',
        description: '',
        businessEmail: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        addVendorRequest(formData);
        setStep(3); // Go to success step
        addToast('Application submitted successfully!', 'success');
    };

    return (
        <div className="vendor-registration-page py-20">
            <div className="container">
                <div className="registration-card card mx-auto" style={{ maxWidth: '800px' }}>
                    <div className="registration-steps flex justify-between mb-12">
                        <div className={`step-item ${step >= 1 ? 'active' : ''}`}>
                            <div className="step-num">1</div>
                            <span>Store Info</span>
                        </div>
                        <div className="step-line"></div>
                        <div className={`step-item ${step >= 2 ? 'active' : ''}`}>
                            <div className="step-num">2</div>
                            <span>Verification</span>
                        </div>
                        <div className="step-line"></div>
                        <div className={`step-item ${step >= 3 ? 'active' : ''}`}>
                            <div className="step-num">3</div>
                            <span>Approval</span>
                        </div>
                    </div>

                    {step === 1 && (
                        <div className="form-step">
                            <div className="header-icon mb-6">
                                <Store size={48} className="text-primary" />
                            </div>
                            <h2>Tell us about your store</h2>
                            <p className="text-secondary mb-8">Set up your shop identity on Ventra Marketplace.</p>

                            <form className="grid gap-6">
                                <div className="form-group">
                                    <label>Store Name</label>
                                    <input
                                        type="text"
                                        className="input-field"
                                        placeholder="e.g. Nova Tech"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        required
                                    />
                                </div>

                                <div className="form-group mb-6">
                                    <label>Business Category</label>
                                    <select
                                        className="input-field"
                                        value={formData.category}
                                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                    >
                                        <option>Electronics</option>
                                        <option>Fashion</option>
                                        <option>Home & Living</option>
                                        <option>Audio</option>
                                    </select>
                                </div>

                                <div className="form-group mb-8">
                                    <label>Store Description</label>
                                    <textarea
                                        className="input-field"
                                        placeholder="Tell us about your brand..."
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        required
                                    />
                                </div>
                                <button type="button" className="btn btn-primary btn-lg mt-4" onClick={() => setStep(2)}>
                                    Continue <ArrowRight size={18} />
                                </button>
                            </form>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="form-step">
                            <div className="header-icon mb-6">
                                <FileText size={48} className="text-primary" />
                            </div>
                            <h2>Business Verification</h2>
                            <p className="text-secondary mb-8">We require business identification to maintain platform trust.</p>

                            <div className="upload-area mb-8 p-12 border-dashed card text-center">
                                <div className="mb-4 text-muted">Drag & drop business license (PDF/JPG)</div>
                                <button className="btn btn-outline">Browse Files</button>
                            </div>

                            <div className="flex gap-4">
                                <button className="btn btn-outline btn-lg flex-1" onClick={() => setStep(1)}>Back</button>
                                <button className="btn btn-primary btn-lg flex-2" onClick={handleSubmit}>Submit Application</button>
                            </div>
                        </div>
                    )}

                    {step === 3 && (
                        <div className="form-step text-center py-10">
                            <div className="header-icon mb-6">
                                <CheckCircle size={64} className="text-green-500" />
                            </div>
                            <h2>Application Sent!</h2>
                            <p className="text-secondary mb-8">
                                Our platform administrators are reviewing your request. <br />
                                You will be notified via email within 24-48 hours.
                            </p>
                            <div className="status-box p-6 bg-main rounded-xl mb-8">
                                <span className="text-xs text-muted block mb-2">CURRENT STATUS</span>
                                <span className="status-badge sm pending">Pending Approval</span>
                            </div>
                            <button className="btn btn-outline" onClick={() => window.location.href = '/'}>Return Home</button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default VendorRegistration;
