import React, { useState, useEffect } from 'react';
import { X, Save, Loader2, IndianRupee, TrendingUp, User, Building, Briefcase } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../utils/api';

const EditLeadModal = ({ isOpen, onClose, customer, onUpdate }) => {
  const [formData, setFormData] = useState({
    name: '',
    businessType: '',
    loanAmount: '',
    turnover: '',
    annualIncome: '',
    existingEmis: '',
    notes: ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (customer) {
      setFormData({
        name: customer.name || '',
        businessType: customer.businessType || 'proprietor',
        loanAmount: customer.loanAmount || '',
        turnover: customer.turnover || '',
        annualIncome: customer.annualIncome || '',
        existingEmis: customer.existingEmis || '',
        notes: customer.notes || ''
      });
    }
  }, [customer]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.put(`/api/customers/${customer._id}`, formData);
      onUpdate(res.data);
      onClose();
    } catch (err) {
      console.error('Error updating lead:', err);
    } finally {
      setLoading(false);
    }
  };

  const businessTypes = [
    { id: 'proprietor', name: 'Proprietor', icon: User },
    { id: 'pvt_ltd', name: 'Pvt Ltd', icon: Building },
    { id: 'llp', name: 'LLP', icon: Briefcase },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-end">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm"
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="relative w-full max-w-xl h-full glass-card border-l border-white/20 dark:border-white/10 shadow-2xl overflow-y-auto custom-scrollbar"
          >
            <div className="sticky top-0 z-20 glass px-8 py-8 border-b border-white/20 dark:border-white/10 flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter">Edit Application</h2>
                <p className="text-[10px] font-black text-primary-500 uppercase tracking-[0.2em] mt-2">Intelligence ID: {customer?._id?.toUpperCase().slice(-8)}</p>
              </div>
              <button 
                onClick={onClose}
                className="p-3 rounded-2xl bg-slate-900/5 dark:bg-white/5 text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all active:scale-90"
              >
                <X size={20} strokeWidth={3} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-10 pb-32 relative">
              <div className="absolute top-0 left-0 w-64 h-64 bg-primary-500/5 rounded-full blur-[100px] pointer-events-none"></div>
              
              <div className="space-y-4 relative z-10">
                <label className="block text-[11px] font-black text-slate-900/60 dark:text-white/60 uppercase tracking-[0.2em]">Customer / Entity Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-white/50 dark:bg-slate-900/40 border border-slate-200 dark:border-white/10 px-6 py-4 rounded-2xl outline-none focus:ring-4 focus:ring-primary-500/10 font-black text-slate-900 dark:text-white transition-all shadow-sm"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-10 relative z-10">
                <div className="space-y-4">
                  <label className="block text-[11px] font-black text-slate-900/60 dark:text-white/60 uppercase tracking-[0.2em]">Business Structure</label>
                  <div className="grid grid-cols-1 gap-2.5">
                    {businessTypes.map((type) => (
                      <button
                        key={type.id}
                        type="button"
                        onClick={() => setFormData({ ...formData, businessType: type.id })}
                        className={`p-4 rounded-2xl border-2 flex items-center gap-4 transition-all ${
                          formData.businessType === type.id
                            ? 'bg-primary-600 border-primary-600 text-white shadow-xl shadow-primary-500/20 scale-[1.02]'
                            : 'bg-white/50 dark:bg-slate-900/40 border-transparent text-slate-500 dark:text-slate-400 hover:bg-white/80 dark:hover:bg-slate-900/60'
                        }`}
                      >
                        <type.icon size={18} />
                        <span className="text-[11px] font-black uppercase tracking-widest">{type.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
                <div className="space-y-8">
                  <div className="space-y-4">
                    <label className="block text-[11px] font-black text-slate-900/60 dark:text-white/60 uppercase tracking-[0.2em]">Loan Amount</label>
                    <div className="relative">
                      <IndianRupee className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={18} strokeWidth={2.5} />
                      <input
                        type="number"
                        required
                        value={formData.loanAmount}
                        onChange={(e) => setFormData({ ...formData, loanAmount: e.target.value })}
                        className="w-full bg-white/50 dark:bg-slate-900/40 border border-slate-200 dark:border-white/10 pl-12 pr-6 py-4 rounded-2xl outline-none focus:ring-4 focus:ring-primary-500/10 font-black text-slate-900 dark:text-white transition-all shadow-sm"
                      />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <label className="block text-[11px] font-black text-slate-900/60 dark:text-white/60 uppercase tracking-[0.2em]">Annual Turnover</label>
                    <div className="relative">
                      <TrendingUp className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={18} strokeWidth={2.5} />
                      <input
                        type="number"
                        value={formData.turnover}
                        onChange={(e) => setFormData({ ...formData, turnover: e.target.value })}
                        className="w-full bg-white/50 dark:bg-slate-900/40 border border-slate-200 dark:border-white/10 pl-12 pr-6 py-4 rounded-2xl outline-none focus:ring-4 focus:ring-primary-500/10 font-black text-slate-900 dark:text-white transition-all shadow-sm"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-10 relative z-10">
                <div className="space-y-4">
                  <label className="block text-[11px] font-black text-slate-900/60 dark:text-white/60 uppercase tracking-[0.2em]">Annual Income</label>
                  <input
                    type="number"
                    value={formData.annualIncome}
                    onChange={(e) => setFormData({ ...formData, annualIncome: e.target.value })}
                    className="w-full bg-white/50 dark:bg-slate-900/40 border border-slate-200 dark:border-white/10 px-6 py-4 rounded-2xl outline-none focus:ring-4 focus:ring-primary-500/10 font-black text-slate-900 dark:text-white transition-all shadow-sm"
                  />
                </div>
                <div className="space-y-4">
                  <label className="block text-[11px] font-black text-slate-900/60 dark:text-white/60 uppercase tracking-[0.2em]">Existing EMIs</label>
                  <input
                    type="number"
                    value={formData.existingEmis}
                    onChange={(e) => setFormData({ ...formData, existingEmis: e.target.value })}
                    className="w-full bg-white/50 dark:bg-slate-900/40 border border-slate-200 dark:border-white/10 px-6 py-4 rounded-2xl outline-none focus:ring-4 focus:ring-primary-500/10 font-black text-slate-900 dark:text-white transition-all shadow-sm"
                  />
                </div>
              </div>

              <div className="space-y-4 relative z-10">
                <label className="block text-[11px] font-black text-slate-900/60 dark:text-white/60 uppercase tracking-[0.2em]">Strategic Intelligence Notes</label>
                <textarea
                  rows="4"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full bg-white/50 dark:bg-slate-900/40 border border-slate-200 dark:border-white/10 px-6 py-4 rounded-2xl outline-none focus:ring-4 focus:ring-primary-500/10 font-black text-slate-900 dark:text-white transition-all resize-none shadow-sm placeholder:text-slate-400"
                  placeholder="Intelligence notes..."
                />
              </div>
            </form>

            <div className="fixed bottom-0 right-0 w-full max-w-xl glass px-8 py-8 border-t border-white/20 dark:border-white/10 flex gap-4 z-30">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-4.5 bg-slate-900/5 dark:bg-white/5 text-slate-600 dark:text-white/60 font-black rounded-2xl hover:bg-slate-900/10 transition-all uppercase tracking-[0.2em] text-[10px]"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="flex-[2] py-4.5 bg-primary-600 text-white font-black rounded-2xl hover:bg-primary-700 transition-all shadow-2xl shadow-primary-500/20 flex items-center justify-center gap-3 active:scale-[0.98] disabled:opacity-50 uppercase tracking-[0.2em] text-[10px]"
              >
                {loading ? <Loader2 className="animate-spin" /> : <><Save size={18} strokeWidth={2.5} /> Update Lead Intelligence</>}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default EditLeadModal;
