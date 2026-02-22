import React, { createContext, useContext, useState, useCallback } from 'react';
import { RESERVATIONS_DATA, TABLES_DATA } from '../constants';
import { useEffect } from 'react';
import { useAuth } from './AuthContext';
import { API_URL } from '../config';


const DataContext = createContext(null);

export const useData = () => {
    const context = useContext(DataContext);
    if (!context) {
        throw new Error('useData must be used within a DataProvider');
    }
    return context;
};

export const DataProvider = ({ children }) => {
    const { user } = useAuth();
    const [reservations, setReservations] = useState([]);
    const [tables, setTables] = useState([]);
    const [settings, setSettings] = useState({
        turnaroundTime: 120,
        bufferTime: 0,
        startTime: '12:00 PM',
        endTime: '11:00 PM',
        interval: '30'
    });


    const parseTimeForBackend = (timeStr) => {
        if (!timeStr) return "12:00";
        const isPM = timeStr.toLowerCase().includes('pm');
        const isAM = timeStr.toLowerCase().includes('am');
        let [h, m] = timeStr.replace(/[a-zA-Z]/g, '').trim().split(':').map(Number);
        if (isPM && h !== 12) h += 12;
        if (isAM && h === 12) h = 0;
        return `${h.toString().padStart(2, '0')}:${(m || 0).toString().padStart(2, '0')}:00`;
    };

    const formatTimeFromBackend = (timeStr) => {
        if (!timeStr) return "12:00 PM";
        try {
            const [h, m] = timeStr.split(':').map(Number);
            const period = h >= 12 ? 'PM' : 'AM';
            const displayH = h % 12 || 12;
            return `${displayH}:${m.toString().padStart(2, '0')} ${period}`;
        } catch (e) {
            return timeStr;
        }
    };


    const addReservation = useCallback(async (res) => {
        if (!user?.id) return false;
        try {
            const backendRes = {
                name: res.guest,
                phone_number: res.phone,
                email: res.email || "",
                party_size: parseInt(res.party),
                date: res.date,
                table: res.table,
                notes: res.notes || "",
                start_time: res.time,
                status: res.status,
                end_time: res.time
            };

            const response = await fetch(`${API_URL}/reservations?resturant_id=${user.id}&table_id=${res.tableId || 1}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(backendRes)
            });

            if (response.ok) {
                const savedRes = await response.json();
                const formatted = {
                    id: savedRes.id,
                    guest: savedRes.name,
                    phone: savedRes.phone_number,
                    email: savedRes.email,
                    party: savedRes.party_size,
                    date: savedRes.date,
                    time: savedRes.start_time,
                    status: savedRes.status || 'Confirmed',
                    table: savedRes.table,
                    notes: savedRes.notes,
                    source: savedRes.source || 'Phone'
                };
                setReservations(prev => [formatted, ...prev]);
                return true;
            }
            return false;
        } catch (error) {
            console.error('Error adding reservation:', error);
            return false;
        }
    }, [user]);

    const getAvailableSlots = useCallback(async (tableLabel, date) => {
        if (!user?.id) return [];
        try {
            const table = tables.find(t => t.label === tableLabel);
            if (!table) return [];

            const response = await fetch(`${API_URL}/available-slots?table_id=${table.id}&selected_date=${date}&resturant_id=${user.id}`);
            if (response.ok) {
                return await response.json();
            }
            return [];
        } catch (error) {
            console.error('Error fetching slots:', error);
            return [];
        }
    }, [user, tables]);

    const updateReservation = useCallback(async (id, updatedData) => {
        if (!user?.id) return false;
        try {
            const original = reservations.find(r => r.id === id);
            if (!original) return false;

            const backendRes = {
                name: updatedData.guest || original.guest,
                phone_number: updatedData.phone || original.phone,
                email: updatedData.email || original.email || "",
                party_size: parseInt(updatedData.party || original.party),
                date: updatedData.date || original.date,
                table: updatedData.table || original.table,
                notes: updatedData.notes || original.notes || "",
                start_time: updatedData.time || original.time,
                status: updatedData.status || original.status,
                end_time: updatedData.time || original.time
            };

            const response = await fetch(`${API_URL}/reservation/${id}?resturant_id=${user.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(backendRes)
            });

            if (response.ok) {
                const saved = await response.json();
                const formatted = {
                    id: saved.id,
                    guest: saved.name,
                    phone: saved.phone_number,
                    email: saved.email,
                    party: saved.party_size,
                    date: saved.date,
                    time: saved.start_time,
                    status: saved.status || 'Confirmed',
                    table: saved.table,
                    notes: saved.notes,
                    source: 'Phone'
                };

                setReservations(prev => prev.map(res =>
                    res.id === id ? formatted : res
                ));
                return true;
            }
            return false;
        } catch (error) {
            console.error('Error updating reservation:', error);
            return false;
        }
    }, [user, reservations]);

    const fetchTables = useCallback(async () => {
        if (!user?.id) return;
        try {
            const response = await fetch(`${API_URL}/tables?resturant_id=${user.id}`);
            if (response.ok) {
                const data = await response.json();
                const formattedTables = data.map(table => ({
                    id: table.id,
                    label: table.table_name,
                    capacity: table.capacity,
                    active: table.is_available,
                    area: '—'
                }));
                setTables(formattedTables);
            }
        } catch (error) {
            console.error("Error fetching tables:", error);
        }
    }, [user]);

    useEffect(() => {
        if (!user?.id) return;

        const fetchSettings = async () => {
            try {
                const response = await fetch(`${API_URL}/setting?resturant_id=${user.id}`);
                if (response.ok) {
                    const data = await response.json();
                    if (data) {
                        setSettings({
                            turnaroundTime: data.turn_around_time,
                            bufferTime: data.buffer_time,
                            startTime: formatTimeFromBackend(data.shift_start_time),
                            endTime: formatTimeFromBackend(data.shift_end_time),
                            interval: data.time_slot_intervel.toString()
                        });
                    }
                }
            } catch (error) {
                console.error('Error fetching settings:', error);
            }
        };

        const fetchReservations = async () => {
            try {
                const response = await fetch(`${API_URL}/reservations?resturant_id=${user.id}`);
                if (response.ok) {
                    const data = await response.json();
                    const formatted = data.map(res => ({
                        id: res.id,
                        guest: res.name,
                        phone: res.phone_number,
                        email: res.email,
                        party: res.party_size,
                        date: res.date,
                        time: res.start_time,
                        status: res.status || 'Confirmed',
                        table: res.table,
                        notes: res.notes,
                        source: 'Phone'
                    }));
                    setReservations(formatted);
                }
            } catch (error) {
                console.error('Error fetching reservations:', error);
            }
        };

        fetchSettings();
        fetchTables();
        fetchReservations();
    }, [user, fetchTables]);

    const addTable = useCallback(async (table) => {
        if (!user?.id) return false;
        try {
            const backendTable = {
                table_name: table.label,
                table_number: table.label,
                capacity: parseInt(table.capacity),
                is_available: table.active
            };

            const response = await fetch(`${API_URL}/tables?resturant_id=${user.id}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(backendTable),
            });

            if (response.ok) {
                const savedTable = await response.json();
                const frontendTable = {
                    id: savedTable.id,
                    label: savedTable.table_name,
                    capacity: savedTable.capacity,
                    active: savedTable.is_available,
                    area: '—'
                };
                setTables(prev => [...prev, frontendTable]);
                return true;
            }
            return false;
        } catch (error) {
            console.error("Error adding table:", error);
            return false;
        }
    }, [user]);

    const updateTable = useCallback(async (id, updatedData) => {
        if (!user?.id) return false;
        try {
            const originalTable = tables.find(t => t.id === id);
            if (!originalTable) return false;

            const backendTable = {
                table_name: updatedData.label,
                table_number: updatedData.label,
                capacity: parseInt(updatedData.capacity),
                is_available: updatedData.active === true || updatedData.active === "true"
            };

            const response = await fetch(`${API_URL}/tables/${originalTable.label}?resturant_id=${user.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(backendTable),
            });

            if (response.ok) {
                const updated = await response.json();
                const frontendTable = {
                    id: updated.id,
                    label: updated.table_name,
                    capacity: updated.capacity,
                    active: updated.is_available,
                    area: updatedData.area || '—'
                };
                setTables(prev => prev.map(t => t.id === id ? frontendTable : t));
                return true;
            }
            return false;
        } catch (error) {
            console.error("Error updating table:", error);
            return false;
        }
    }, [user, tables]);

    const deleteTable = useCallback(async (id) => {
        if (!user?.id) return false;
        try {
            const tableToDelete = tables.find(t => t.id === id);
            if (!tableToDelete) return false;

            const response = await fetch(`${API_URL}/tables/${tableToDelete.label}?resturant_id=${user.id}`, {
                method: "DELETE"
            });

            if (response.ok) {
                setTables(prev => prev.filter(t => t.id !== id));
                return true;
            }
            return false;
        } catch (error) {
            console.error("Error deleting table:", error);
            return false;
        }
    }, [user, tables]);

    const updateSettings = useCallback(async (newSettings) => {
        if (!user?.id) return false;
        try {
            const backendData = {
                shift_start_time: parseTimeForBackend(newSettings.startTime),
                shift_end_time: parseTimeForBackend(newSettings.endTime),
                time_slot_intervel: parseInt(newSettings.interval),
                turn_around_time: parseInt(newSettings.turnaroundTime),
                buffer_time: parseInt(newSettings.bufferTime)
            };

            const response = await fetch(`${API_URL}/setting?resturant_id=${user.id}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(backendData)
            });

            if (response.ok) {
                const savedData = await response.json();
                setSettings({
                    turnaroundTime: savedData.turn_around_time,
                    bufferTime: savedData.buffer_time,
                    startTime: formatTimeFromBackend(savedData.shift_start_time),
                    endTime: formatTimeFromBackend(savedData.shift_end_time),
                    interval: savedData.time_slot_intervel.toString()
                });
                return true;
            }
            return false;
        } catch (error) {
            console.error('Error updating settings:', error);
            return false;
        }
    }, [user]);

    return (
        <DataContext.Provider value={{
            reservations,
            tables,
            settings,
            addReservation,
            updateReservation,
            addTable,
            updateTable,
            deleteTable,
            updateSettings,
            fetchTables,
            getAvailableSlots
        }}>
            {children}
        </DataContext.Provider>
    );
};
