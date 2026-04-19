import React, { useState } from 'react';
import api from '../utils/api';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../store/useAuthStore';
import { 
  ArrowLeft, 
  User, 
  Building, 
  IndianRupee, 
  Save,
  Loader2,
  CheckCircle2,
  Briefcase,
  TrendingUp,
  FileText
} from 'lucide-react';
import { motion } from 'framer-motion';

const AddCustomer = () => {
  const [formData, setFormData] = useState({
    name: '',
    businessType: 'proprietor',
    loanAmount: '',
    turnover: '',
    notes: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const { token } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/api/customers', formData);
      setSuccess(true);
      setTimeout(() => navigate('/customers'), 2000);
    } catch (err) {
      console.error('Error adding customer:', err);
      setLoading(false);
    }
  };

  const businessTypes = [
    { id: 'proprietor', name: 'Proprietorship', icon: User },
    { id: 'pvt_ltd', name: 'Pvt Ltd', icon: Building },
    { id: 'llp', name: 'LLP', icon: Briefcase },
  ];

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="w-24 h-24 bg-green-500/20 text-green-500 rounded-[2rem] flex items-center justify-center mb-8 shadow-2xl shadow-green-500/20"
        >
          <CheckCircle2 size={48} strokeWidth={3} />
        </motion.div>
        <h2 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">Lead Secured</h2>
        <p className="text-slate-500 dark:text-slate-400 mt-3 font-medium">Successfully added to your pipeline.</p>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto space-y-8 pb-12"
    >
      <button 
        onClick={() => navigate('/customers')}
        className="flex items-center gap-2 text-sm font-black text-slate-400 hover:text-primary-600 transition-colors uppercase tracking-widest"
      >
        <ArrowLeft size={16} strokeWidth={3} />
        Return to pipeline
      </button>

      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">New Application</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium">Capture essential customer data for the loan process.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <form onSubmit={handleSubmit} className="lg:col-span-2 glass rounded-[2.5rem] p-10 space-y-8">
          <div className="space-y-4">
             <label className="block text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">Full Name / Entity</label>
             <div className="relative group">
                <input 
                  type="text"
                  required
                  className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 px-6 py-4 rounded-2xl focus:ring-2 focus:ring-primary-500 outline-none text-slate-900 dark:text-white font-bold transition-all"
                  placeholder="e.g. Acme Corporation Pvt Ltd"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
             </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
             <div className="space-y-4">
                <label className="block text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">Business Structure</label>
                <div className="grid grid-cols-3 gap-3">
                   {businessTypes.map((type) => (
                      <button
                        key={type.id}
                        type="button"
                        onClick={() => setFormData({ ...formData, businessType: type.id })}
                        className={`p-4 rounded-2xl border-2 flex flex-col items-center gap-2 transition-all ${
                          formData.businessType === type.id 
                            ? 'bg-primary-500 border-primary-500 text-white shadow-lg' 
                            : 'bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700 text-slate-400 dark:text-slate-500'
                        }`}
                      >
                        <type.icon size={20} />
                        <span className="text-[10px] font-black uppercase tracking-tighter">{type.id.replace('_', ' ')}</span>
                      </button>
                   ))}
                </div>
             </div>
             <div className="space-y-4">
                <label className="block text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">Annual Turnover</label>
                <div className="relative">
                   <input 
                     type="number"
                     required
                     className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 px-6 py-4 rounded-2xl focus:ring-2 focus:ring-primary-500 outline-none text-slate-900 dark:text-white font-bold transition-all"
                     placeholder="e.g. 50,00,000"
                     value={formData.turnover}
                     onChange={(e) => setFormData({ ...formData, turnover: e.target.value })}
                   />
                </div>
             </div>
          </div>

          <div className="space-y-4">
             <label className="block text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">Loan Amount Requested</label>
             <div className="relative">
                <IndianRupee className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input 
                  type="number"
                  required
                  className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 pl-14 pr-6 py-4 rounded-2xl focus:ring-2 focus:ring-primary-500 outline-none text-slate-900 dark:text-white font-bold transition-all"
                  placeholder="25,00,000"
                  value={formData.loanAmount}
                  onChange={(e) => setFormData({ ...formData, loanAmount: e.target.value })}
                />
             </div>
          </div>

          <div className="space-y-4">
             <label className="block text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">Additional Intelligence</label>
             <textarea 
               rows="4"
               className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 px-6 py-4 rounded-2xl focus:ring-2 focus:ring-primary-500 outline-none text-slate-900 dark:text-white font-bold transition-all resize-none"
               placeholder="Capture specific business nuances or customer preferences..."
               value={formData.notes}
               onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
             />
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full py-5 bg-primary-600 text-white font-black rounded-3xl flex items-center justify-center gap-4 hover:bg-primary-700 transition-all shadow-2xl shadow-primary-500/30 disabled:opacity-50 active:scale-95"
          >
            {loading ? <Loader2 className="animate-spin" /> : <><Save size={24} /> Submit Application</>}
          </button>
        </form>

        <div className="space-y-8">
           <div className="glass p-8 rounded-[2.5rem]">
              <div className="w-12 h-12 bg-indigo-500/10 text-indigo-500 rounded-2xl flex items-center justify-center mb-6">
                 <TrendingUp size={24} />
              </div>
              <h3 className="text-xl font-extrabold text-slate-900 dark:text-white mb-4">Quality Score</h3>
              <p className="text-sm text-slate-500 font-medium leading-relaxed">
                 Complete all fields to ensure a higher quality score. Accurate data increases disbursement speed by <span className="text-green-500 font-black">40%</span>.
              </p>
           </div>

           <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white">
              <FileBox size={32} className="text-primary-500 mb-6" />
              <h3 className="text-lg font-bold mb-4 tracking-tight">Need Support?</h3>
              <p className="text-slate-400 text-xs leading-relaxed mb-6">
                 If you encounter issues with the business structures, contact the central underwriting team.
              </p>
              <button className="w-full py-3 bg-slate-800 text-white text-xs font-black rounded-2xl hover:bg-slate-700 transition-colors uppercase tracking-widest">
                 Open Helpdesk
              </button>
           </div>
        </div>
      </div>
    </motion.div>
  );
};

export default AddCustomer;
