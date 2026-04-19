import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { 
  User, 
  Mail, 
  Lock, 
  ShieldCheck, 
  Loader2, 
  Briefcase,
  Layers,
  ArrowRight,
  ShieldPlus
} from 'lucide-react';
import { motion } from 'framer-motion';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'customer'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await axios.post('http://localhost:5000/api/auth/register', formData);
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
      setLoading(false);
    }
  };

  const roles = [
    { id: 'customer', name: 'Customer', desc: 'Manage your portfolio' },
    { id: 'sales_rep', name: 'Sales Rep', desc: 'Submit and track leads' },
    { id: 'manager', name: 'Manager', desc: 'Oversee team activity' },
  ];

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-page-bg">
      {/* Left Column: Register Branding */}
      <div className="hidden lg:flex flex-col justify-between p-16 bg-gradient-to-tr from-indigo-950 via-slate-900 to-primary-950 text-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-96 h-96 bg-primary-600 rounded-full blur-3xl opacity-20 -ml-24 -mt-24"></div>
        
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-12 h-12 bg-white/10 backdrop-blur-xl rounded-2xl flex items-center justify-center rotate-3 border border-white/20">
            <Layers className="text-primary-400" size={28} />
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tight uppercase">Bank<span className="text-primary-400">Core</span></h1>
          </div>
        </div>

        <div className="relative z-10">
           <motion.div
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.8 }}
           >
              <p className="text-primary-400 font-bold uppercase tracking-widest text-xs mb-4">Enterprise Onboarding</p>
              <h2 className="text-6xl font-black leading-none tracking-tighter mb-8">
                Join the <span className="text-primary-400">Future</span> of Finance.
              </h2>
              <p className="text-lg text-slate-300 font-medium leading-relaxed max-w-md">
                Register as a customer, representative, or manager to begin leveraging our automated loan ecosystem. High efficiency, zero friction.
              </p>
           </motion.div>
        </div>

        <div className="relative z-10">
           <div className="flex -space-x-4 mb-6">
              {[1,2,3,4].map(i => (
                <div key={i} className="w-10 h-10 rounded-full border-2 border-slate-900 bg-slate-800 flex items-center justify-center text-xs font-bold text-slate-400">
                  {i}
                </div>
              ))}
              <div className="w-10 h-10 rounded-full border-2 border-slate-900 bg-primary-600 flex items-center justify-center text-xs font-bold text-white">
                +2k
              </div>
           </div>
           <p className="text-xs font-bold text-slate-400 tracking-wider">THOUSANDS OF ENTITIES ALREADY ONBOARDED</p>
        </div>
      </div>

      {/* Right Column: Register Form */}
      <div className="flex flex-col items-center justify-center p-8 lg:p-20 bg-white dark:bg-slate-950 overflow-y-auto">
        <div className="w-full max-w-md space-y-8">
          <div>
            <h2 className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-none">Create Account</h2>
            <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium">Define your role to personalize your workspace.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-4 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-400 text-sm font-bold rounded-2xl">
                {error}
              </div>
            )}

            <div className="space-y-4">
              <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Select Access Tier</label>
              <div className="grid grid-cols-1 gap-3">
                 {roles.map((r) => (
                    <button
                      key={r.id}
                      type="button"
                      onClick={() => setFormData({ ...formData, role: r.id })}
                      className={`flex items-center gap-4 p-4 rounded-3xl border-2 transition-all ${
                        formData.role === r.id 
                          ? 'bg-primary-50 dark:bg-primary-900/10 border-primary-500 ring-4 ring-primary-500/10' 
                          : 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800'
                      }`}
                    >
                      <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${
                         formData.role === r.id ? 'bg-primary-500 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                      }`}>
                         {r.id === 'customer' ? <User size={20} /> : r.id === 'sales_rep' ? <Briefcase size={20} /> : <ShieldCheck size={20} />}
                      </div>
                      <div className="text-left">
                        <p className={`text-sm font-black ${formData.role === r.id ? 'text-primary-600 dark:text-primary-400' : 'text-slate-700 dark:text-slate-200'}`}>
                          {r.name}
                        </p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter leading-none mt-0.5">{r.desc}</p>
                      </div>
                    </button>
                 ))}
              </div>
            </div>

            <div className="space-y-4">
               <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-2">Full Identity</label>
                  <div className="relative group">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input 
                      type="text"
                      required
                      className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 pl-12 pr-4 py-3.5 rounded-3xl outline-none focus:ring-2 focus:ring-primary-500 transition-all dark:text-white"
                      placeholder="e.g. Samuel Sahoo"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>
               </div>

               <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-2">Enterprise Email</label>
                  <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input 
                      type="email"
                      required
                      className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 pl-12 pr-4 py-3.5 rounded-3xl outline-none focus:ring-2 focus:ring-primary-500 transition-all dark:text-white"
                      placeholder="name@company.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>
               </div>

               <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-2">Secure Passphrase</label>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input 
                      type="password"
                      required
                      className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 pl-12 pr-4 py-3.5 rounded-3xl outline-none focus:ring-2 focus:ring-primary-500 transition-all dark:text-white"
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    />
                  </div>
               </div>
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-primary-600 text-white font-black py-4 rounded-3xl flex items-center justify-center gap-3 hover:bg-primary-700 transition-all shadow-xl shadow-primary-500/20 active:scale-[0.98] disabled:opacity-50"
            >
              {loading ? <Loader2 className="animate-spin" /> : <><ShieldPlus size={20} /> Deploy Account</>}
            </button>
          </form>

          <p className="text-center text-slate-500 dark:text-slate-400 text-sm font-medium">
            Already authorized? <Link to="/login" className="text-primary-600 font-black hover:underline uppercase tracking-widest text-[10px]">Back to Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
