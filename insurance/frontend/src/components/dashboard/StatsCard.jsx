import React from 'react';

const StatsCard = ({ title, value, label, icon: Icon, color, status, statusText, subValue }) => {
    return (
        <div className="card flex-1 min-w-[240px]">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h3 className="text-slate-500 text-sm font-medium">{title}</h3>
                    <div className="text-3xl font-bold text-slate-800 mt-1" style={{ color: color }}>{value}</div>
                    <div className="text-xs text-slate-400 mt-1">{subValue || 'All time'}</div>
                </div>
                <div className={`p-2 rounded-lg`} style={{ backgroundColor: `${color}15` }}>
                    <Icon size={20} style={{ color: color }} />
                </div>
            </div>
            {(status || statusText) && (
                <div className="text-xs font-medium" style={{ color: status === 'error' ? '#ef4444' : status === 'success' ? '#10b981' : '#f59e0b' }}>
                    {statusText}
                </div>
            )}
        </div>
    );
};

export default StatsCard;
