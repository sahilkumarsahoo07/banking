import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import useAuthStore from '../store/useAuthStore';
import { 
  Users, 
  FileText, 
  Clock,
  User,
  Zap,
  TrendingUp,
  Target
} from 'lucide-react';
import DashboardCharts from '../components/DashboardCharts';
import { motion } from 'framer-motion';

const Dashboard = () => {
  const { user, token } = useAuthStore();
  const [stats, setStats] = useState([]);
  const [recentActivities, setRecentActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (user?.role === 'admin' || user?.role === 'manager') {
          const statsRes = await api.get('/api/admin/stats');
          const data = statsRes.data;
          setStats([
            { name: 'Active Leads', value: data.totalLeads, icon: Zap, color: 'text-blue-500', bg: 'bg-blue-500/10', trend: '+12%' },
            { name: 'Stage: Login', value: data.totalLogins, icon: FileText, color: 'text-amber-500', bg: 'bg-amber-500/10', trend: '+5%' },
            { name: 'Disbursed', value: data.totalDisbursements, icon: Target, color: 'text-green-500', bg: 'bg-green-500/10', trend: '+18%' },
            { name: 'Pending Staff', value: data.pendingApprovals, icon: Clock, color: 'text-purple-500', bg: 'bg-purple-500/10', trend: '-2%' },
          ]);
        } else {
          setStats([
            { name: 'My Leads', value: '12', icon: Users, color: 'text-blue-500', bg: 'bg-blue-500/10', trend: '+2' },
            { name: 'Tasks', value: '5', icon: FileText, color: 'text-amber-500', bg: 'bg-amber-500/10', trend: 'Today' },
            { name: 'Alerts', value: '3', icon: Zap, color: 'text-green-500', bg: 'bg-green-500/10', trend: 'New' },
            { name: 'Pending', value: '2', icon: Clock, color: 'text-purple-500', bg: 'bg-purple-500/10', trend: 'ASAP' },
          ]);
        }

        const customersRes = await api.get('/api/customers');
        setRecentActivities(customersRes.data.slice(0, 5));
        setLoading(false);
      } catch (err) {
        console.error('Error fetching data:', err);
        setLoading(false);
      }
    };
    fetchData();
  }, [user, token]);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.05 }
    }
  };

  const item = {
    hidden: { y: 10, opacity: 0 },
    show: { y: 0, opacity: 1 }
  };

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-8 min-h-screen p-1"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Overview</h1>
          <p className="text-sm text-slate-500 font-medium">Monitoring <span className="text-primary-600 dark:text-primary-400 font-bold">@{user?.name.split(' ')[0]}</span>'s performance.</p>
        </div>
        <div className="flex gap-3">
           <div className="px-4 py-2 glass-pill flex items-center gap-2 text-[10px] font-black text-slate-600 dark:text-slate-300">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_10px_#22c55e]"></div>
              Vitals: Optimal
           </div>
        </div>
      </div>

      {/* KPI Stats - Deep Glass Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <motion.div 
            variants={item}
            key={stat.name} 
            className="glass p-5 rounded-[2rem] bounce-hover group relative overflow-hidden"
          >
            {/* Background Glow Accent */}
            <div className={`absolute -right-4 -top-4 w-24 h-24 blur-3xl opacity-20 transition-opacity group-hover:opacity-40 ${stat.bg}`}></div>
            
            <div className="flex justify-between items-start mb-4 relative z-10">
              <div className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all duration-500 ${
                stat.color === 'text-blue-500' ? 'icon-glow-primary' :
                stat.color === 'text-amber-500' ? 'icon-glow-amber' :
                stat.color === 'text-green-500' ? 'icon-glow-green' : 'icon-glow-purple'
              }`}>
                <stat.icon size={22} />
              </div>
              <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${stat.trend.startsWith('+') ? 'text-green-500 bg-green-500/10' : 'text-rose-500 bg-rose-500/10'}`}>
                {stat.trend}
              </span>
            </div>
            <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.15em] mb-1">{stat.name}</p>
            <h3 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter">{stat.value}</h3>
          </motion.div>
        ))}
      </div>

      {/* Main Grid: Deep Glass Containers */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Charts & Activity */}
        <motion.div variants={item} className="xl:col-span-2 space-y-8">
          <div className="glass p-8 rounded-[2.5rem] relative overflow-hidden">
             {/* Decorative radial glow */}
             <div className="absolute -left-20 -top-20 w-64 h-64 bg-primary-500/5 rounded-full blur-[100px]"></div>
            
            <div className="flex items-center justify-between mb-8 relative z-10">
              <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-[0.2em]">Pipeline Yield</h3>
              <select className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-md border border-slate-200 dark:border-slate-800 text-[10px] font-black px-3 py-1.5 rounded-xl outline-none cursor-pointer uppercase tracking-widest text-slate-600 dark:text-slate-400">
                 <option>Monthly View</option>
                 <option>All Time View</option>
              </select>
            </div>
            <DashboardCharts role={user?.role} />
          </div>

          <div className="glass p-8 rounded-[2.5rem] relative overflow-hidden">
            <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-[0.2em] mb-6">Recent Intelligence</h3>
            <div className="space-y-4">
              {recentActivities.map((c) => (
                <div key={c._id} className="flex items-center justify-between p-4 rounded-3xl hover:bg-white/50 dark:hover:bg-white/5 transition-all duration-300 group cursor-pointer border border-transparent hover:border-white/20">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white dark:bg-slate-900 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-primary-500 group-hover:text-white transition-all duration-500 shadow-sm">
                      <User size={24} />
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-slate-900 dark:text-white">{c.name}</h4>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
                        {c.businessType.replace('_', ' ')} • {new Date(c.createdAt).toLocaleDateString('en-GB')}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 text-[9px] font-black rounded-full border uppercase tracking-widest ${
                      c.status === 'disbursement' ? 'bg-green-500/10 text-green-500 border-green-500/20' : 
                      c.status === 'login_done' ? 'bg-blue-500/10 text-blue-500 border-blue-500/20' :
                      'bg-slate-500/10 text-slate-400 border-slate-500/20'
                    }`}>
                      {c.status.replace('_', ' ')}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Right Sidebar Widgets */}
        <motion.div variants={item} className="space-y-8">
           <div className="bg-gradient-to-br from-primary-600 to-indigo-700 rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-2xl shadow-primary-500/20">
              <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full blur-[80px] -mr-24 -mt-24"></div>
              <div className="relative z-10">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-xl rounded-2xl flex items-center justify-center mb-6 border border-white/20">
                  <TrendingUp size={24} />
                </div>
                <h3 className="text-xl font-black mb-2 tracking-tight">Portfolio Alpha</h3>
                <p className="text-primary-100 text-xs font-medium leading-relaxed mb-8 opacity-80">
                  Enterprise performance is indexed at <span className="text-white font-black underline decoration-primary-400 decoration-2 underline-offset-4">1.4x</span> vs target. 
                </p>
                <button className="w-full py-4 bg-white text-primary-700 text-xs font-black rounded-2xl hover:bg-slate-50 transition-all active:scale-[0.98] shadow-lg">
                  Optimization Engine
                </button>
              </div>
           </div>

           <div className="glass p-8 rounded-[2.5rem]">
             <h3 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-[0.2em] mb-6">Quick Links</h3>
             <div className="grid grid-cols-2 gap-4">
                <button className="flex flex-col items-center gap-3 p-4 rounded-3xl bg-slate-50/50 dark:bg-slate-800/50 hover:bg-primary-600 hover:text-white transition-all duration-300 group">
                   <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900/20 rounded-xl flex items-center justify-center group-hover:bg-white/20 transition-colors">
                     <Zap size={20} className="text-primary-600 dark:text-primary-400 group-hover:text-white" />
                   </div>
                   <span className="text-[10px] font-black uppercase tracking-widest">New Lead</span>
                </button>
                <button className="flex flex-col items-center gap-3 p-4 rounded-3xl bg-slate-50/50 dark:bg-slate-800/50 hover:bg-indigo-600 hover:text-white transition-all duration-300 group">
                   <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900/20 rounded-xl flex items-center justify-center group-hover:bg-white/20 transition-colors">
                     <FileText size={20} className="text-indigo-600 dark:text-indigo-400 group-hover:text-white" />
                   </div>
                   <span className="text-[10px] font-black uppercase tracking-widest">Analytics</span>
                </button>
             </div>
           </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Dashboard;
