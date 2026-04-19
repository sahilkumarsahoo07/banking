import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import useAuthStore from '../store/useAuthStore';
import { motion } from 'framer-motion';
import {
  Users,
  UserCheck,
  UserX,
  Shield,
  BarChart4,
  CheckCircle2,
  XCircle,
  Loader2
} from 'lucide-react';

const AdminPanel = () => {
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const { token } = useAuthStore();

  const fetchData = async () => {
    try {
      const [usersRes, statsRes] = await Promise.all([
        api.get('/api/admin/users'),
        api.get('/api/admin/stats')
      ]);
      setUsers(usersRes.data);
      setStats(statsRes.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching admin data:', err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [token]);

  const handleApproval = async (id, status) => {
    try {
      await api.patch(`/api/admin/users/${id}/approve`, { status });
      fetchData();
    } catch (err) {
      console.error('Error updating user status:', err);
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[40vh] space-y-4">
      <Loader2 className="animate-spin text-primary-500" size={32} />
      <p className="text-sm font-black text-slate-400 uppercase tracking-widest italic font-medium">Synchronizing Secure Data...</p>
    </div>
  );

  return (
    <div className="space-y-10 pt-20 pb-12">
      <div className="px-2">
        <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">System Intelligence</h1>
        <p className="text-sm text-slate-500 font-medium mt-2">Manage enterprise accounts, audit approvals, and monitor ecosystem health.</p>
      </div>

      {stats && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="glass p-6 rounded-[2rem] border border-white/40 dark:border-white/10 shadow-xl shadow-slate-900/5 dark:shadow-black/20 relative overflow-hidden">
            <div className="absolute -right-6 -top-6 w-20 h-20 bg-primary-500/5 rounded-full blur-2xl"></div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Total Leads</p>
            <h3 className="text-3xl font-black text-slate-900 dark:text-white">{stats.totalLeads}</h3>
          </div>
          <div className="glass p-6 rounded-[2rem] border border-white/40 dark:border-white/10 shadow-xl shadow-slate-900/5 dark:shadow-black/20 relative overflow-hidden">
            <div className="absolute -right-6 -top-6 w-20 h-20 bg-indigo-500/5 rounded-full blur-2xl"></div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Total Logins</p>
            <h3 className="text-3xl font-black text-slate-900 dark:text-white">{stats.totalLogins}</h3>
          </div>
          <div className="glass p-6 rounded-[2rem] border border-white/40 dark:border-white/10 shadow-xl shadow-slate-900/5 dark:shadow-black/20 relative overflow-hidden">
            <div className="absolute -right-6 -top-6 w-20 h-20 bg-green-500/5 rounded-full blur-2xl"></div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Disbursements</p>
            <h3 className="text-3xl font-black text-slate-900 dark:text-white">{stats.totalDisbursements}</h3>
          </div>
          <motion.div
            animate={{ scale: [1, 1.02, 1] }}
            transition={{ repeat: Infinity, duration: 4 }}
            className="glass p-6 rounded-[2rem] border-primary-500/30 ring-2 ring-primary-500/10 shadow-xl shadow-primary-500/5 relative overflow-hidden"
          >
            <div className="absolute -right-6 -top-6 w-20 h-20 bg-primary-500/10 rounded-full blur-2xl"></div>
            <p className="text-[10px] font-black text-primary-500 uppercase tracking-widest mb-2">Pending Clearances</p>
            <h3 className="text-3xl font-black text-primary-600 dark:text-primary-400">{stats.pendingApprovals}</h3>
          </motion.div>
        </div>
      )}

      <div className="glass rounded-[2.5rem] overflow-hidden border border-white/40 dark:border-white/10 shadow-2xl shadow-slate-900/5 dark:shadow-black/20">
        <div className="p-8 border-b border-slate-200/50 dark:border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 icon-glow-primary rounded-2xl flex items-center justify-center">
              <Users size={24} strokeWidth={2.5} />
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-900 dark:text-white">Identity Management</h2>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Global access hierarchy</p>
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-900/5 dark:bg-white/5 text-slate-500 dark:text-slate-400 text-[10px] font-black uppercase tracking-[0.15em]">
                <th className="px-8 py-5">System Entity</th>
                <th className="px-8 py-5">Access Tier</th>
                <th className="px-8 py-5">Status</th>
                <th className="px-8 py-5 text-right">Clearance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/50 dark:divide-white/5">
              {users.map((u) => (
                <tr key={u._id} className="hover:bg-slate-900/5 dark:hover:bg-white/5 transition-colors group">
                  <td className="px-8 py-6">
                    <p className="text-sm font-black text-slate-900 dark:text-white">{u.name}</p>
                    <p className="text-xs font-medium text-slate-400">{u.email}</p>
                  </td>
                  <td className="px-8 py-6">
                    <span className="text-[10px] font-black px-3 py-1 bg-primary-500/10 text-primary-600 dark:text-primary-400 rounded-xl uppercase tracking-widest">
                      {u.role.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <span className={`text-[10px] font-black px-3 py-1 rounded-xl uppercase tracking-widest ${u.status === 'approved' ? 'bg-green-500/10 text-green-600' :
                        u.status === 'pending' ? 'bg-amber-500/10 text-amber-600' : 'bg-red-500/10 text-red-600'
                      }`}>
                      {u.status}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-right">
                    {u.status === 'pending' && (
                      <div className="flex items-center justify-end gap-3">
                        <button
                          onClick={() => handleApproval(u._id, 'approved')}
                          className="p-3 bg-green-500 text-white rounded-2xl hover:bg-green-600 transition-all shadow-lg shadow-green-500/20 active:scale-90"
                          title="Grant Access"
                        >
                          <UserCheck size={18} strokeWidth={2.5} />
                        </button>
                        <button
                          onClick={() => handleApproval(u._id, 'rejected')}
                          className="p-3 bg-red-500 text-white rounded-2xl hover:bg-red-600 transition-all shadow-lg shadow-red-500/20 active:scale-90"
                          title="Deny Access"
                        >
                          <UserX size={18} strokeWidth={2.5} />
                        </button>
                      </div>
                    )}
                    {u.status === 'approved' && u.role !== 'admin' && (
                      <button
                        onClick={() => handleApproval(u._id, 'rejected')}
                        className="text-[10px] font-black text-red-500 hover:text-red-600 uppercase tracking-widest transition-colors"
                      >
                        Revoke Clearance
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
