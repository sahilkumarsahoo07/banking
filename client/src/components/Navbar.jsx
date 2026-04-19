import React from 'react';
import { 
  Search, 
  Bell, 
  Sun, 
  Moon, 
  Menu
} from 'lucide-react';
import useTheme from '../hooks/useTheme';
import useAuthStore from '../store/useAuthStore';

const Navbar = ({ toggleSidebar }) => {
  const { theme, toggleTheme } = useTheme();
  const { user } = useAuthStore();

  return (
    <div className="fixed top-4 right-4 left-4 lg:left-68 z-40 transition-all duration-300">
      <header className="glass h-16 px-6 flex items-center justify-between rounded-3xl border border-white/40 dark:border-white/10 shadow-2xl shadow-slate-900/5 dark:shadow-black/20">
        <div className="flex items-center gap-4 flex-1">
          <button 
            onClick={toggleSidebar}
            className="lg:hidden p-2 rounded-xl bg-slate-900/5 dark:bg-slate-100/5 text-slate-600 dark:text-slate-300 transition-colors"
          >
            <Menu size={20} />
          </button>
          <div className="hidden sm:block flex-1 max-w-md">
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-500 transition-colors" size={16} />
              <input 
                type="text" 
                placeholder="Search resources..." 
                className="w-full bg-slate-900/5 dark:bg-white/5 border border-transparent focus:border-primary-500/20 pl-10 pr-4 py-2 rounded-2xl text-xs focus:ring-4 focus:ring-primary-500/5 outline-none transition-all dark:text-slate-100 font-bold placeholder:text-slate-400"
              />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button 
            onClick={toggleTheme}
            className="p-2.5 rounded-2xl bg-slate-900/5 dark:bg-white/5 text-slate-600 dark:text-slate-300 hover:text-primary-600 dark:hover:text-primary-400 transition-all active:scale-90"
            title="Toggle Theme"
          >
            {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
          </button>

          <div className="w-px h-6 bg-slate-200 dark:bg-slate-800 hidden sm:block"></div>

          <button className="relative p-2.5 rounded-2xl text-slate-500 hover:bg-slate-900/5 dark:hover:bg-white/5 transition-colors">
            <Bell size={18} />
            <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-slate-900"></span>
          </button>

          <div className="flex items-center gap-3 pl-2 border-l border-slate-200 dark:border-slate-800">
            <div className="hidden md:block text-right">
              <p className="text-xs font-black text-slate-900 dark:text-white leading-tight">{user?.name.split(' ')[0]}</p>
              <p className="text-[10px] font-black text-primary-500 uppercase tracking-widest leading-none mt-1">{user?.role?.replace('_', ' ')}</p>
            </div>
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-primary-600 to-primary-400 p-0.5 shadow-lg shadow-primary-500/20">
               <div className="w-full h-full rounded-[0.9rem] bg-white dark:bg-slate-900 flex items-center justify-center text-primary-600 dark:text-primary-400 font-black text-sm">
                  {user?.name?.charAt(0)}
               </div>
            </div>
          </div>
        </div>
      </header>
    </div>
  );
};

export default Navbar;
