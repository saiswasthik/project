import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Upload,
  FolderOpen,
  CheckSquare,
  ShieldAlert,
  LogOut,
  ChevronRight,
  Settings
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import '../../styles/index.css';

const Sidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
    { icon: Upload, label: 'Document Upload', path: '/documents' },
    { icon: FolderOpen, label: 'Claims Library', path: '/claims' },
    { icon: CheckSquare, label: 'Validation Results', path: '/validation' },
    { icon: Settings, label: 'Settings', path: '/settings' },
  ];

  return (
    <aside className="sidebar-width bg-slate-900 text-slate-300 flex flex-col h-full fixed left-0 top-0 border-r border-slate-800 shadow-2xl z-20">
      {/* Brand Header */}
      <div className="p-6 flex items-center gap-3 border-b border-slate-800/50 bg-slate-900/50 backdrop-blur-md">
        <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
          <ShieldAlert size={24} className="text-white" />
        </div>
        <span className="text-xl font-bold tracking-tight text-white">
          ClaimSure <span className="text-blue-500">AI</span>
        </span>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 p-4 flex flex-col gap-1.5 mt-4">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center justify-between p-3 rounded-xl transition-all duration-200 group ${isActive
                ? 'bg-blue-600/10 text-blue-400 border border-blue-600/20'
                : 'hover:bg-slate-800/50 hover:text-white'
              }`
            }
          >
            <div className="flex items-center gap-3">
              <item.icon size={20} className="transition-transform group-hover:scale-110" />
              <span className="font-medium text-sm">{item.label}</span>
            </div>
            <ChevronRight size={14} className="opacity-0 group-hover:opacity-40 transition-opacity" />
          </NavLink>
        ))}
      </nav>

      {/* Simplified Account Footer */}
      <div className="p-6 bg-slate-950/20 border-t border-slate-800/80 mt-auto">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold shadow-lg flex-shrink-0">
              {user?.name?.split(' ').map(n => n[0]).join('') || 'AI'}
            </div>
            <div className="overflow-hidden">
              <div className="text-sm font-bold text-white truncate">{user?.name || 'User'}</div>
              <div className="text-[10px] text-slate-500 uppercase tracking-widest font-black leading-tight">{user?.role || 'Analyst'}</div>
            </div>
          </div>

          <button
            onClick={handleLogout}
            title="Sign Out"
            className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700/50 flex items-center justify-center text-slate-400 hover:text-red-400 hover:bg-red-500/10 hover:border-red-500/20 transition-all duration-300 group shadow-lg"
          >
            <LogOut size={18} className="group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
