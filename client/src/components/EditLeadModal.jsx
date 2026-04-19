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
            className="relative w-full max-w-xl h-full glass-card border-l border-white/20 dark:border-white/5 shadow-2xl overflow-y-auto custom-scrollbar"
          >
            <div className="sticky top-0 z-20 glass px-8 py-6 border-b border-white/10 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Edit Application</h2>
                <p className="text-[10px] font-black text-primary-500 uppercase tracking-widest mt-1">Lead ID: {customer?._id?.slice(-8)}</p>
              </div>
              <button 
                onClick={onClose}
                className="p-2.5 rounded-2xl hover:bg-slate-900/5 dark:hover:bg-white/5 text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X size={20} strokeWidth={3} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-8 pb-32">
              <div className="space-y-4">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">Customer / Entity Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-slate-900/5 dark:bg-white/5 border border-slate-200 dark:border-white/10 px-6 py-4 rounded-2xl outline-none focus:ring-4 focus:ring-primary-500/10 font-bold dark:text-white transition-all"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">Business Structure</label>
                  <div className="grid grid-cols-1 gap-2">
                    {businessTypes.map((type) => (
                      <button
                        key={type.id}
                        type="button"
                        onClick={() => setFormData({ ...formData, businessType: type.id })}
                        className={`p-3 rounded-xl border-2 flex items-center gap-3 transition-all ${
                          formData.businessType === type.id
                            ? 'bg-primary-600 border-primary-600 text-white shadow-lg shadow-primary-500/20'
                            : 'bg-slate-900/5 dark:bg-white/5 border-transparent text-slate-500 hover:bg-slate-900/10'
                        }`}
                      >
                        <type.icon size={16} />
                        <span className="text-[10px] font-black uppercase tracking-tight">{type.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
                <div className="space-y-6">
                  <div className="space-y-4">
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">Loan Amount</label>
                    <div className="relative">
                      <IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                      <input
                        type="number"
                        required
                        value={formData.loanAmount}
                        onChange={(e) => setFormData({ ...formData, loanAmount: e.target.value })}
                        className="w-full bg-slate-900/5 dark:bg-white/5 border border-slate-200 dark:border-white/10 pl-10 pr-4 py-3 rounded-xl outline-none focus:ring-4 focus:ring-primary-500/10 font-bold dark:text-white transition-all shadow-sm"
                      />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">Annual Turnover</label>
                    <div className="relative">
                      <TrendingUp className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                      <input
                        type="number"
                        value={formData.turnover}
                        onChange={(e) => setFormData({ ...formData, turnover: e.target.value })}
                        className="w-full bg-slate-900/5 dark:bg-white/5 border border-slate-200 dark:border-white/10 pl-10 pr-4 py-3 rounded-xl outline-none focus:ring-4 focus:ring-primary-500/10 font-bold dark:text-white transition-all shadow-sm"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-4">
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">Annual Income</label>
                  <input
                    type="number"
                    value={formData.annualIncome}
                    onChange={(e) => setFormData({ ...formData, annualIncome: e.target.value })}
                    className="w-full bg-slate-900/5 dark:bg-white/5 border border-slate-200 dark:border-white/10 px-4 py-3 rounded-xl outline-none focus:ring-4 focus:ring-primary-500/10 font-bold dark:text-white transition-all"
                  />
                </div>
                <div className="space-y-4">
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">Existing EMIs</label>
                  <input
                    type="number"
                    value={formData.existingEmis}
                    onChange={(e) => setFormData({ ...formData, existingEmis: e.target.value })}
                    className="w-full bg-slate-900/5 dark:bg-white/5 border border-slate-200 dark:border-white/10 px-4 py-3 rounded-xl outline-none focus:ring-4 focus:ring-primary-500/10 font-bold dark:text-white transition-all"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">Strategic Notes</label>
                <textarea
                  rows="4"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full bg-slate-900/5 dark:bg-white/5 border border-slate-200 dark:border-white/10 px-6 py-4 rounded-2xl outline-none focus:ring-4 focus:ring-primary-500/10 font-bold dark:text-white transition-all resize-none shadow-sm"
                  placeholder="Intelligence notes..."
                />
              </div>
            </form>

            <div className="fixed bottom-0 right-0 w-full max-w-xl glass p-8 border-t border-white/10 flex gap-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-4 bg-slate-900/5 dark:bg-white/5 text-slate-600 dark:text-white font-black rounded-2xl hover:bg-slate-900/10 transition-all uppercase tracking-widest text-[11px]"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="flex-[2] py-4 bg-primary-600 text-white font-black rounded-2xl hover:bg-primary-700 transition-all shadow-2xl shadow-primary-500/20 flex items-center justify-center gap-3 active:scale-[0.98] disabled:opacity-50 uppercase tracking-widest text-[11px]"
              >
                {loading ? <Loader2 className="animate-spin" /> : <><Save size={18} /> Update Lead</>}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default EditLeadModal;
