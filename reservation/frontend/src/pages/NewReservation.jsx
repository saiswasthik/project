import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, User, Mail, Calendar, Users, MessageSquare, CheckCircle, Lock } from 'lucide-react';
import CustomSelect from '../components/CustomSelect';
import RestaurantLoader from '../components/RestaurantLoader';
import { useToast } from '../context/ToastContext';
import { useData } from '../context/DataContext';
import './NewReservation.css';

const NewReservation = () => {
    const { addReservation, tables: availableTables, settings, reservations, getAvailableSlots } = useData();
    const { showToast } = useToast();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        guest: '',
        phone: '',
        email: '',
        party: '2',
        date: new Date().toISOString().split('T')[0],
        notes: ''
    });
    const [selectedTable, setSelectedTable] = useState(null);
    const [selectedTime, setSelectedTime] = useState(null);
    const [backendAvailableSlots, setBackendAvailableSlots] = useState([]);
    const [isLoadingSlots, setIsLoadingSlots] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const formatDate = (dateStr) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };

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

    useEffect(() => {
        const fetchSlots = async () => {
            if (selectedTable && formData.date) {
                setIsLoadingSlots(true);

                // Ensure animation shows for at least 2 seconds for a premium feel
                const [slots] = await Promise.all([
                    getAvailableSlots(selectedTable, formData.date),
                    new Promise(resolve => setTimeout(resolve, 1500))
                ]);

                setBackendAvailableSlots(slots);
                setIsLoadingSlots(false);
                setSelectedTime(null); // Reset selection when slots change
            }
        };
        fetchSlots();
    }, [selectedTable, formData.date, getAvailableSlots]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;

        if (name === 'phone') {
            // Smart Phone Formatting: (XXX) XXX-XXXX
            const cleaned = value.replace(/\D/g, '').substring(0, 10);
            let formatted = '';
            if (cleaned.length > 0) {
                formatted = cleaned.length <= 3
                    ? `(${cleaned}`
                    : cleaned.length <= 6
                        ? `(${cleaned.substring(0, 3)}) ${cleaned.substring(3)}`
                        : `(${cleaned.substring(0, 3)}) ${cleaned.substring(3, 6)}-${cleaned.substring(6)}`;
            }
            setFormData(prev => ({ ...prev, [name]: formatted }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const setQuickDate = (days) => {
        const d = new Date();
        d.setDate(d.getDate() + days);
        setFormData(prev => ({ ...prev, date: d.toISOString().split('T')[0] }));
    };

    const allPossibleSlots = useMemo(() => {
        if (!settings) return [];
        const start = toMinutes(settings.startTime);
        const end = toMinutes(settings.endTime);
        const interval = parseInt(settings.interval) || 30;

        const slots = [];
        let current = start;
        while (current <= end) {
            slots.push(fromMinutes(current));
            current += interval;
        }
        return slots;
    }, [settings]);

    const handleCreate = async (status = 'Confirmed') => {
        if (!formData.guest || !formData.phone || !selectedTable || !selectedTime) {
            showToast('Please fill in all required fields', 'error');
            return;
        }

        setIsSubmitting(true);
        const selectedTableObj = availableTables.find(t => t.label === selectedTable);
        const newRes = {
            ...formData,
            table: selectedTable,
            tableId: selectedTableObj?.id,
            time: selectedTime,
            status: status,
            party: parseInt(formData.party)
        };

        // Ensure the premium loader is visible for at least 2 seconds
        const [success] = await Promise.all([
            addReservation(newRes),
            new Promise(resolve => setTimeout(resolve, 2000))
        ]);

        if (success) {
            showToast(`Reservation created successfully as ${status}!`, 'success');
            navigate('/reservations');
        } else {
            showToast('Failed to create reservation. Please check availability.', 'error');
            setIsSubmitting(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="new-reservation-page"
        >
            <div className="card form-card">
                <header className="form-header">
                    <div className="header-icon-wrapper">
                        <Phone size={20} className="header-icon" />
                    </div>
                    <div>
                        <h2>New Phone Reservation</h2>
                        <p className="subtitle">Create a new reservation for a phone booking</p>
                    </div>
                </header>

                <form className="reservation-form" onSubmit={(e) => e.preventDefault()}>
                    {isSubmitting ? (
                        <div style={{ padding: '60px 0' }}>
                            <RestaurantLoader message="Securing your reservation..." />
                        </div>
                    ) : (
                        <>
                            <section className="form-section">
                                <h3 className="section-title">GUEST INFORMATION</h3>
                                <div className="form-row">
                                    <div className="input-group">
                                        <label className="input-label">Name *</label>
                                        <div className="input-with-icon">
                                            <input
                                                type="text"
                                                name="guest"
                                                className="input-field"
                                                placeholder="Guest name"
                                                value={formData.guest}
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                    </div>
                                    <div className="input-group">
                                        <label className="input-label">Phone *</label>
                                        <div className="input-with-icon">
                                            <Phone size={16} className="field-icon" />
                                            <input
                                                type="text"
                                                name="phone"
                                                className="input-field icon-padding"
                                                placeholder="(555) 123-4567"
                                                value={formData.phone}
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="input-group">
                                    <label className="input-label">Email (optional)</label>
                                    <div className="input-with-icon">
                                        <Mail size={16} className="field-icon" />
                                        <input
                                            type="email"
                                            name="email"
                                            className="input-field icon-padding"
                                            placeholder="guest@email.com"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                </div>
                            </section>

                            <section className="form-section">
                                <h3 className="section-title">RESERVATION DETAILS</h3>
                                <div className="form-row">
                                    <div className="input-group">
                                        <label className="input-label">Party Size</label>
                                        <CustomSelect
                                            icon={Users}
                                            options={[
                                                { value: '1', label: '1 guest' },
                                                { value: '2', label: '2 guests' },
                                                { value: '4', label: '4 guests' },
                                                { value: '6', label: '6 guests' },
                                                { value: '8', label: '8+ guests' },
                                            ]}
                                            value={formData.party}
                                            onChange={(val) => setFormData(prev => ({ ...prev, party: val }))}
                                        />
                                    </div>
                                    <div className="input-group">
                                        <label className="input-label">Date</label>
                                        <div className="date-picker-wrapper">
                                            <div className="date-shortcuts">
                                                <button
                                                    type="button"
                                                    className={`date-pill ${formData.date === new Date().toISOString().split('T')[0] ? 'active' : ''}`}
                                                    onClick={() => setQuickDate(0)}
                                                >Today</button>
                                                <button
                                                    type="button"
                                                    className={`date-pill ${formData.date === new Date(Date.now() + 86400000).toISOString().split('T')[0] ? 'active' : ''}`}
                                                    onClick={() => setQuickDate(1)}
                                                >Tomorrow</button>
                                            </div>
                                            <div className="input-with-icon">
                                                <Calendar size={16} className="field-icon" style={{ pointerEvents: 'none' }} />
                                                <input
                                                    type="date"
                                                    name="date"
                                                    className="input-field icon-padding"
                                                    value={formData.date}
                                                    onChange={handleInputChange}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="input-group">
                                    <label className="input-label">Select Table *</label>
                                    {availableTables.filter(t => t.active && t.capacity >= parseInt(formData.party)).length > 0 ? (
                                        <div className="table-selector">
                                            {availableTables.filter(t => t.active && t.capacity >= parseInt(formData.party)).map((table) => (
                                                <button
                                                    key={table.id}
                                                    type="button"
                                                    className={`table-option ${selectedTable === table.label ? 'active' : ''}`}
                                                    onClick={() => setSelectedTable(table.label)}
                                                >
                                                    <span className="table-id">{table.label}</span>
                                                    <span className="table-cap">({table.capacity})</span>
                                                </button>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="capacity-warning-alert">
                                            <div className="warning-icon-wrapper">
                                                <Lock size={16} />
                                            </div>
                                            <p>No tables can accommodate {formData.party} guests. Try a smaller party size.</p>
                                        </div>
                                    )}
                                </div>

                                <AnimatePresence>
                                    {selectedTable && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            exit={{ opacity: 0, height: 0 }}
                                            style={{ overflow: 'hidden' }}
                                        >
                                            <div className="input-group">
                                                <label className="input-label">Time Slot *</label>
                                                {isLoadingSlots ? (
                                                    <RestaurantLoader message="Checking table availability..." />
                                                ) : allPossibleSlots.length > 0 ? (
                                                    <div className="time-grid">
                                                        {allPossibleSlots.map((time) => {
                                                            const isAvailable = backendAvailableSlots.includes(time);
                                                            return (
                                                                <button
                                                                    key={time}
                                                                    type="button"
                                                                    disabled={!isAvailable}
                                                                    className={`time-slot ${selectedTime === time ? 'active' : ''} ${!isAvailable ? 'blocked' : ''}`}
                                                                    onClick={() => setSelectedTime(time)}
                                                                >
                                                                    {!isAvailable && <Lock size={12} />}
                                                                    <span>{time}</span>
                                                                </button>
                                                            );
                                                        })}
                                                    </div>
                                                ) : (
                                                    <div className="capacity-warning-alert no-slots">
                                                        <Lock size={16} />
                                                        <p>No available slots for this table on the selected date.</p>
                                                    </div>
                                                )}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                <div className="input-group">
                                    <label className="input-label">Notes (optional)</label>
                                    <div className="input-with-icon">
                                        <MessageSquare size={16} className="field-icon top-align" />
                                        <textarea
                                            name="notes"
                                            className="input-field icon-padding"
                                            rows="3"
                                            placeholder="Special requests, dietary restrictions, occasion..."
                                            value={formData.notes}
                                            onChange={handleInputChange}
                                        ></textarea>
                                    </div>
                                </div>
                            </section>

                            <div className="form-footer">
                                <button
                                    type="button"
                                    className="btn btn-confirm"
                                    onClick={() => handleCreate('Confirmed')}
                                >
                                    <CheckCircle size={18} />
                                    <span>Create Reservation (Confirmed)</span>
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-outline-alt"
                                    onClick={() => handleCreate('Pending')}
                                >
                                    Create as Pending
                                </button>
                            </div>
                        </>
                    )}
                </form>
            </div>
        </motion.div>
    );
};

export default NewReservation;
