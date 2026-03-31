import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Sparkles, Bookmark, History, Search,
  LogOut, Menu, X, Shield, ChevronRight, Bell, User
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import toast from 'react-hot-toast';

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/generate', icon: Sparkles, label: 'Generate' },
  { to: '/bookmarks', icon: Bookmark, label: 'Bookmarks' },
  { to: '/history', icon: History, label: 'History' },
  { to: '/search', icon: Search, label: 'Search' },
];

export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  const Sidebar = ({ mobile = false }) => (
    <aside className={`
      flex flex-col h-full bg-navy-900 border-r border-navy-700
      ${mobile ? 'w-72' : 'w-64 hidden lg:flex'}
    `}>
      {/* Logo */}
      <div className="p-6 border-b border-navy-700">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-saffron-500 to-saffron-700 flex items-center justify-center text-xl shadow-lg shadow-saffron-500/30">
            ⚖
          </div>
          <div>
            <h1 className="font-display font-bold text-white text-lg leading-tight">Exam</h1>
            <p className="text-saffron-400 text-xs font-semibold tracking-wider uppercase">Booster</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider px-3 mb-3">Menu</p>
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
            onClick={() => setSidebarOpen(false)}
          >
            <Icon size={18} />
            <span>{label}</span>
            <ChevronRight size={14} className="ml-auto opacity-40" />
          </NavLink>
        ))}
        {user?.role === 'admin' && (
          <NavLink
            to="/admin"
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
            onClick={() => setSidebarOpen(false)}
          >
            <Shield size={18} />
            <span>Admin Panel</span>
            <ChevronRight size={14} className="ml-auto opacity-40" />
          </NavLink>
        )}
      </nav>

      {/* User section */}
      <div className="p-4 border-t border-navy-700">
        <div className="flex items-center gap-3 px-3 py-3 rounded-xl bg-navy-800 mb-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-saffron-400 to-saffron-600 flex items-center justify-center">
            <User size={14} className="text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white font-semibold text-sm truncate">{user?.username}</p>
            <p className="text-slate-400 text-xs capitalize">{user?.role}</p>
          </div>
        </div>
        <button onClick={handleLogout} className="sidebar-link w-full text-red-400 hover:text-red-300 hover:bg-red-500/10">
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );

  return (
    <div className="flex h-screen overflow-hidden bg-navy-950">
      {/* Desktop sidebar */}
      <Sidebar />

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
          <div className="relative z-10 animate-slide-in-right">
            <Sidebar mobile />
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="absolute top-4 right-4 z-20 text-white bg-navy-800 p-2 rounded-full"
          >
            <X size={20} />
          </button>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Topbar (mobile) */}
        <header className="lg:hidden flex items-center justify-between px-4 py-3 bg-navy-900 border-b border-navy-700 shrink-0">
          <button onClick={() => setSidebarOpen(true)} className="text-slate-400 hover:text-white p-2 rounded-lg hover:bg-navy-800">
            <Menu size={22} />
          </button>
          <div className="flex items-center gap-2">
            <span className="text-xl">⚖</span>
            <span className="font-display font-bold text-white">Exam Booster</span>
          </div>
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-saffron-400 to-saffron-600 flex items-center justify-center">
            <User size={16} className="text-white" />
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          <div className="max-w-6xl mx-auto animate-fade-in">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
