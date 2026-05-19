import React from 'react';
import { Search, Bell, Clock } from 'lucide-react';
import { useLocation } from 'react-router-dom';

const Header = () => {
    const location = useLocation();
    const claimId = location.state?.claimId || '';

    return (
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 sticky top-0 z-10">
            <div className="flex-1 max-w-xl">
                <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-blue-500 uppercase tracking-widest leading-none mb-1">Active claim-ID</span>
                    <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${claimId ? 'bg-green-500 animate-pulse' : 'bg-slate-300'}`}></div>
                        <p className="text-lg font-mono font-bold text-slate-700 tracking-tight">
                            {claimId ? claimId : 'NO ACTIVE CLAIM'}
                        </p>
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-6">
                <div className="p-2 relative hover:bg-slate-50 rounded-full cursor-pointer transition-colors">
                    <Bell size={20} className="text-slate-500" />
                    <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                </div>
                <div className="flex items-center gap-3 pl-6 border-l border-slate-100">
                    <div className="text-right hidden sm:block">
                        <p className="text-xs font-semibold text-slate-800 leading-none">System Status</p>
                        <p className="text-[10px] text-green-500 font-medium">Synced & Ready</p>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
