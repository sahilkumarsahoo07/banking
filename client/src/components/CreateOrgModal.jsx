import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Building2, Sparkles, Copy, CheckCircle2, Loader2, ArrowRight } from 'lucide-react';
import api from '../utils/api';
import useAuthStore from '../store/useAuthStore';

const CreateOrgModal = ({ isOpen, onComplete }) => {
  const [step, setStep] = useState('form'); // 'form' | 'success'
  const [orgName, setOrgName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [orgData, setOrgData] = useState(null);
  const [copied, setCopied] = useState(false);
  const { user, token, setUser } = useAuthStore();

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!orgName.trim()) return;
    setLoading(true);
    setError('');
    try {
      const res = await api.post('/api/org/create', { name: orgName });
      setOrgData(res.data);
      // Update user in store to reflect orgId
      const updatedUser = { ...user, orgId: res.data.org._id, requiresOrgSetup: false };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      useAuthStore.setState({ user: updatedUser });
      setStep('success');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create organization');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(orgData?.code || '');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="absolute inset-0 bg-slate-950/60 backdrop-blur-md"
      />
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ type: 'spring', damping: 20, stiffness: 200 }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="glass-card rounded-[2.5rem] p-10 border border-white/30 shadow-2xl">
          <AnimatePresence mode="wait">
            {step === 'form' && (
              <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                {/* Header */}
                <div className="w-16 h-16 bg-primary-600 rounded-[1.5rem] flex items-center justify-center mb-8 shadow-xl shadow-primary-500/30">
                  <Building2 size={32} className="text-white" />
                </div>
                <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter mb-2">
                  Create Your Organization
                </h2>
                <p className="text-sm text-slate-500 font-medium mb-10">
                  Set up your workspace. Your team will use the generated code to join.
                </p>

                {error && (
                  <div className="mb-6 p-4 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-600 text-xs font-bold rounded-2xl">
                    {error}
                  </div>
                )}

                <form onSubmit={handleCreate} className="space-y-6">
                  <div className="space-y-2">
                    <label className="block text-[11px] font-black text-slate-900/60 dark:text-white/60 uppercase tracking-[0.2em]">
                      Organization Name
                    </label>
                    <input
                      type="text"
                      required
                      value={orgName}
                      onChange={(e) => setOrgName(e.target.value)}
                      placeholder="e.g. HPN Finance Pvt Ltd"
                      className="w-full bg-white/60 dark:bg-slate-900/40 border border-slate-200 dark:border-white/10 px-6 py-4 rounded-2xl outline-none focus:ring-4 focus:ring-primary-500/10 font-black text-slate-900 dark:text-white transition-all placeholder:text-slate-400"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={loading || !orgName.trim()}
                    className="w-full bg-primary-600 text-white font-black py-4 rounded-2xl flex items-center justify-center gap-3 hover:bg-primary-700 transition-all shadow-2xl shadow-primary-500/20 active:scale-[0.98] disabled:opacity-50 uppercase tracking-widest text-xs"
                  >
                    {loading ? <Loader2 className="animate-spin" /> : <><Sparkles size={18} /> Generate Org Code</>}
                  </button>
                </form>
              </motion.div>
            )}

            {step === 'success' && orgData && (
              <motion.div key="success" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center">
                <div className="w-20 h-20 bg-green-500 rounded-[1.5rem] flex items-center justify-center mb-8 mx-auto shadow-xl shadow-green-500/30">
                  <CheckCircle2 size={40} className="text-white" />
                </div>
                <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter mb-2">
                  {orgData.org.name}
                </h2>
                <p className="text-sm text-slate-500 mb-10">Your organization is live. Share this code with your team.</p>

                {/* Org Code Display */}
                <div className="bg-primary-500/5 border-2 border-dashed border-primary-500/30 rounded-3xl p-8 mb-8">
                  <p className="text-[10px] font-black text-primary-500 uppercase tracking-[0.3em] mb-3">Your Org Code</p>
                  <div className="text-5xl font-black text-primary-600 dark:text-primary-400 tracking-[0.3em] mb-6">
                    {orgData.code}
                  </div>
                  <button
                    onClick={handleCopy}
                    className="flex items-center gap-2 mx-auto text-xs font-black text-primary-600 hover:text-primary-700 uppercase tracking-widest transition-colors"
                  >
                    {copied ? <CheckCircle2 size={16} /> : <Copy size={16} />}
                    {copied ? 'Copied!' : 'Copy Code'}
                  </button>
                </div>

                <p className="text-xs text-slate-400 mb-8">
                  Sales team members must enter this code when creating their account.
                </p>

                <button
                  onClick={onComplete}
                  className="w-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-black py-4 rounded-2xl flex items-center justify-center gap-3 hover:opacity-90 transition-all active:scale-[0.98] uppercase tracking-widest text-xs"
                >
                  Enter Dashboard <ArrowRight size={18} />
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};

export default CreateOrgModal;
