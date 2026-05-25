import { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../AuthContext';
import {
  LayoutDashboard, Receipt, FolderOpen, Target, LogOut,
  Menu, X, ChevronRight, Wallet, User, Settings, Calendar
} from 'lucide-react';

const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard', end: true },
  { to: '/records', icon: Receipt, label: 'Records' },
  { to: '/categories', icon: FolderOpen, label: 'Categories' },
  { to: '/monthly-summary', icon: Calendar, label: 'Monthly Summary' },
  { to: '/goals', icon: Target, label: 'Goals' },
];

export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <div className="flex min-h-screen">
      {/* Mobile overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-72 flex flex-col
        bg-[var(--color-surface-800)] border-r border-[var(--color-border-subtle)]
        transform transition-transform duration-300 ease-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        
        {/* Logo */}
        <div className="flex items-center gap-3 px-6 py-6 border-b border-[var(--color-border-subtle)]">
          <div className="w-10 h-10 rounded-lg bg-[var(--color-brand-500)] flex items-center justify-center shadow-sm">
            <Wallet className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-[var(--color-text-primary)] tracking-tight">FinPlanner</h1>
            <p className="text-xs text-[var(--color-text-secondary)] font-medium">Financial OS</p>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden ml-auto text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-4 py-6 space-y-1">
          {navItems.map(({ to, icon: Icon, label, end }) => (
            <NavLink
              key={to} to={to} end={end}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) => `group flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-150
                ${isActive
                  ? 'bg-[var(--color-surface-700)] text-[var(--color-brand-500)]'
                  : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-surface-700)]'}`}
            >
              <Icon className={`w-5 h-5 ${location.pathname === to ? 'text-[var(--color-brand-500)]' : 'text-[var(--color-text-muted)] group-hover:text-[var(--color-text-secondary)]'}`} />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        {/* User */}
        <div className="p-4 border-t border-[var(--color-border-subtle)]">
          <div className="flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-[var(--color-surface-700)] transition-colors cursor-pointer group">
            <div className="w-9 h-9 rounded-full bg-[var(--color-brand-500)] flex items-center justify-center text-sm font-bold text-white shadow-sm">
              {user?.username?.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-[var(--color-text-primary)] truncate">{user?.fullName || user?.username}</p>
              <p className="text-xs text-[var(--color-text-muted)] truncate">{user?.email}</p>
            </div>
            <button onClick={handleLogout} className="text-[var(--color-text-muted)] opacity-0 group-hover:opacity-100 hover:text-[var(--color-danger-500)] transition-all" title="Logout">
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 min-w-0 bg-[var(--color-surface-900)]">
        {/* Top bar */}
        <header className="sticky top-0 z-30 flex items-center gap-4 px-4 lg:px-8 h-16
          bg-[var(--color-surface-900)] border-b border-[var(--color-border-subtle)]">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]">
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex-1" />
            <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-[var(--color-surface-800)] border border-[var(--color-border-subtle)] rounded-md px-3 py-1.5 shadow-sm">
              <span className="text-xs text-[var(--color-text-muted)] font-medium">Currency:</span>
              <span className="text-xs font-semibold text-[var(--color-text-primary)] flex items-center gap-1.5">🇱🇰 LKR</span>
            </div>
            <span className="text-xs text-[var(--color-text-muted)] hidden sm:inline font-medium">
              {new Date().toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}
            </span>
          </div>
        </header>

        {/* Page content */}
        <div className="p-4 lg:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
