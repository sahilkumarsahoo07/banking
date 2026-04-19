import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import useAuthStore from '../store/useAuthStore';
import { 
  Search, 
  Filter, 
  Plus,
  User,
  Pencil,
  Trash2,
  Briefcase,
  Download,
  Flame,
  AlertTriangle
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import EditLeadModal from '../components/EditLeadModal';

const CustomerList = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedCust, setSelectedCust] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const { token, user } = useAuthStore();

  const fetchCustomers = async () => {
    try {
      const res = await api.get('/api/customers');
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
      await api.patch(`/api/customers/${id}/status`, { status: newStatus });
      fetchCustomers();
    } catch (err) {
      console.error('Error updating status:', err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/api/customers/${id}`);
      setCustomers(prev => prev.filter(c => c._id !== id));
      setDeleteConfirm(null);
    } catch (err) {
      console.error('Error deleting lead:', err);
    }
  };

  const handleEditUpdate = (updatedLead) => {
    setCustomers(prev => prev.map(c => c._id === updatedLead._id ? updatedLead : c));
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
      className="space-y-6 pt-20"
    >
      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteConfirm && (
          <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm" onClick={() => setDeleteConfirm(null)} />
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="glass-card max-w-sm w-full p-8 rounded-[2.5rem] relative z-10 border border-white/20 shadow-2xl">
              <div className="w-16 h-16 bg-red-500/10 text-red-500 rounded-2xl flex items-center justify-center mb-6">
                <AlertTriangle size={32} />
              </div>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight mb-2">Secure Deletion</h3>
              <p className="text-sm text-slate-500 font-medium mb-8">This action is irreversible. Are you certain you want to remove this lead from the pipeline?</p>
              <div className="flex gap-4">
                <button onClick={() => setDeleteConfirm(null)} className="flex-1 py-3 text-[10px] font-black uppercase tracking-widest text-slate-500 hover:bg-slate-100 rounded-xl transition-all">Cancel</button>
                <button onClick={() => handleDelete(deleteConfirm)} className="flex-1 py-3 text-[10px] font-black uppercase tracking-widest bg-red-600 text-white rounded-xl shadow-lg shadow-red-500/20 hover:bg-red-700 transition-all">Confirm Delete</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <EditLeadModal 
        isOpen={isEditOpen} 
        onClose={() => setIsEditOpen(false)} 
        customer={selectedCust}
        onUpdate={handleEditUpdate}
      />

      <div className="flex justify-between items-center bg-transparent px-2">
        <div>
          <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">Pipeline</h1>
          <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em] mt-2 underline decoration-primary-500 underline-offset-8">Management Console</p>
        </div>
        <div className="flex gap-3">
          {(user?.role === 'manager' || user?.role === 'admin') && (
            <button 
              onClick={exportToCSV}
              className="bg-slate-900/5 dark:bg-white/5 text-slate-600 dark:text-slate-300 px-6 py-3 rounded-2xl text-[10px] font-black flex items-center gap-2 hover:bg-slate-900/10 transition-all border border-slate-200/50 dark:border-white/5 uppercase tracking-widest shadow-xl shadow-slate-900/5"
            >
              <Download size={16} strokeWidth={3} />
              Export Portfolios
            </button>
          )}
          {(user?.role === 'sales_rep' || user?.role === 'admin') && (
            <Link 
              to="/customers/new" 
              className="bg-primary-600 text-white px-6 py-3 rounded-2xl text-[10px] font-black flex items-center gap-2 hover:bg-primary-700 transition-all shadow-2xl shadow-primary-500/20 uppercase tracking-widest active:scale-95"
            >
              <Plus size={16} strokeWidth={3} />
              Acquire Lead
            </Link>
          )}
        </div>
      </div>

      <div className="glass rounded-[2.5rem] overflow-hidden border border-white/40 dark:border-white/10 shadow-2xl shadow-slate-900/5 dark:shadow-black/20">
        <div className="p-6 border-b border-slate-200/50 dark:border-white/5 flex flex-col sm:flex-row items-center gap-4">
          <div className="relative flex-1 group w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-500 transition-colors" size={16} strokeWidth={3} />
            <input 
              type="text" 
              placeholder="Filter by entity name..." 
              className="w-full pl-12 pr-4 py-3 bg-slate-900/5 dark:bg-white/5 border border-transparent focus:border-primary-500/20 rounded-2xl text-xs font-bold outline-none transition-all dark:text-white placeholder:text-slate-400"
            />
          </div>
          <button className="flex items-center gap-2 px-6 py-3 border border-slate-200 dark:border-white/10 rounded-2xl text-[10px] font-black text-slate-500 uppercase tracking-widest bg-white dark:bg-white/5 transition-all shadow-sm">
            <Filter size={16} />
            Filters
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-900/5 dark:bg-white/5 text-slate-500 dark:text-slate-400 text-[10px] font-black uppercase tracking-[0.15em]">
                <th className="px-8 py-5">System Entity</th>
                <th className="px-8 py-5 hidden md:table-cell">Structure</th>
                <th className="px-8 py-5">Capital</th>
                <th className="px-8 py-5 text-center">Quality</th>
                <th className="px-8 py-5">Workflow Stage</th>
                <th className="px-8 py-5 text-right">Clearance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/50 dark:divide-white/5">
              {loading ? (
                <tr><td colSpan="6" className="px-8 py-16 text-center text-slate-400 italic font-black text-[10px] uppercase tracking-widest">Synchronizing Leads...</td></tr>
              ) : customers.length === 0 ? (
                <tr><td colSpan="6" className="px-8 py-16 text-center text-slate-400 italic font-black text-[10px] uppercase tracking-widest">No Intelligence Records Found.</td></tr>
              ) : (
                customers.map((c) => (
                  <tr key={c._id} className="hover:bg-slate-900/5 dark:hover:bg-white/5 transition-colors group">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-2xl bg-white dark:bg-slate-900 flex items-center justify-center text-slate-300 group-hover:bg-primary-600 group-hover:text-white transition-all shadow-sm">
                          <User size={18} />
                        </div>
                        <div>
                          <p className="text-sm font-black text-slate-900 dark:text-white leading-tight">{c.name}</p>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter mt-1 sm:hidden">{c.businessType.replace('_', ' ')}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6 hidden md:table-cell">
                      <div className="flex items-center gap-2">
                        <Briefcase size={14} className="text-primary-500" />
                        <span className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">{c.businessType.replace('_', ' ')}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6 font-black text-slate-900 dark:text-slate-200 text-sm tracking-tight">
                      ₹{(c.loanAmount / 100000).toFixed(1)}L
                    </td>
                    <td className="px-8 py-6 text-center">
                       <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-black ${
                         c.score >= 70 ? 'bg-green-500/10 text-green-500 shadow-xl shadow-green-500/5' :
                         c.score >= 40 ? 'bg-amber-500/10 text-amber-500' :
                         'bg-red-500/10 text-red-500'
                       }`}>
                          <Flame size={12} fill={c.score >= 70 ? "currentColor" : "none"} />
                          {c.score || 0}%
                       </div>
                    </td>
                    <td className="px-8 py-6">
                      <select 
                        value={c.status}
                        onChange={(e) => updateStatus(c._id, e.target.value)}
                        className={`text-[9px] font-black px-4 py-1.5 rounded-xl border-2 outline-none cursor-pointer tracking-widest uppercase transition-all shadow-sm hover:scale-105 active:scale-95 ${statusMap[c.status]?.color}`}
                      >
                        {Object.keys(statusMap).map(key => (
                          <option key={key} value={key} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">{statusMap[key].label}</option>
                        ))}
                      </select>
                    </td>
                    <td className="px-8 py-6 text-right">
                       <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all transform group-hover:translate-x-0 translate-x-4">
                          <button 
                            onClick={() => {
                              setSelectedCust(c);
                              setIsEditOpen(true);
                            }}
                            className="p-2.5 text-slate-400 hover:text-primary-600 hover:bg-primary-500/5 rounded-xl transition-all"
                            title="Refine Intelligence"
                          >
                            <Pencil size={18} strokeWidth={3} />
                          </button>
                          {(user?.role === 'manager' || user?.role === 'admin') && (
                            <button 
                              onClick={() => setDeleteConfirm(c._id)}
                              className="p-2.5 text-slate-400 hover:text-red-600 hover:bg-red-500/5 rounded-xl transition-all"
                              title="Revoke Lead"
                            >
                              <Trash2 size={18} strokeWidth={3} />
                            </button>
                          )}
                       </div>
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
