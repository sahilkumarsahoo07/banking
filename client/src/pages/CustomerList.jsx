import React, { useState, useEffect } from 'react';
import axios from 'axios';
import useAuthStore from '../store/useAuthStore';
import { 
  Search, 
  Filter, 
  Plus,
  User,
  ArrowUpRight,
  Briefcase,
  Download,
  Flame
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const CustomerList = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { token, user } = useAuthStore();

  const fetchCustomers = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/customers', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCustomers(res.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching customers:', err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, [token]);

  const updateStatus = async (id, newStatus) => {
    try {
      await axios.patch(`http://localhost:5000/api/customers/${id}/status`, 
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchCustomers();
    } catch (err) {
      console.error('Error updating status:', err);
    }
  };

  const statusMap = {
    pending: { label: 'Pending', color: 'bg-slate-500/10 text-slate-500 border-slate-500/20' },
    login_done: { label: 'Login Done', color: 'bg-blue-500/10 text-blue-500 border-blue-500/20' },
    follow_up: { label: 'Follow Up', color: 'bg-amber-500/10 text-amber-500 border-amber-500/20' },
    branch_visit: { label: 'Branch Visit', color: 'bg-purple-500/10 text-purple-500 border-purple-500/20' },
    disbursement: { label: 'Disbursement', color: 'bg-green-500/10 text-green-500 border-green-500/20' },
    padayatra: { label: 'Padayatra', color: 'bg-indigo-500/10 text-indigo-500 border-indigo-500/20' },
  };

  const exportToCSV = () => {
    const headers = ['Name', 'Business Type', 'Loan Amount', 'Turnover', 'Status', 'Score'].join(',');
    const rows = customers.map(c => [
      c.name, 
      c.businessType, 
      c.loanAmount, 
      c.turnover, 
      c.status,
      c.score || 0
    ].join(','));
    const csvContent = "data:text/csv;charset=utf-8," + [headers, ...rows].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Leads_Export_${new Date().toLocaleDateString()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex justify-between items-center bg-transparent">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Pipeline</h1>
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">Management Console</p>
        </div>
        <div className="flex gap-3">
          {(user?.role === 'manager' || user?.role === 'admin') && (
            <button 
              onClick={exportToCSV}
              className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-4 py-2 rounded-xl text-xs font-black flex items-center gap-2 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all border border-slate-200/50 dark:border-slate-800/50"
            >
              <Download size={16} />
              Export CSV
            </button>
          )}
          {(user?.role === 'sales_rep' || user?.role === 'admin') && (
            <Link 
              to="/customers/new" 
              className="bg-primary-600 text-white px-4 py-2 rounded-xl text-xs font-black flex items-center gap-2 hover:bg-primary-700 transition-all shadow-lg shadow-primary-500/10"
            >
              <Plus size={16} />
              Add Lead
            </Link>
          )}
        </div>
      </div>

      <div className="glass rounded-3xl overflow-hidden">
        <div className="p-4 border-b border-slate-200/50 dark:border-slate-800/50 flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 group w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-500 transition-colors" size={16} />
            <input 
              type="text" 
              placeholder="Search entity..." 
              className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-xs outline-none transition-all dark:text-white"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 border border-slate-200/50 dark:border-slate-800/50 rounded-xl text-xs font-bold text-slate-500 bg-white dark:bg-slate-900 transition-all">
            <Filter size={16} />
            Filters
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 dark:bg-slate-800/50 text-slate-400 text-[9px] font-black uppercase tracking-widest">
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4 hidden sm:table-cell">Details</th>
                <th className="px-6 py-4">Value</th>
                <th className="px-6 py-4 text-center">Score</th>
                <th className="px-6 py-4">Stage</th>
                <th className="px-6 py-4 text-right"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
              {loading ? (
                <tr><td colSpan="6" className="px-6 py-10 text-center text-slate-400 italic text-xs">Loading leads...</td></tr>
              ) : customers.length === 0 ? (
                <tr><td colSpan="6" className="px-6 py-10 text-center text-slate-400 italic text-xs">No records.</td></tr>
              ) : (
                customers.map((c) => (
                  <tr key={c._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 group-hover:text-primary-500">
                          <User size={16} />
                        </div>
                        <div>
                          <p className="text-xs font-black text-slate-900 dark:text-white leading-tight">{c.name}</p>
                          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter mt-0.5 sm:hidden">{c.businessType.replace('_', ' ')}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 hidden sm:table-cell">
                      <div className="flex items-center gap-1">
                        <Briefcase size={12} className="text-slate-300" />
                        <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-tighter">{c.businessType.replace('_', ' ')}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-black text-slate-900 dark:text-slate-200 text-xs">
                      ₹{(c.loanAmount / 100000).toFixed(1)}L
                    </td>
                    <td className="px-6 py-4 text-center">
                       <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-[10px] font-black ${
                         c.score >= 70 ? 'bg-green-500/10 text-green-500 shadow-[0_0_15px_-5px_#22c55e]' :
                         c.score >= 40 ? 'bg-amber-500/10 text-amber-500' :
                         'bg-red-500/10 text-red-500'
                       }`}>
                          <Flame size={12} />
                          {c.score || 0}%
                       </div>
                    </td>
                    <td className="px-6 py-4">
                      <select 
                        value={c.status}
                        onChange={(e) => updateStatus(c._id, e.target.value)}
                        className={`text-[9px] font-black px-3 py-1 rounded-lg border-2 outline-none cursor-pointer tracking-widest uppercase transition-all ${statusMap[c.status]?.color}`}
                      >
                        {Object.keys(statusMap).map(key => (
                          <option key={key} value={key}>{statusMap[key].label}</option>
                        ))}
                      </select>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="p-1.5 text-slate-300 hover:text-primary-500 bg-transparent rounded-lg transition-all">
                        <ArrowUpRight size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
};

export default CustomerList;
