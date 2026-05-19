import React, { useState } from 'react';
import {
    User, Bell, FileCheck, Shield, Mail, Phone,
    Building, Clock, ChevronDown, Lock, Save,
    Loader2
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import '../styles/settings.css';

const Settings = () => {
    const [activeTab, setActiveTab] = useState('profile');
    const { user } = useAuth();
    const [isSaving, setIsSaving] = useState(false);

    // Notification states
    const [notifs, setNotifs] = useState({
        statusUpdates: true,
        riskAlerts: true,
        dailyDigest: false
    });

    const handleSave = (e) => {
        if (e) e.preventDefault();
        setIsSaving(true);
        setTimeout(() => {
            setIsSaving(false);
            alert('Settings updated successfully!');
        }, 800);
    };

    const toggleNotif = (key) => {
        setNotifs(prev => ({ ...prev, [key]: !prev[key] }));
    };

    return (
        <div className="animate-in fade-in settings-container">
            {/* Header Section */}
            <header className="settings-header">
                <h1 className="settings-title">Settings</h1>
                <p className="settings-subtitle">Manage your account settings and preferences</p>
            </header>

            {/* Tabs Navigation */}
            <div className="settings-tab-list">
                <button
                    className={`settings-tab-trigger ${activeTab === 'profile' ? 'active' : ''}`}
                    onClick={() => setActiveTab('profile')}
                >
                    <User size={16} />
                    Profile
                </button>
                <button
                    className={`settings-tab-trigger ${activeTab === 'notifications' ? 'active' : ''}`}
                    onClick={() => setActiveTab('notifications')}
                >
                    <Bell size={16} />
                    Notifications
                </button>
                <button
                    className={`settings-tab-trigger ${activeTab === 'validation' ? 'active' : ''}`}
                    onClick={() => setActiveTab('validation')}
                >
                    <FileCheck size={16} />
                    Validation Rules
                </button>
                <button
                    className={`settings-tab-trigger ${activeTab === 'security' ? 'active' : ''}`}
                    onClick={() => setActiveTab('security')}
                >
                    <Shield size={16} />
                    Security
                </button>
            </div>

            {/* Dynamic Content */}
            <div className="pb-24">
                {activeTab === 'profile' && (
                    <div className="animate-in slide-in-from-right-4 space-y-6">
                        <section className="settings-card">
                            <h2 className="settings-card-title">Personal Information</h2>
                            <p className="settings-card-subtitle">Update your personal details and contact information</p>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="settings-label">First Name</label>
                                    <input type="text" className="settings-input" defaultValue="John" />
                                </div>
                                <div className="space-y-2">
                                    <label className="settings-label">Last Name</label>
                                    <input type="text" className="settings-input" defaultValue="Doe" />
                                </div>
                            </div>

                            <div className="mt-6 space-y-2">
                                <label className="settings-label">Email Address</label>
                                <div className="settings-input-container">
                                    <Mail className="settings-input-icon" />
                                    <input type="email" className="settings-input settings-input-with-icon" defaultValue="john.doe@claimsure.com" />
                                </div>
                            </div>

                            <div className="mt-6 space-y-2">
                                <label className="settings-label">Phone Number</label>
                                <div className="settings-input-container">
                                    <Phone className="settings-input-icon" />
                                    <input type="tel" className="settings-input settings-input-with-icon" defaultValue="+1 (555) 123-4567" />
                                </div>
                            </div>

                            <div className="mt-6 space-y-2">
                                <label className="settings-label">Department</label>
                                <div className="settings-input-container">
                                    <Building className="settings-input-icon" />
                                    <input type="text" className="settings-input settings-input-with-icon" defaultValue="Claims Processing" />
                                </div>
                            </div>

                            <div className="mt-6 space-y-2">
                                <label className="settings-label">Role</label>
                                <div className="settings-input-container">
                                    <select className="settings-input appearance-none">
                                        <option value="analyst">Claims Analyst</option>
                                        <option value="manager">Claims Manager</option>
                                    </select>
                                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
                                </div>
                            </div>
                        </section>

                        <section className="settings-card">
                            <h2 className="settings-card-title">Regional Settings</h2>
                            <p className="settings-card-subtitle">Configure timezone and regional preferences</p>

                            <div className="space-y-2">
                                <label className="settings-label">Timezone</label>
                                <div className="settings-input-container">
                                    <Clock className="settings-input-icon" />
                                    <select className="settings-input settings-input-with-icon appearance-none">
                                        <option value="est">Eastern Time (ET)</option>
                                        <option value="pst">Pacific Time (PT)</option>
                                    </select>
                                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
                                </div>
                            </div>

                            <div className="mt-6 space-y-2">
                                <label className="settings-label">Date Format</label>
                                <div className="settings-input-container">
                                    <select className="settings-input appearance-none">
                                        <option value="mdy">MM/DD/YYYY</option>
                                        <option value="dmy">DD/MM/YYYY</option>
                                    </select>
                                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
                                </div>
                            </div>
                        </section>
                    </div>
                )}

                {activeTab === 'notifications' && (
                    <div className="animate-in slide-in-from-right-4 space-y-6">
                        <section className="settings-card">
                             <h2 className="settings-card-title">Notification Preferences</h2>
                            {/*<p className="settings-card-subtitle">Choose how you want to receive notifications</p>

                            <div className="space-y-6">
                                <div className="settings-switch-container">
                                    <div>
                                        <p className="settings-label mb-0">Claim Status Updates</p>
                                        <p className="text-xs text-slate-500">Receive emails when claim status changes</p>
                                    </div>
                                    <div className={`settings-switch ${notifs.statusUpdates ? 'active' : ''}`} onClick={() => toggleNotif('statusUpdates')} />
                                </div>
                                <div className="settings-switch-container pt-6 border-t border-slate-50">
                                    <div>
                                        <p className="settings-label mb-0">Validation Risk Alerts</p>
                                        <p className="text-xs text-slate-500">Get notified of high-risk validation failures</p>
                                    </div>
                                    <div className={`settings-switch ${notifs.riskAlerts ? 'active' : ''}`} onClick={() => toggleNotif('riskAlerts')} />
                                </div>
                                <div className="settings-switch-container pt-6 border-t border-slate-50">
                                    <div>
                                        <p className="settings-label mb-0">Daily Analytics Digest</p>
                                        <p className="text-xs text-slate-500">Summary of team performance and volumes</p>
                                    </div>
                                    <div className={`settings-switch ${notifs.dailyDigest ? 'active' : ''}`} onClick={() => toggleNotif('dailyDigest')} />
                                </div>
                            </div> */}
                        </section>
                    </div>
                )}

                {activeTab === 'validation' && (
                    <div className="animate-in slide-in-from-right-4">
                        <section className="settings-card">
                            <h2 className="settings-card-title">Validation Rules</h2>
                            {/* <p className="settings-card-subtitle">Configure automatic claim validation parameters</p>
                            <div className="p-10 text-center border-2 border-dashed border-slate-100 rounded-xl">
                                <FileCheck className="mx-auto text-slate-200 mb-4" size={48} />
                                <p className="text-slate-400 font-medium">Fine-tuning of extraction rules is managed by Admins.</p>
                            </div> */}
                        </section>
                    </div>
                )}

                {activeTab === 'security' && (
                    <div className="animate-in slide-in-from-right-4 space-y-6">
                        <section className="settings-card">
                            <h2 className="settings-card-title">Password & Authentication</h2>
                            {/* <p className="settings-card-subtitle">Manage your password and security settings</p>

                            <div className="space-y-4 max-w-2xl">
                                <div className="space-y-2">
                                    <label className="settings-label">Current Password</label>
                                    <div className="settings-input-container">
                                        <Lock className="settings-input-icon" />
                                        <input type="password" placeholder="••••••••" className="settings-input settings-input-with-icon" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="settings-label">New Password</label>
                                    <div className="settings-input-container">
                                        <Lock className="settings-input-icon" />
                                        <input type="password" placeholder="••••••••" className="settings-input settings-input-with-icon" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="settings-label">Confirm New Password</label>
                                    <div className="settings-input-container">
                                        <Lock className="settings-input-icon" />
                                        <input type="password" placeholder="••••••••" className="settings-input settings-input-with-icon" />
                                    </div>
                                </div>
                                <button className="settings-btn-secondary mt-2">Change Password</button>
                            </div> */}
                        </section>

                        <section className="settings-card">
                             <h2 className="settings-card-title">Two-Factor Authentication</h2>
                           {/* <p className="settings-card-subtitle">Add an extra layer of security to your account</p>
                            <div className="settings-switch-container">
                                <div>
                                    <p className="settings-label mb-0">Enable 2FA</p>
                                    <p className="text-xs text-slate-500">Require a verification code when signing in</p>
                                </div>
                                <div className="settings-switch" />
                            </div> */}
                        </section>

                        <section className="settings-card">
                            <h2 className="settings-card-title">Session Management</h2>
                            {/* <p className="settings-card-subtitle">Manage your active sessions</p>
                            <div className="session-item">
                                <div className="session-info">
                                    <p className="text-sm font-semibold text-slate-900">Current Session</p>
                                    <p className="text-xs text-slate-500">Windows • Chrome • Last active: Now</p>
                                </div>
                                <span className="active-badge">Active</span>
                            </div>
                            <button className="settings-btn-secondary mt-6 border-red-200 text-red-600 hover:bg-red-50">Sign Out All Other Sessions</button> */}
                        </section>
                    </div>
                )}
            </div>

            {/* Footer / Actions */}
            <div className="settings-footer fixed bottom-0 left-[260px] right-0 bg-white/80 backdrop-blur-sm p-6 border-t border-slate-200 z-10">
                <button
                    onClick={handleSave}
                    className="settings-btn-primary"
                    disabled={isSaving}
                >
                    {isSaving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                    Save Changes
                </button>
            </div>
        </div>
    );
};

export default Settings;
