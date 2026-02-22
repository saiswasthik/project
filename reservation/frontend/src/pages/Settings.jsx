import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Save, RotateCcw, Info, ChevronDown, HelpCircle } from 'lucide-react';
import { useToast } from '../context/ToastContext';
import { useData } from '../context/DataContext';
import './Settings.css';

const TimePicker = ({ value, onChange, label }) => {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = React.useRef(null);

    // Parse current value
    const [time, period] = value.split(' ');
    const [hour, minute] = time.split(':');

    const hours = Array.from({ length: 12 }, (_, i) => (i + 1).toString().padStart(2, '0'));
    const minutes = Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, '0'));
    const periods = ['AM', 'PM'];

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSelect = (h, m, p) => {
        onChange(`${h}:${m} ${p}`);
    };

    return (
        <div className="time-picker-container-v3" ref={containerRef}>
            <div className="input-with-icon-v3 cursor-pointer" onClick={() => setIsOpen(!isOpen)}>
                <input
                    type="text"
                    value={value}
                    readOnly
                    placeholder="12:00 PM"
                    className="cursor-pointer"
                />
                <Clock size={16} className="icon-right" />
            </div>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 5 }}
                        className="time-picker-dropdown-v3"
                    >
                        <div className="tp-header-v3">
                            <div className="tp-col-header active">{hour}</div>
                            <div className="tp-col-header active">{minute}</div>
                            <div className="tp-col-header active">{period}</div>
                        </div>
                        <div className="tp-columns-v3">
                            <div className="tp-column-v3">
                                {hours.map(h => (
                                    <div
                                        key={h}
                                        className={`tp-item-v3 ${h === hour ? 'selected' : ''}`}
                                        onClick={() => handleSelect(h, minute, period)}
                                    >
                                        {h}
                                    </div>
                                ))}
                            </div>
                            <div className="tp-column-v3">
                                {minutes.map(m => (
                                    <div
                                        key={m}
                                        className={`tp-item-v3 ${m === minute ? 'selected' : ''}`}
                                        onClick={() => handleSelect(hour, m, period)}
                                    >
                                        {m}
                                    </div>
                                ))}
                            </div>
                            <div className="tp-column-v3">
                                {periods.map(p => (
                                    <div
                                        key={p}
                                        className={`tp-item-v3 ${p === period ? 'selected' : ''}`}
                                        onClick={() => handleSelect(hour, minute, p)}
                                    >
                                        {p}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

const Settings = () => {
    const { settings, updateSettings } = useData();
    const { showToast } = useToast();

    const [formData, setFormData] = useState(settings);
    const [showPreview, setShowPreview] = useState(false);

    // Filter out potential NaN or empty strings for calculation
    const turnaround = parseInt(formData.turnaroundTime) || 0;
    const buffer = parseInt(formData.bufferTime) || 0;
    const totalBlocked = turnaround + buffer;

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        setShowPreview(true);
    };

    const handleSelectChange = (name, value) => {
        setFormData(prev => ({ ...prev, [name]: value }));
        setShowPreview(true);
    };

    const handleTimeChange = (name, value) => {
        setFormData(prev => ({ ...prev, [name]: value }));
        setShowPreview(true);
    };

    const handleSave = async () => {
        const success = await updateSettings(formData);
        if (success) {
            showToast('Settings saved successfully', 'success');
            setShowPreview(false);
        } else {
            showToast('Failed to save settings', 'error');
        }
    };

    const handleReset = () => {
        setFormData(settings);
        setShowPreview(false);
        showToast('Settings reset to last saved state', 'info');
    };

    const previewSlots = useMemo(() => {
        const slots = [];
        const interval = parseInt(formData.interval) || 30;

        const toMinutes = (timeStr) => {
            if (!timeStr) return 720;
            const isPM = timeStr.toLowerCase().includes('pm');
            const isAM = timeStr.toLowerCase().includes('am');
            let [h, m] = timeStr.replace(/[a-zA-Z]/g, '').trim().split(':').map(Number);
            if (isPM && h !== 12) h += 12;
            if (isAM && h === 12) h = 0;
            return h * 60 + (m || 0);
        };

        const fromMinutes = (mins) => {
            let h = Math.floor(mins / 60);
            const m = mins % 60;
            const p = h >= 12 ? 'PM' : 'AM';
            h = h % 12;
            if (h === 0) h = 12;
            return `${h}:${m.toString().padStart(2, '0')} ${p}`;
        };

        const start = toMinutes(formData.startTime);
        // Just show a few slots for preview
        for (let t = start, count = 0; count < 8; t += interval, count++) {
            slots.push(fromMinutes(t));
        }
        return slots;
    }, [formData.interval, formData.startTime]);

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="settings-page"
        >
            <div className="settings-header-minimal">
                <h1>Settings</h1>
                <p className="subtitle">Configure reservation and availability settings</p>
            </div>

            <div className="settings-cards-stack">
                <div className="card settings-card-v3">
                    <div className="card-header-v3">
                        <Clock size={20} />
                        <h3>Operating Hours</h3>
                    </div>
                    <p className="card-subtitle-v3">Define when your restaurant accepts reservations</p>

                    <div className="settings-grid-v3">
                        <div className="input-group-v3">
                            <label>Shift Start Time</label>
                            <TimePicker
                                value={formData.startTime}
                                onChange={(val) => handleTimeChange('startTime', val)}
                            />
                        </div>
                        <div className="input-group-v3">
                            <label>Shift End Time</label>
                            <TimePicker
                                value={formData.endTime}
                                onChange={(val) => handleTimeChange('endTime', val)}
                            />
                        </div>
                    </div>

                    <div className="input-group-v3 full-width">
                        <label>Time Slot Interval <HelpCircle size={14} className="label-help" /></label>
                        <div className="custom-dropdown-v3">
                            <select
                                value={formData.interval}
                                onChange={(e) => handleSelectChange('interval', e.target.value)}
                            >
                                <option value="15">15 minutes</option>
                                <option value="30">30 minutes</option>
                                <option value="45">45 minutes</option>
                                <option value="60">60 minutes</option>
                            </select>
                            <ChevronDown size={16} className="dropdown-arrow" />
                        </div>
                    </div>
                </div>

                <div className="card settings-card-v3">
                    <div className="card-header-v3">
                        <Clock size={20} />
                        <h3>Table Timing</h3>
                    </div>
                    <p className="card-subtitle-v3">Control how long tables are blocked for reservations</p>

                    <div className="input-group-v3 full-width">
                        <label>Turnaround Time (minutes) <HelpCircle size={14} className="label-help" /></label>
                        <input
                            type="number"
                            name="turnaroundTime"
                            className="orange-focus-input"
                            value={formData.turnaroundTime}
                            onChange={handleInputChange}
                        />
                        <p className="field-note-v3">Recommended: 60-120 minutes depending on dining style</p>
                    </div>

                    <div className="input-group-v3 full-width mt-1rem">
                        <label>Buffer Time (minutes) <HelpCircle size={14} className="label-help" /></label>
                        <input
                            type="number"
                            name="bufferTime"
                            value={formData.bufferTime}
                            onChange={handleInputChange}
                        />
                        <p className="field-note-v3">Optional: 0-15 minutes for table reset between guests</p>
                    </div>

                    <div className="calc-info-box-v3">
                        <h4>How availability is calculated</h4>
                        <p>When a reservation is made at a given time, the table becomes unavailable for:</p>
                        <div className="calc-formula-v3">
                            <code>{turnaround} + {buffer} = {totalBlocked} minutes</code>
                        </div>
                    </div>
                </div>

                <AnimatePresence>
                    {showPreview && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 20 }}
                            className="card settings-card-v3 preview-card-v3"
                        >
                            <h3>Preview</h3>
                            <p className="preview-desc-v3">
                                With current settings, today would have 20 available time slots for a party of 2.
                            </p>

                            <div className="preview-slots-grid-v3">
                                {previewSlots.map(slot => (
                                    <div key={slot} className="preview-slot-pill-v3">{slot}</div>
                                ))}
                                <span className="more-text-v3">+8 more</span>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <div className="settings-actions-footer-v3">
                <button className="btn-save-settings-v3" onClick={handleSave}>
                    <Save size={18} />
                    <span>Save Settings</span>
                </button>
                <button className="btn-reset-settings-v3" onClick={handleReset}>
                    <RotateCcw size={18} />
                    <span>Reset</span>
                </button>
            </div>
        </motion.div>
    );
};

export default Settings;
