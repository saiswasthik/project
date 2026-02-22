import React, { useState, useMemo, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Calendar as CalendarIcon, Phone, Eye, MoreHorizontal, X } from 'lucide-react';
import Modal from '../components/Modal';
import ReservationDetail from '../components/ReservationDetail';
import RestaurantLoader from '../components/RestaurantLoader';
import { useToast } from '../context/ToastContext';
import { useData } from '../context/DataContext';
import './Reservations.css';

const Reservations = () => {
    const { reservations, updateReservation } = useData();
    const { showToast } = useToast();

    const [searchQuery, setSearchQuery] = useState('');
    const [activeTab, setActiveTab] = useState('All');
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [selectedReservation, setSelectedReservation] = useState(null);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [openMenuId, setOpenMenuId] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const menuRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setOpenMenuId(null);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Premium Loading Effect for tab/date changes
    useEffect(() => {
        setIsLoading(true);
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 1500); // 1.5s for a smooth but snappy feel
        return () => clearTimeout(timer);
    }, [activeTab, selectedDate]);

    const handleViewDetail = (res) => {
        setOpenMenuId(null);
        setSelectedReservation(res);
        setIsDetailModalOpen(true);
    };

    const handleSaveDetail = async (updatedData) => {
        const success = await updateReservation(selectedReservation.id, updatedData);
        if (success) {
            setIsDetailModalOpen(false);
            showToast('Reservation updated successfully', 'success');
        } else {
            showToast('Failed to update reservation', 'error');
        }
    };

    const handleAction = async (id, action, newStatus) => {
        const success = await updateReservation(id, { status: newStatus });
        if (success) {
            setOpenMenuId(null);
            showToast(`Reservation ${action} successfully`, 'success');
        } else {
            showToast(`Failed to ${action} reservation`, 'error');
        }
    };

    const tabs = ['All', 'Confirmed', 'Cancelled', 'No-show', 'Completed'];

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.05
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, x: -10 },
        visible: { opacity: 1, x: 0 },
        exit: { opacity: 0, scale: 0.98, transition: { duration: 0.2 } }
    };

    const filteredReservations = useMemo(() => {
        return reservations.filter(res => {
            const matchesSearch = res.guest.toLowerCase().includes(searchQuery.toLowerCase()) ||
                res.phone.includes(searchQuery);
            const matchesTab = activeTab === 'All' || res.status === activeTab;
            const matchesDate = res.date === selectedDate;
            return matchesSearch && matchesTab && matchesDate;
        });
    }, [reservations, searchQuery, activeTab, selectedDate]);

    const displayDate = useMemo(() => {
        const date = new Date(selectedDate);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    }, [selectedDate]);

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="reservations-page"
        >
            <div className="reservations-top-header">
                <div className="title-section">
                    <h1>Reservations</h1>
                    <p className="subtitle">{displayDate}</p>
                </div>
                <div className="header-actions">
                    <div className="search-bar">
                        <Search className="search-icon" size={18} />
                        <input
                            type="text"
                            placeholder="Search name or phone..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <div className="dashboard-date-shortcuts">
                        <button
                            className={`dashboard-date-pill ${selectedDate === new Date().toISOString().split('T')[0] ? 'active' : ''}`}
                            onClick={() => setSelectedDate(new Date().toISOString().split('T')[0])}
                        >Today</button>
                        <button
                            className={`dashboard-date-pill ${selectedDate === new Date(Date.now() + 86400000).toISOString().split('T')[0] ? 'active' : ''}`}
                            onClick={() => setSelectedDate(new Date(Date.now() + 86400000).toISOString().split('T')[0])}
                        >Tomorrow</button>
                    </div>
                    <div className="date-picker-trigger">
                        <CalendarIcon size={16} />
                        <input
                            type="date"
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            <div className="tabs-container">
                <div className="tabs-list-pill">
                    {tabs.map(tab => (
                        <button
                            key={tab}
                            className={`tab-pill ${activeTab === tab ? 'active' : ''}`}
                            onClick={() => setActiveTab(tab)}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
            </div>

            <div className="card reservations-card">
                <div className="list-title-header">
                    <div className="title-with-icon">
                        <CalendarIcon size={20} />
                        <h2>{activeTab === 'All' ? 'All' : activeTab} Reservations</h2>
                        <span className="count-badge">{filteredReservations.length}</span>
                    </div>
                </div>

                <div className="reservation-table-wrapper">
                    {isLoading ? (
                        <div className="dashboard-loader-container">
                            <RestaurantLoader message="Garnishing your list..." />
                        </div>
                    ) : (
                        <table className="reservation-table-v2">
                            <thead>
                                <tr>
                                    <th>Time</th>
                                    <th>Guest</th>
                                    <th className="text-center">Party</th>
                                    <th className="text-center">Source</th>
                                    <th className="text-center">Status</th>
                                    <th className="text-center">Table</th>
                                    <th className="text-right">Actions</th>
                                </tr>
                            </thead>
                            <motion.tbody
                                variants={containerVariants}
                                initial="hidden"
                                animate="visible"
                                key={activeTab + selectedDate}
                            >
                                <AnimatePresence mode="popLayout">
                                    {filteredReservations.map((res) => (
                                        <motion.tr
                                            key={res.id}
                                            variants={itemVariants}
                                            layout
                                            whileHover={{ backgroundColor: 'rgba(249, 115, 22, 0.06)', x: 4 }}
                                            className="reservation-row-v5"
                                        >
                                            <td className="time-cell">{res.time}</td>
                                            <td>
                                                <div className="guest-info">
                                                    <span className="guest-name">{res.guest}</span>
                                                    <span className="guest-phone">{res.phone}</span>
                                                </div>
                                            </td>
                                            <td className="text-center">{res.party}</td>
                                            <td className="text-center">
                                                <div className="source-badge">
                                                    <Phone size={12} />
                                                    <span>{res.source}</span>
                                                </div>
                                            </td>
                                            <td className="text-center">
                                                <span className={`status-badge-v2 badge-${res.status.toLowerCase().replace(' ', '-')}`}>
                                                    {res.status}
                                                </span>
                                            </td>
                                            <td className="text-center">{res.table || '—'}</td>
                                            <td className="text-right">
                                                <div className="actions-cell">
                                                    <button
                                                        className="btn-text-view"
                                                        onClick={() => handleViewDetail(res)}
                                                    >
                                                        <Eye size={16} />
                                                        <span>View</span>
                                                    </button>
                                                    <div className="more-menu-container">
                                                        <button
                                                            className={`btn-icon-more ${openMenuId === res.id ? 'active' : ''}`}
                                                            onClick={() => setOpenMenuId(openMenuId === res.id ? null : res.id)}
                                                        >
                                                            <MoreHorizontal size={18} />
                                                        </button>

                                                        <AnimatePresence>
                                                            {openMenuId === res.id && (
                                                                <motion.div
                                                                    ref={menuRef}
                                                                    initial={{ opacity: 0, scale: 0.95, y: 10 }}
                                                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                                                    exit={{ opacity: 0, scale: 0.95, y: 10 }}
                                                                    className="action-dropdown-menu"
                                                                >
                                                                    <button className="menu-item delete" onClick={() => handleAction(res.id, 'cancelled', 'Cancelled')}>
                                                                        <X size={14} />
                                                                        <span>Cancel Reservation</span>
                                                                    </button>
                                                                    <button className="menu-item" onClick={() => handleAction(res.id, 'marked as no-show', 'No-show')}>
                                                                        <span>Mark as No-Show</span>
                                                                    </button>
                                                                    <button className="menu-item" onClick={() => handleAction(res.id, 'marked as completed', 'Completed')}>
                                                                        <span>Mark as Completed</span>
                                                                    </button>
                                                                </motion.div>
                                                            )}
                                                        </AnimatePresence>
                                                    </div>
                                                </div>
                                            </td>
                                        </motion.tr>
                                    ))}
                                </AnimatePresence>
                            </motion.tbody>
                        </table>
                    )}
                </div>
            </div>

            <Modal
                isOpen={isDetailModalOpen}
                onClose={() => setIsDetailModalOpen(false)}
                contentClassName="no-padding"
            >
                {selectedReservation && (
                    <ReservationDetail
                        reservation={selectedReservation}
                        onSave={handleSaveDetail}
                        onClose={() => setIsDetailModalOpen(false)}
                    />
                )}
            </Modal>
        </motion.div>
    );
};

export default Reservations;
