import React, { useState, useEffect } from 'react';
import { 
  Calculator, 
  TrendingUp, 
  UserCheck, 
  ArrowRightLeft,
  IndianRupee,
  Calendar,
  Percent,
  History,
  Info,
  Download,
  Copy,
  CheckCircle2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const CalculatorHub = () => {
  const [activeTab, setActiveTab] = useState('emi');
  const [copied, setCopied] = useState(false);

  // Common State
  const [amt, setAmt] = useState(1000000);
  const [rate, setRate] = useState(10.5);
  const [tenure, setTenure] = useState(60);

  // EMI State
  const [emi, setEmi] = useState(0);
  const [totalInterest, setTotalInterest] = useState(0);

  // Eligibility State
  const [income, setIncome] = useState(50000);
  const [existingEmi, setExistingEmi] = useState(0);
  const [foir, setFoir] = useState(50);
  const [eligibleLoan, setEligibleLoan] = useState(0);

  // Prepayment State
  const [prepayAmt, setPrepayAmt] = useState(50000);
  const [savings, setSavings] = useState({ interest: 0, months: 0 });

  // 1. EMI Calculation
  useEffect(() => {
    const r = rate / 12 / 100;
    const n = tenure;
    const calcEmi = (amt * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    setEmi(Math.round(calcEmi));
    setTotalInterest(Math.round(calcEmi * n - amt));
  }, [amt, rate, tenure]);

  // 2. Eligibility Calculation
  useEffect(() => {
    const netIncomeForEmi = (income * (foir / 100)) - existingEmi;
    const r = rate / 12 / 100;
    const n = tenure;
    // P = (EMI * [(1 + r)^n - 1]) / [r * (1 + r)^n]
    const p = (netIncomeForEmi * (Math.pow(1 + r, n) - 1)) / (r * Math.pow(1 + r, n));
    setEligibleLoan(Math.max(0, Math.round(p)));
  }, [income, existingEmi, foir, rate, tenure]);

  // 3. Prepayment Savings (Simplified estimate)
  useEffect(() => {
    const dailyInt = (rate / 365) / 100;
    // Estimated interest saved over remaining tenure (naive approach for visual)
    const estimatedInterestSaved = prepayAmt * (rate / 100) * (tenure / 12) * 0.8;
    const estimatedMonthsRed = (prepayAmt / emi);
    setSavings({ 
      interest: Math.round(estimatedInterestSaved), 
      months: Math.round(estimatedMonthsRed) 
    });
  }, [prepayAmt, emi, rate, tenure]);

  const tabs = [
    { id: 'emi', name: 'EMI Calculator', icon: Calculator },
    { id: 'eligibility', name: 'Loan Eligibility', icon: UserCheck },
    { id: 'prepay', name: 'Prepayment Impact', icon: History },
  ];

  const downloadSummary = () => {
    let content = `--- BANKCORE FINANCIAL SUMMARY ---\nDate: ${new Date().toLocaleString()}\n\n`;
    if (activeTab === 'emi') {
      content += `Loan Amount: ₹${amt.toLocaleString()}\nRate: ${rate}%\nTenure: ${tenure} Months\nEMI: ₹${emi.toLocaleString()}\nTotal Interest: ₹${totalInterest.toLocaleString()}`;
    } else if (activeTab === 'eligibility') {
      content += `Monthly Income: ₹${income.toLocaleString()}\nExisting EMIs: ₹${existingEmi.toLocaleString()}\nEligible Loan: ₹${eligibleLoan.toLocaleString()}`;
    } else {
      content += `Prepayment: ₹${prepayAmt.toLocaleString()}\nInterest Saved: ₹${savings.interest.toLocaleString()}\nTenure Reduced: ${savings.months} Months`;
    }
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `BankCore_${activeTab}_Report.txt`;
    link.click();
  };

  const copySummary = () => {
    let content = `*BANKCORE FINANCIAL SUMMARY*\nDate: ${new Date().toLocaleDateString()}\n\n`;
    if (activeTab === 'emi') {
      content += `Loan: ₹${amt.toLocaleString()}\nRate: ${rate}%\nTenure: ${tenure} Mo\nEMI: ₹${emi.toLocaleString()}\nTotal Interest: ₹${totalInterest.toLocaleString()}`;
    } else if (activeTab === 'eligibility') {
      content += `Monthly Income: ₹${income.toLocaleString()}\nEligible Loan: ₹${eligibleLoan.toLocaleString()}`;
    } else {
      content += `Prepayment: ₹${prepayAmt.toLocaleString()}\nInterest Saved: ₹${savings.interest.toLocaleString()}\nTenure Reduced: ${savings.months} Mo`;
    }
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 pb-12">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Financial Power Tools</h1>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">Enterprise Grade Decision Engines</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={copySummary}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
              copied 
                ? 'bg-green-100 text-green-600 border border-green-200' 
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            {copied ? <CheckCircle2 size={14} /> : <Copy size={14} />}
            {copied ? 'Summary Copied!' : 'Copy Summary'}
          </button>
          <button 
            onClick={downloadSummary}
            className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/10"
          >
            <Download size={14} /> Download Report
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-2 p-1.5 glass rounded-2xl w-fit">
        {tabs.map(t => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-black transition-all ${
              activeTab === t.id 
                ? 'bg-primary-600 text-white shadow-lg' 
                : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <t.icon size={16} />
            {t.name}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Controls */}
        <div className="lg:col-span-1 space-y-8">
          <div className="glass p-8 rounded-[2.5rem] space-y-8 relative overflow-hidden">
            <div className="absolute -right-10 -top-10 w-32 h-32 bg-primary-500/5 rounded-full blur-3xl"></div>
            
            <h3 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-[0.2em] flex items-center gap-2 relative z-10">
              <div className="w-8 h-8 rounded-xl icon-glow-primary flex items-center justify-center">
                <TrendingUp size={16} />
              </div>
              Parameters
            </h3>

            {/* Common Inputs */}
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Principal Amount (₹)</label>
                   <span className="text-xs font-black text-slate-900 dark:text-white">₹{amt.toLocaleString()}</span>
                </div>
                <input 
                  type="range" min="100000" max="50000000" step="50000"
                  className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-primary-600"
                  value={amt} onChange={(e) => setAmt(Number(e.target.value))}
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Interest Rate (%)</label>
                   <span className="text-xs font-black text-slate-900 dark:text-white">{rate}%</span>
                </div>
                <input 
                  type="range" min="5" max="25" step="0.1"
                  className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-primary-600"
                  value={rate} onChange={(e) => setRate(Number(e.target.value))}
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Tenure (Months)</label>
                   <span className="text-xs font-black text-slate-900 dark:text-white">{tenure} Mo</span>
                </div>
                <input 
                  type="range" min="6" max="360" step="6"
                  className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-primary-600"
                  value={tenure} onChange={(e) => setTenure(Number(e.target.value))}
                />
              </div>
            </div>

            {activeTab === 'eligibility' && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="pt-6 border-t border-slate-100 dark:border-slate-800 space-y-4">
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Net Monthly Income (₹)</label>
                    <input 
                      type="number" 
                      className="w-full bg-slate-50 dark:bg-slate-900 border-none px-4 py-2.5 rounded-xl text-xs font-bold"
                      value={income} onChange={(e) => setIncome(Number(e.target.value))}
                    />
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Other Monthly EMIs (₹)</label>
                    <input 
                      type="number" 
                      className="w-full bg-slate-50 dark:bg-slate-900 border-none px-4 py-2.5 rounded-xl text-xs font-bold"
                      value={existingEmi} onChange={(e) => setExistingEmi(Number(e.target.value))}
                    />
                 </div>
              </motion.div>
            )}

            {activeTab === 'prepay' && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="pt-6 border-t border-slate-100 dark:border-slate-800 space-y-4">
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Prepayment Amount (₹)</label>
                    <input 
                      type="number" 
                      className="w-full bg-slate-50 dark:bg-slate-900 border-none px-4 py-2.5 rounded-xl text-xs font-bold"
                      value={prepayAmt} onChange={(e) => setPrepayAmt(Number(e.target.value))}
                    />
                 </div>
              </motion.div>
            )}
          </div>
        </div>

        {/* Right: Results */}
        <div className="lg:col-span-2 space-y-6">
          <AnimatePresence mode="wait">
            {activeTab === 'emi' && (
              <motion.div 
                key="emi" 
                initial={{ opacity: 0, scale: 0.95 }} 
                animate={{ opacity: 1, scale: 1 }} 
                exit={{ opacity: 0, scale: 0.95 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
              >
                <div className="bg-gradient-to-br from-primary-600 to-indigo-700 rounded-3xl p-8 text-white relative overflow-hidden shadow-2xl">
                   <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-16 -mt-16"></div>
                   <p className="text-[10px] font-black uppercase tracking-widest opacity-80 mb-2">Monthly Installment</p>
                   <h2 className="text-5xl font-black tracking-tighter mb-8 italic">₹{emi.toLocaleString()}</h2>
                   <div className="flex gap-4">
                      <div className="flex-1 px-4 py-2 bg-white/10 rounded-xl">
                        <p className="text-[10px] font-black opacity-60 uppercase mb-1">Tenure</p>
                        <p className="text-xs font-bold">{tenure} Months</p>
                      </div>
                      <div className="flex-1 px-4 py-2 bg-white/10 rounded-xl">
                        <p className="text-[10px] font-black opacity-60 uppercase mb-1">Rate</p>
                        <p className="text-xs font-bold">{rate}% p.a</p>
                      </div>
                   </div>
                </div>

                <div className="glass p-8 rounded-3xl flex flex-col justify-between">
                   <div>
                     <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Total Interest Contribution</p>
                     <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">₹{totalInterest.toLocaleString()}</h2>
                   </div>
                   <div className="pt-6 border-t border-slate-100 dark:border-slate-800">
                      <div className="flex justify-between items-center text-xs font-bold text-slate-500">
                         <span>Principal vs Interest</span>
                         <span>{(amt / (amt + totalInterest) * 100).toFixed(0)}% / {(totalInterest / (amt + totalInterest) * 100).toFixed(0)}%</span>
                      </div>
                      <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full mt-2 flex overflow-hidden">
                         <div className="bg-primary-600 h-full" style={{ width: `${(amt / (amt + totalInterest) * 100)}%` }} />
                         <div className="bg-amber-500 h-full" style={{ width: `${(totalInterest / (amt + totalInterest) * 100)}%` }} />
                      </div>
                   </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'eligibility' && (
              <motion.div 
                key="eligibility" 
                initial={{ opacity: 0, scale: 0.95 }} 
                animate={{ opacity: 1, scale: 1 }} 
                exit={{ opacity: 0, scale: 0.95 }}
                className="space-y-6"
              >
                <div className="glass p-8 rounded-[2.5rem] flex flex-col items-center justify-center text-center space-y-4">
                   <div className="w-16 h-16 bg-primary-100 text-primary-600 rounded-2xl flex items-center justify-center mb-2">
                     <UserCheck size={32} />
                   </div>
                   <div>
                     <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Maximum Eligible Loan</p>
                     <h2 className="text-6xl font-black text-slate-900 dark:text-white tracking-tighter">₹{eligibleLoan.toLocaleString()}</h2>
                   </div>
                   <p className="text-xs text-slate-500 max-w-sm">Based on {foir}% FOIR and Net Serviceable Income of ₹{(income * (foir/100) - existingEmi).toLocaleString()}.</p>
                </div>
              </motion.div>
            )}

            {activeTab === 'prepay' && (
              <motion.div 
                key="prepay" 
                initial={{ opacity: 0, scale: 0.95 }} 
                animate={{ opacity: 1, scale: 1 }} 
                exit={{ opacity: 0, scale: 0.95 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
              >
                <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white">
                   <p className="text-xs font-black text-primary-400 uppercase tracking-widest mb-6">Savings Analysis</p>
                   <div className="space-y-8">
                      <div>
                        <p className="text-[10px] opacity-60 font-bold uppercase tracking-widest mb-1">Total Interest Saved</p>
                        <h4 className="text-3xl font-black text-green-500 tracking-tight">₹{savings.interest.toLocaleString()}</h4>
                      </div>
                      <div>
                        <p className="text-[10px] opacity-60 font-bold uppercase tracking-widest mb-1">Tenure Reduced</p>
                        <h4 className="text-3xl font-black text-sky-400 tracking-tight">{savings.months} Months Early</h4>
                      </div>
                   </div>
                </div>

                <div className="glass p-8 rounded-[2.5rem] flex flex-col justify-center">
                   <div className="space-y-4">
                      <div className="p-4 bg-primary-50 dark:bg-primary-900/10 rounded-2xl flex gap-4">
                         <Info className="text-primary-500 shrink-0" size={20} />
                         <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                           A single prepayment of <span className="font-black text-slate-900 dark:text-white">₹{prepayAmt.toLocaleString()}</span> today 
                           effectively reduces your remaining obligation by <span className="font-black text-primary-600 underline">~{savings.months} EMIs</span>.
                         </p>
                      </div>
                   </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default CalculatorHub;
