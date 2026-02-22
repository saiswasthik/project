import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Grid, Users, Plus, Edit2, Trash2, Tag, MapPin } from 'lucide-react';
import Modal from '../components/Modal';
import { useToast } from '../context/ToastContext';
import { useData } from '../context/DataContext';
import './Tables.css';

const Tables = () => {
    const { tables, addTable, updateTable, deleteTable } = useData();
    const { showToast } = useToast();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editTable, setEditTable] = useState(null);
    const [formData, setFormData] = useState({
        label: '',
        capacity: '2',
        area: '',
        active: true
    });

    const stats = [
        { label: 'Total Tables', value: tables.length, icon: Grid, color: '#f9fafb', iconColor: '#111827' },
        { label: 'Active', value: tables.filter(t => t.active).length, icon: Grid, color: '#f0fdf4', iconColor: '#22c55e' },
        { label: 'Total Capacity', value: tables.filter(t => t.active).reduce((acc, t) => acc + t.capacity, 0), icon: Users, color: '#fffaf5', iconColor: '#f97316' },
    ];

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

    const handleAddTable = () => {
        setEditTable(null);
        setFormData({ label: '', capacity: '2', area: '', active: true });
        setIsModalOpen(true);
    };

    const handleEdit = (table) => {
        setEditTable(table);
        setFormData({
            label: table.label,
            capacity: String(table.capacity),
            area: table.area === '—' ? '' : table.area,
            active: table.active
        });
        setIsModalOpen(true);
    };

    const handleDeleteClick = async (id) => {
        if (window.confirm('Are you sure you want to delete this table?')) {
            const success = await deleteTable(id);
            if (success) {
                showToast('Table deleted successfully', 'success');
            } else {
                showToast('Failed to delete table', 'error');
            }
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        const tableData = {
            label: formData.label,
            capacity: parseInt(formData.capacity),
            area: formData.area || '—',
            active: formData.active
        };

        let success = false;
        if (editTable) {
            success = await updateTable(editTable.id, tableData);
            if (success) {
                showToast('Table updated successfully', 'success');
                setIsModalOpen(false);
            } else {
                showToast('Failed to update table', 'error');
            }
        } else {
            success = await addTable(tableData);
            if (success) {
                showToast('New table added successfully', 'success');
                setIsModalOpen(false);
            } else {
                showToast('Failed to add table', 'error');
            }
        }
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="tables-page"
        >
            <header className="page-header">
                <div className="title-section">
                    <h1>Tables</h1>
                    <p className="subtitle">Manage your restaurant's seating capacity</p>
                </div>
                <button
                    className="btn btn-primary add-table-btn"
                    onClick={handleAddTable}
                >
                    <Plus size={18} />
                    <span>Add Table</span>
                </button>
            </header>

            <div className="stats-grid">
                {stats.map((stat, i) => (
                    <div key={i} className="card stat-card">
                        <div className="stat-icon-wrapper" style={{ backgroundColor: stat.color }}>
                            <stat.icon size={20} style={{ color: stat.iconColor }} />
                        </div>
                        <div className="stat-content">
                            <span className="stat-value">{stat.value}</span>
                            <span className="stat-label">{stat.label}</span>
                        </div>
                    </div>
                ))}
            </div>

            <div className="card table-list-container">
                <div className="table-header-v5">
                    <div className="header-text-group">
                        <h2>All Tables</h2>
                        <span className="count-badge-v5">{tables.length} Total</span>
                    </div>
                    <p className="subtitle">Inactive tables won't appear in availability calculations</p>
                </div>
                <table className="table">
                    <thead>
                        <tr>
                            <th>Label</th>
                            <th>Capacity</th>
                            <th>Area</th>
                            <th>Active</th>
                            <th className="text-right">Actions</th>
                        </tr>
                    </thead>
                    <motion.tbody
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        <AnimatePresence mode="popLayout">
                            {tables.map((table) => (
                                <motion.tr
                                    key={table.id}
                                    variants={itemVariants}
                                    layout
                                    whileHover={{ backgroundColor: 'rgba(249, 115, 22, 0.06)', x: 4 }}
                                >
                                    <td className="table-label-cell">
                                        <span className="label-bar">|</span> {table.label}
                                    </td>
                                    <td>
                                        <div className="capacity-info">
                                            <Users size={14} />
                                            <span>{table.capacity}</span>
                                        </div>
                                    </td>
                                    <td>{table.area}</td>
                                    <td>
                                        <label className="toggle-switch">
                                            <input
                                                type="checkbox"
                                                checked={table.active}
                                                onChange={() => {
                                                    updateTable(table.id, { active: !table.active });
                                                }}
                                            />
                                            <span className="slider"></span>
                                        </label>
                                    </td>
                                    <td className="text-right">
                                        <div className="action-btns end-aligned">
                                            <button className="action-icon-btn" onClick={() => handleEdit(table)}>
                                                <Edit2 size={16} />
                                            </button>
                                            <button className="action-icon-btn delete" onClick={() => handleDeleteClick(table.id)}>
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </motion.tr>
                            ))}
                        </AnimatePresence>
                    </motion.tbody>
                </table>
            </div>

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={{
                    main: editTable ? "Edit Table" : "Add New Table",
                    sub: editTable ? "Update the table details below." : "Configure your new table."
                }}
                footer={
                    <>
                        <button className="btn btn-outline" onClick={() => setIsModalOpen(false)}>Cancel</button>
                        <button className="btn btn-primary" onClick={handleSave}>
                            {editTable ? "Save Changes" : "Add Table"}
                        </button>
                    </>
                }
            >
                <form className="add-table-form-v5" id="add-table-form" onSubmit={handleSave}>
                    <div className="form-section-v5">
                        <div className="input-group-v5">
                            <label>Table Label *</label>
                            <div className="input-with-icon-v5">
                                <Tag size={16} className="field-icon-v5" />
                                <input
                                    type="text"
                                    name="label"
                                    className="input-field-v5"
                                    placeholder="e.g., T7, Booth 1, Patio 2"
                                    value={formData.label}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-row-v5">
                            <div className="input-group-v5">
                                <label>Capacity (Seats) *</label>
                                <div className="input-with-icon-v5">
                                    <Users size={16} className="field-icon-v5" />
                                    <input
                                        type="number"
                                        name="capacity"
                                        min="1"
                                        className="input-field-v5"
                                        value={formData.capacity}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="input-group-v5">
                                <label>Area / Zone</label>
                                <div className="input-with-icon-v5">
                                    <MapPin size={16} className="field-icon-v5" />
                                    <input
                                        type="text"
                                        name="area"
                                        className="input-field-v5"
                                        placeholder="e.g., Patio"
                                        value={formData.area}
                                        onChange={handleInputChange}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="status-toggle-row-v5">
                            <div className="toggle-info-v5">
                                <span className="toggle-label-v5">Table Active Status</span>
                                <span className="toggle-desc-v5">Toggle visibility in reservation systems</span>
                            </div>
                            <label className="toggle-switch">
                                <input
                                    type="checkbox"
                                    name="active"
                                    checked={formData.active}
                                    onChange={handleInputChange}
                                />
                                <span className="slider"></span>
                            </label>
                        </div>
                    </div>
                </form>
            </Modal>
        </motion.div>
    );
};

export default Tables;
