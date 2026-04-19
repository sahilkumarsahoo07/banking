import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import useAuthStore from '../store/useAuthStore';
import { 
  Mail, 
  Lock, 
  ArrowRight, 
  Loader2, 
  ShieldCheck,
  Layers,
  Zap,
  LockKeyhole,
  CheckCircle2,
  Smartphone,
  Clock
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const LoginPage = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [rememberMe, setRememberMe] = useState(false);
  const [deviceError, setDeviceError] = useState(null);
  const { login, loading, error } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setDeviceError(null);
    const result = await login(formData.email, formData.password, rememberMe);
    if (result.success) {
      navigate('/dashboard');
    } else if (result.code === 'DEVICE_LIMIT_REACHED' || result.code === 'DEVICE_PENDING') {
      setDeviceError({ message: result.message, code: result.code });
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-page-bg">
      {/* Left Column: Visual/SaaS Branding */}
      <div className="hidden lg:flex flex-col justify-between p-16 bg-gradient-to-br from-primary-950 via-primary-900 to-indigo-950 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary-500 rounded-full blur-3xl opacity-20 -mr-24 -mt-24"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500 rounded-full blur-3xl opacity-20 -ml-12 -mb-12"></div>
        
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-12 h-12 bg-white/10 backdrop-blur-xl rounded-2xl flex items-center justify-center rotate-3 border border-white/20">
            <Layers className="text-primary-400" size={28} />
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tight uppercase">Bank<span className="text-primary-400">Core</span></h1>
            <p className="text-[10px] font-bold text-primary-300 tracking-[0.2em] -mt-1 uppercase">SaaS Enterprise</p>
          </div>
        </div>

        <div className="relative z-10 max-w-lg">
           <motion.div
             initial={{ opacity: 0, x: -20 }}
             animate={{ opacity: 1, x: 0 }}
             transition={{ duration: 0.8 }}
           >
              <h2 className="text-6xl font-black leading-[1.1] tracking-tighter mb-8 italic">
                Secure <span className="text-primary-400">Banking</span> Assets In Real-Time.
              </h2>
              <p className="text-lg text-primary-200/80 font-medium leading-relaxed">
                Experience the next generation of loan management. Streamline lead generation, automate documentation, and accelerate disbursements with BankCore's cloud platform.
              </p>
           </motion.div>

           <div className="mt-12 flex gap-12 border-t border-white/10 pt-12 text-slate-100">
              <div className="space-y-1">
                 <p className="text-3xl font-black">99.9%</p>
                 <p className="text-xs font-bold text-primary-400 uppercase tracking-widest">Uptime SLA</p>
              </div>
              <div className="space-y-1">
                 <p className="text-3xl font-black">1.2s</p>
                 <p className="text-xs font-bold text-primary-400 uppercase tracking-widest">Disbursement Avg</p>
              </div>
           </div>
        </div>

        <div className="relative z-10">
           <p className="text-sm font-bold text-primary-400 uppercase tracking-[0.2em]">© 2026 BankCore Enterprise Solutions</p>
        </div>
      </div>

      {/* Right Column: Login Form */}
      <div className="flex flex-col items-center justify-center p-8 lg:p-24 bg-white dark:bg-slate-950">
        <div className="w-full max-w-md space-y-10">
          <div className="lg:hidden text-center mb-12">
             <div className="inline-flex items-center gap-3">
                <div className="w-10 h-10 bg-primary-600 rounded-2xl flex items-center justify-center rotate-3">
                  <Layers className="text-white" size={24} />
                </div>
                <h1 className="text-xl font-black text-slate-900 tracking-tight uppercase">Bank<span className="text-primary-500">Core</span></h1>
             </div>
          </div>

          <div>
            <h2 className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">Access Control</h2>
            <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium">Verify your credentials to manage the portfolio.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <AnimatePresence>
              {deviceError && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className={`p-4 rounded-2xl border flex items-start gap-3 ${
                    deviceError.code === 'DEVICE_LIMIT_REACHED'
                      ? 'bg-amber-50 dark:bg-amber-500/10 border-amber-200 dark:border-amber-500/20 text-amber-700 dark:text-amber-400'
                      : 'bg-blue-50 dark:bg-blue-500/10 border-blue-200 dark:border-blue-500/20 text-blue-700 dark:text-blue-400'
                  }`}
                >
                  {deviceError.code === 'DEVICE_LIMIT_REACHED'
                    ? <Smartphone size={20} className="shrink-0 mt-0.5" />
                    : <Clock size={20} className="shrink-0 mt-0.5" />
                  }
                  <div>
                    <p className="text-xs font-black uppercase tracking-widest mb-1">
                      {deviceError.code === 'DEVICE_LIMIT_REACHED' ? 'Device Limit Reached' : 'Awaiting Approval'}
                    </p>
                    <p className="text-xs font-medium">{deviceError.message}</p>
                  </div>
                </motion.div>
              )}
              {error && !deviceError && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="p-4 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-400 text-sm font-bold rounded-2xl"
                >
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Email Address</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-500 transition-colors" size={20} />
                <input 
                  type="email"
                  required
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 pl-12 pr-4 py-4 rounded-3xl outline-none focus:ring-2 focus:ring-primary-500 transition-all dark:text-white"
                  placeholder="name@company.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Security Password</label>
              <div className="relative group">
                <LockKeyhole className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-500 transition-colors" size={20} />
                <input 
                  type="password" 
                  required
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 pl-12 pr-4 py-4 rounded-3xl outline-none focus:ring-2 focus:ring-primary-500 transition-all dark:text-white"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
               <label className="group flex items-center gap-3 cursor-pointer">
                  <div className="relative">
                    <input 
                      type="checkbox" 
                      className="peer sr-only"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                    />
                    <div className="w-6 h-6 rounded-lg border-2 border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 transition-all peer-checked:bg-primary-500 peer-checked:border-primary-500 flex items-center justify-center peer-checked:[&_svg]:opacity-100">
                       <CheckCircle2 size={14} className="text-white opacity-0 transition-opacity" strokeWidth={3} />
                    </div>
                  </div>
                  <span className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest group-hover:text-primary-500 transition-colors">Keep me signed in</span>
               </label>
               <Link to="#" className="text-[10px] font-black text-primary-600 hover:text-primary-700 uppercase tracking-widest transition-colors">Lost password?</Link>
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-primary-600 text-white font-black py-5 rounded-3xl flex items-center justify-center gap-3 hover:bg-primary-700 transition-all shadow-2xl shadow-primary-500/20 active:scale-[0.98] disabled:opacity-50 uppercase tracking-widest text-xs"
            >
              {loading ? <Loader2 className="animate-spin" /> : <><ShieldCheck size={24} /> Authenticate Access</>}
            </button>
          </form>

          <div className="pt-6 text-center">
            <p className="text-slate-500 dark:text-slate-400 font-medium">
              Dont have clearance? <Link to="/register" className="text-primary-600 font-black hover:underline underline-offset-4 decoration-2">Register for access</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
