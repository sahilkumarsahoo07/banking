import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import useAuthStore from '../store/useAuthStore';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users,
  UserCheck,
  UserX,
  Shield,
  BarChart4,
  CheckCircle2,
  XCircle,
  Loader2,
  Smartphone,
  Clock,
  Trash2,
  Crown,
  Monitor
} from 'lucide-react';

const AdminPanel = () => {
  const [users, setUsers] = useState([]);
  const [devices, setDevices] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('users');
  const { token } = useAuthStore();

  const fetchData = async () => {
    try {
      const [usersRes, statsRes, devicesRes] = await Promise.all([
        api.get('/api/admin/users'),
        api.get('/api/admin/stats'),
        api.get('/api/auth/devices'),
      ]);
      setUsers(usersRes.data);
      setStats(statsRes.data);
      setDevices(devicesRes.data);
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

  const handleApproveDevice = async (userId, deviceId) => {
    try {
      await api.patch(`/api/auth/devices/${userId}/${deviceId}/approve`);
      fetchData();
    } catch (err) {
      console.error('Error approving device:', err);
    }
  };

  const handleRevokeDevice = async (userId, deviceId) => {
    try {
      await api.delete(`/api/auth/devices/${userId}/${deviceId}`);
      fetchData();
    } catch (err) {
      console.error('Error revoking device:', err);
    }
  };

  const handleUpgradeSubscription = async (userId, tier) => {
    const maxMap = { free: 2, pro: 5, enterprise: 10 };
    try {
      await api.patch(`/api/auth/users/${userId}/subscription`, {
        subscriptionTier: tier,
        maxDevices: maxMap[tier]
      });
      fetchData();
    } catch (err) {
      console.error('Error upgrading subscription:', err);
    }
  };

  const pendingDevicesCount = devices.reduce((acc, u) =>
    acc + u.devices.filter(d => d.status === 'pending').length, 0);

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

      {/* Tab Switcher */}
      <div className="flex gap-3 px-2">
        <button
          onClick={() => setActiveTab('users')}
          className={`px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${
            activeTab === 'users'
              ? 'bg-primary-600 text-white shadow-xl shadow-primary-500/20'
              : 'glass text-slate-500 dark:text-slate-400 hover:bg-white/60'
          }`}
        >
          <Users size={16} /> User Management
        </button>
        <button
          onClick={() => setActiveTab('devices')}
          className={`px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 relative ${
            activeTab === 'devices'
              ? 'bg-primary-600 text-white shadow-xl shadow-primary-500/20'
              : 'glass text-slate-500 dark:text-slate-400 hover:bg-white/60'
          }`}
        >
          <Smartphone size={16} /> Device Management
          {pendingDevicesCount > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[9px] font-black rounded-full flex items-center justify-center">
              {pendingDevicesCount}
            </span>
          )}
        </button>
      </div>

      <AnimatePresence mode="wait">
      {activeTab === 'users' && (
      <motion.div key="users" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
        className="glass rounded-[2.5rem] overflow-hidden border border-white/40 dark:border-white/10 shadow-2xl shadow-slate-900/5 dark:shadow-black/20">
        <div className="p-8 border-b border-slate-200/50 dark:border-white/5 flex items-center gap-4">
          <div className="w-12 h-12 icon-glow-primary rounded-2xl flex items-center justify-center">
            <Users size={24} strokeWidth={2.5} />
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-900 dark:text-white">Identity Management</h2>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Global access hierarchy</p>
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
                        <button onClick={() => handleApproval(u._id, 'approved')} className="p-3 bg-green-500 text-white rounded-2xl hover:bg-green-600 transition-all shadow-lg shadow-green-500/20 active:scale-90" title="Grant Access"><UserCheck size={18} strokeWidth={2.5} /></button>
                        <button onClick={() => handleApproval(u._id, 'rejected')} className="p-3 bg-red-500 text-white rounded-2xl hover:bg-red-600 transition-all shadow-lg shadow-red-500/20 active:scale-90" title="Deny Access"><UserX size={18} strokeWidth={2.5} /></button>
                      </div>
                    )}
                    {u.status === 'approved' && u.role !== 'admin' && (
                      <button onClick={() => handleApproval(u._id, 'rejected')} className="text-[10px] font-black text-red-500 hover:text-red-600 uppercase tracking-widest transition-colors">Revoke Clearance</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
      )}

      {activeTab === 'devices' && (
      <motion.div key="devices" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
        className="space-y-4">
        {devices.length === 0 ? (
          <div className="glass rounded-[2.5rem] p-12 text-center text-slate-400 font-black text-[10px] uppercase tracking-widest border border-white/40 dark:border-white/10">
            No devices registered yet.
          </div>
        ) : devices.map((u) => (
          <div key={u.userId} className="glass rounded-[2rem] overflow-hidden border border-white/40 dark:border-white/10 shadow-xl shadow-slate-900/5 dark:shadow-black/20">
            <div className="px-8 py-5 border-b border-slate-200/50 dark:border-white/5 flex items-center justify-between">
              <div>
                <p className="text-sm font-black text-slate-900 dark:text-white">{u.userName}</p>
                <p className="text-xs text-slate-400">{u.userEmail}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{u.devices.filter(d => d.status === 'approved').length}/{u.maxDevices} devices</span>
                <select
                  value={u.subscriptionTier || 'free'}
                  onChange={(e) => handleUpgradeSubscription(u.userId, e.target.value)}
                  className="text-[9px] font-black px-3 py-1.5 rounded-xl border-2 border-transparent bg-primary-500/10 text-primary-600 dark:text-primary-400 outline-none cursor-pointer uppercase tracking-widest"
                >
                  <option value="free">Free (2 Devices)</option>
                  <option value="pro">Pro (5 Devices)</option>
                  <option value="enterprise">Enterprise (10 Devices)</option>
                </select>
              </div>
            </div>
            <div className="divide-y divide-slate-200/50 dark:divide-white/5">
              {u.devices.length === 0 ? (
                <p className="px-8 py-4 text-xs text-slate-400 italic">No devices registered.</p>
              ) : u.devices.map((d) => (
                <div key={d._id} className="px-8 py-4 flex items-center justify-between group hover:bg-slate-900/5 dark:hover:bg-white/5 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${
                      d.status === 'approved' ? 'bg-green-500/10 text-green-500' :
                      d.status === 'pending' ? 'bg-amber-500/10 text-amber-500' :
                      'bg-red-500/10 text-red-500'
                    }`}>
                      {d.isPrimary ? <Monitor size={18} /> : <Smartphone size={18} />}
                    </div>
                    <div>
                      <p className="text-xs font-black text-slate-900 dark:text-white">{d.deviceName}</p>
                      <p className="text-[10px] text-slate-400">Last used: {new Date(d.lastUsed).toLocaleDateString()}</p>
                    </div>
                    <span className={`text-[9px] font-black px-2.5 py-1 rounded-lg uppercase tracking-widest ${
                      d.status === 'approved' ? 'bg-green-500/10 text-green-600' :
                      d.status === 'pending' ? 'bg-amber-500/10 text-amber-600 animate-pulse' :
                      'bg-red-500/10 text-red-600'
                    }`}>
                      {d.status}{d.isPrimary ? ' · Primary' : ''}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all">
                    {d.status === 'pending' && (
                      <button onClick={() => handleApproveDevice(u.userId, d._id)} className="p-2 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-all shadow-lg shadow-green-500/20 active:scale-90" title="Approve"><UserCheck size={16} /></button>
                    )}
                    <button onClick={() => handleRevokeDevice(u.userId, d._id)} className="p-2 bg-red-500/10 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all active:scale-90" title="Revoke Device"><Trash2 size={16} /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </motion.div>
      )}
      </AnimatePresence>
    </div>
  );
};

export default AdminPanel;
