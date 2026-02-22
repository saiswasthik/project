import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, User, Phone, Mail, Users, Calendar, Clock, Table, MessageSquare, CheckCircle, Tag } from 'lucide-react';
import CustomSelect from './CustomSelect';
import { useData } from '../context/DataContext';
import './ReservationDetail.css';

const ReservationDetail = ({ reservation, onClose, onSave }) => {
    const { tables } = useData();
    const [status, setStatus] = useState(reservation.status);
    const [guest, setGuest] = useState(reservation.guest);
    const [phone, setPhone] = useState(reservation.phone);
    const [email, setEmail] = useState(reservation.email || '');
    const [party, setParty] = useState(reservation.party.toString());
    const [table, setTable] = useState(reservation.table);
    const [date, setDate] = useState(reservation.date);
    const [time, setTime] = useState(reservation.time);
    const [notes, setNotes] = useState(reservation.notes || '');

    const tableOptions = tables.filter(t => t.active).map(t => ({
        value: t.label,
        label: `${t.label} (seats ${t.capacity})`
    }));

    const statusOptions = [
        { value: 'Confirmed', label: 'Confirmed' },
        { value: 'Pending', label: 'Pending' },
        { value: 'Completed', label: 'Completed' },
        { value: 'Cancelled', label: 'Cancelled' },
        { value: 'No Show', label: 'No Show' }
    ];

    const handleSave = () => {
        onSave({
            guest,
            phone,
            email,
            party: parseInt(party),
            status,
            table,
            date,
            time,
            notes
        });
    };

    return (
        <div className="res-detail-v5">
            <header className="detail-header-v5">
                <div className="header-top-v5">
                    <h2>{guest}'s Reservation</h2>
                    <div className="header-badges-v5">
                        <span className={`status-badge-v5 badge-${status.toLowerCase().replace(' ', '-')}`}>
                            {status}
                        </span>
                        <span className="source-badge-v5">
                            <Tag size={12} />
                            {reservation.source || 'Phone'}
                        </span>
                    </div>
                </div>
                <button className="absolute-close-v5" onClick={onClose}>
                    <X size={20} />
                </button>
            </header>

            <div className="detail-body-v5">
                <section className="detail-section-v5">
                    <h3 className="section-title-v5">GUEST INFORMATION</h3>
                    <div className="detail-row-v5">
                        <div className="input-group-v5">
                            <label>Name</label>
                            <div className="input-wrapper-v5">
                                <input type="text" value={guest} onChange={(e) => setGuest(e.target.value)} />
                            </div>
                        </div>
                        <div className="input-group-v5">
                            <label>Phone</label>
                            <div className="input-with-icon-v5">
                                <Phone size={14} />
                                <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} />
                            </div>
                        </div>
                    </div>
                    <div className="input-group-v5">
                        <label>Email</label>
                        <div className="input-with-icon-v5">
                            <Mail size={14} />
                            <input type="text" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="—" />
                        </div>
                    </div>
                </section>

                <section className="detail-section-v5">
                    <h3 className="section-title-v5">RESERVATION DETAILS</h3>
                    <div className="detail-row-v5">
                        <div className="input-group-v5">
                            <label>Guest Size</label>
                            <CustomSelect
                                icon={Users}
                                options={[
                                    { value: '1', label: '1 Guest' },
                                    { value: '2', label: '2 Guests' },
                                    { value: '4', label: '4 Guests' },
                                    { value: '6', label: '6 Guests' },
                                    { value: '8', label: '8+ Guests' }
                                ]}
                                value={party}
                                onChange={setParty}
                            />
                        </div>
                        <div className="input-group-v5">
                            <label>Date</label>
                            <div className="input-with-icon-v5">
                                <Calendar size={14} />
                                <input type="text" value={date} onChange={(e) => setDate(e.target.value)} />
                            </div>
                        </div>
                    </div>
                    <div className="detail-row-v5">
                        <div className="input-group-v5">
                            <label>Time Slot</label>
                            <div className="input-with-icon-v5">
                                <Clock size={14} />
                                <input type="text" value={time} onChange={(e) => setTime(e.target.value)} />
                            </div>
                        </div>
                        <div className="input-group-v5">
                            <label>Table Selection</label>
                            <CustomSelect
                                icon={Table}
                                options={tableOptions}
                                value={table}
                                onChange={setTable}
                            />
                        </div>
                    </div>

                    <div className="input-group-v5">
                        <label>Status</label>
                        <CustomSelect
                            options={statusOptions}
                            value={status}
                            onChange={setStatus}
                        />
                    </div>

                    <div className="input-group-v5">
                        <label>Notes</label>
                        <textarea
                            className="textarea-v5"
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            placeholder="Add notes..."
                        />
                    </div>
                </section>
            </div>

            <footer className="detail-footer-v5">
                <button className="btn-save-v5" onClick={handleSave}>
                    <CheckCircle size={18} />
                    <span>Save Changes</span>
                </button>
            </footer>
        </div>
    );
};

export default ReservationDetail;
