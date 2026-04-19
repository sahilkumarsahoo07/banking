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
    <header className="fixed top-0 right-0 left-0 lg:left-64 h-16 glass z-40 px-4 md:px-6 flex items-center justify-between border-b border-slate-200/50 dark:border-slate-800/50">
      <div className="flex items-center gap-4 flex-1">
        <button 
          onClick={toggleSidebar}
          className="lg:hidden p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
        >
          <Menu size={20} />
        </button>
        <div className="hidden sm:block flex-1 max-w-md">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-500 transition-colors" size={16} />
            <input 
              type="text" 
              placeholder="Quick search..." 
              className="w-full bg-slate-100/50 dark:bg-slate-800/50 border border-transparent dark:border-slate-800/50 pl-10 pr-4 py-1.5 rounded-xl text-xs focus:ring-1 focus:ring-primary-500 outline-none transition-all dark:text-slate-200"
            />
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3 md:gap-4">
        <button 
          onClick={toggleTheme}
          className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-primary-600 transition-all active:scale-95"
        >
          {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
        </button>

        <div className="w-px h-6 bg-slate-200 dark:bg-slate-800 mx-1 hidden sm:block"></div>

        <button className="relative p-2 rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800">
          <Bell size={18} />
          <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-red-500 rounded-full border border-white dark:border-slate-900"></span>
        </button>

        <div className="flex items-center gap-3 pl-1 border-l border-slate-100 dark:border-slate-800 ml-1">
          <div className="hidden md:block text-right">
            <p className="text-xs font-black text-slate-900 dark:text-slate-100 leading-tight">{user?.name.split(' ')[0]}</p>
            <p className="text-[9px] font-black text-primary-500 uppercase tracking-widest">{user?.role?.replace('_', ' ')}</p>
          </div>
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-primary-600 to-primary-400 flex items-center justify-center text-white font-black text-xs shadow-lg shadow-primary-500/10">
            {user?.name?.charAt(0)}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
