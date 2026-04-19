import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Calculator, 
  ShieldCheck,
  LogOut,
  Layers,
  X,
  PieChart
} from 'lucide-react';
import useAuthStore from '../store/useAuthStore';
import { motion, AnimatePresence } from 'framer-motion';

const Sidebar = ({ isOpen, setIsOpen }) => {
  const { user, logout } = useAuthStore();

  const menuItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard, roles: ['customer', 'sales_rep', 'manager', 'admin'] },
    { name: 'Leads & Customers', path: '/customers', icon: Users, roles: ['sales_rep', 'manager', 'admin'] },
    { name: 'Financial Suite', path: '/emi-calculator', icon: Calculator, roles: ['customer', 'sales_rep', 'manager', 'admin'] },
    { name: 'Document Hub', path: '/documents', icon: ShieldCheck, roles: ['sales_rep', 'manager', 'admin'] },
    { name: 'Admin Control', path: '/admin', icon: ShieldCheck, roles: ['admin'] },
  ];

  const filteredItems = menuItems.filter(item => item.roles.includes(user?.role));

  return (
    <aside className={`fixed left-0 top-0 bottom-0 w-64 bg-sidebar-bg border-r border-slate-200/50 dark:border-slate-800/50 z-50 flex flex-col transition-transform duration-300 lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
      <div className="p-6 pb-8 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary-600 rounded-xl flex items-center justify-center rotate-3 shadow-lg shadow-primary-500/20">
            <Layers className="text-white" size={18} />
          </div>
          <div>
            <h1 className="text-lg font-black text-slate-900 dark:text-white tracking-tight leading-none uppercase">Bank<span className="text-primary-500">Core</span></h1>
          </div>
        </div>
        <button onClick={() => setIsOpen(false)} className="lg:hidden p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
          <X size={20} />
        </button>
      </div>

      <nav className="flex-1 px-3 space-y-1">
        <p className="px-4 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-4 opacity-50">Menu</p>
        {filteredItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            onClick={() => setIsOpen(false)}
            className={({ isActive }) =>
              `group flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-300 ${
                isActive 
                  ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/10' 
                  : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900 hover:text-slate-900 dark:hover:text-white'
              }`
            }
          >
            <item.icon size={18} className="shrink-0" />
            <span className="text-xs font-bold tracking-tight">{item.name}</span>
          </NavLink>
        ))}
      </nav>

      <div className="p-4 mt-auto space-y-4">
        <div className="bg-slate-50 dark:bg-slate-900/50 rounded-2xl p-4 border border-slate-100 dark:border-slate-800">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-2">Portfolio</p>
          <div className="w-full bg-slate-200 dark:bg-slate-800 h-1 rounded-full overflow-hidden">
             <div className="h-full bg-primary-600 w-4/5" />
          </div>
          <p className="text-[9px] font-bold text-slate-500 dark:text-slate-400 mt-2 italic">Performance: 84%</p>
        </div>

        <button
          onClick={logout}
          className="flex items-center gap-3 w-full px-4 py-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-all"
        >
          <LogOut size={18} />
          <span className="text-xs font-bold">Sign Out</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
