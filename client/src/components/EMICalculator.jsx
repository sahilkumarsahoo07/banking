import React, { useState, useEffect } from 'react';
import { Calculator, Copy, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const EMICalculator = () => {
  const [loanAmount, setLoanAmount] = useState(1000000);
  const [interestRate, setInterestRate] = useState(10.5);
  const [tenure, setTenure] = useState(60); // In months
  const [method, setMethod] = useState('reducing'); // 'reducing' or 'flat'
  const [emi, setEmi] = useState(0);
  const [totalInterest, setTotalInterest] = useState(0);
  const [totalPayment, setTotalPayment] = useState(0);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    calculateEMI();
  }, [loanAmount, interestRate, tenure, method]);

  const calculateEMI = () => {
    const P = parseFloat(loanAmount);
    const r = parseFloat(interestRate) / 12 / 100;
    const n = parseFloat(tenure);

    if (method === 'reducing') {
      const emiValue = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
      setEmi(emiValue);
      setTotalPayment(emiValue * n);
      setTotalInterest(emiValue * n - P);
    } else {
      const annualRate = parseFloat(interestRate) / 100;
      const flatInterest = P * annualRate * (n / 12);
      const totalPay = P + flatInterest;
      setEmi(totalPay / n);
      setTotalPayment(totalPay);
      setTotalInterest(flatInterest);
    }
  };

  const handleCopy = () => {
    const text = `Loan Summary:\nAmount: ₹${loanAmount.toLocaleString()}\nEMI: ₹${Math.round(emi).toLocaleString()}\nRate: ${interestRate}%\nTenure: ${tenure} months\nTotal Interest: ₹${Math.round(totalInterest).toLocaleString()}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary-100 text-primary-600 rounded-lg">
            <Calculator size={24} />
          </div>
          <h2 className="text-xl font-bold text-slate-800">EMI Calculator</h2>
        </div>
        <div className="flex bg-white border border-slate-200 p-1 rounded-xl">
          <button
            onClick={() => setMethod('reducing')}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
              method === 'reducing' ? 'bg-primary-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            Reducing
          </button>
          <button
            onClick={() => setMethod('flat')}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
              method === 'flat' ? 'bg-primary-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            Flat
          </button>
        </div>
      </div>

      <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Loan Amount (₹)</label>
            <input
              type="range"
              min="100000"
              max="10000000"
              step="100000"
              value={loanAmount}
              onChange={(e) => setLoanAmount(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-primary-600"
            />
            <div className="mt-4 relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 font-medium">₹</span>
              <input
                type="number"
                value={loanAmount}
                onChange={(e) => setLoanAmount(Number(e.target.value))}
                className="w-full pl-8 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all outline-none text-slate-800 font-semibold"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Interest Rate (%)</label>
            <input
              type="range"
              min="1"
              max="30"
              step="0.1"
              value={interestRate}
              onChange={(e) => setInterestRate(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-primary-600"
            />
            <div className="mt-4 relative">
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 font-medium">%</span>
              <input
                type="number"
                value={interestRate}
                onChange={(e) => setInterestRate(Number(e.target.value))}
                className="w-full pr-8 pl-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all outline-none text-slate-800 font-semibold"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Tenure (Months)</label>
            <input
              type="range"
              min="12"
              max="360"
              step="12"
              value={tenure}
              onChange={(e) => setTenure(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-primary-600"
            />
            <div className="mt-4 grid grid-cols-2 gap-4">
              <div className="relative">
                <input
                  type="number"
                  value={tenure}
                  onChange={(e) => setTenure(Number(e.target.value))}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all outline-none text-slate-800 font-semibold"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-medium uppercase">Months</span>
              </div>
              <div className="flex items-center justify-center bg-slate-100 rounded-xl px-4 py-2 text-slate-600 font-medium">
                {(tenure / 12).toFixed(1)} Years
              </div>
            </div>
          </div>
        </div>

        <div className="bg-primary-900 rounded-2xl p-8 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-primary-800 rounded-full blur-3xl opacity-50"></div>
          
          <div className="relative z-10 space-y-10">
            <div>
              <p className="text-primary-300 text-sm font-medium mb-1 uppercase tracking-wider">Monthly EMI</p>
              <h3 className="text-5xl font-bold">₹{Math.round(emi).toLocaleString()}</h3>
            </div>

            <div className="grid grid-cols-2 gap-6 pt-6 border-t border-primary-800">
              <div>
                <p className="text-primary-300 text-xs font-medium mb-1 uppercase tracking-wider">Total Interest</p>
                <p className="text-xl font-semibold">₹{Math.round(totalInterest).toLocaleString()}</p>
              </div>
              <div>
                <p className="text-primary-300 text-xs font-medium mb-1 uppercase tracking-wider">Total Payable</p>
                <p className="text-xl font-semibold">₹{Math.round(totalPayment).toLocaleString()}</p>
              </div>
            </div>

            <button
              onClick={handleCopy}
              className="w-full mt-6 bg-white text-primary-900 font-bold py-4 rounded-xl flex items-center justify-center gap-3 hover:bg-primary-50 transition-colors shadow-lg group"
            >
              {copied ? <Check size={20} className="text-green-600" /> : <Copy size={20} />}
              {copied ? 'Copied Details!' : 'Copy Breakdown'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EMICalculator;
