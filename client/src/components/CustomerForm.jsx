import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Briefcase, Building2, User, Globe, FileCheck } from 'lucide-react';

const CustomerForm = () => {
  const [formData, setFormData] = useState({
    businessType: '',
    turnover: '',
    industry: '',
    loanAmount: '',
    fullName: '',
  });

  const [step, setStep] = useState(1);

  const businessTypes = [
    { id: 'proprietor', name: 'Proprietorship', icon: User, docs: ['Aadhaar Card', 'PAN Card', '6 Months Bank Statement'] },
    { id: 'pvt_ltd', name: 'Pvt Ltd Company', icon: Building2, docs: ['MOA & AOA', 'Company PAN', 'GST Certificates', '2 Years ITR'] },
    { id: 'llp', name: 'LLP', icon: Globe, docs: ['LLP Agreement', 'Partner IDs', 'GST Registration'] },
  ];

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const selectedType = businessTypes.find(t => t.id === formData.businessType);
  const showAudited = Number(formData.turnover) > 5000000; // > 50L

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-2 bg-primary-100 text-primary-600 rounded-lg">
          <Briefcase size={24} />
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-800">Customer Intake Form</h2>
          <p className="text-sm text-slate-500">Provide business details for loan requirement mapping</p>
        </div>
      </div>

      <div className="space-y-8">
        {/* Business Type Selection */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-4">Select Business Type</label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {businessTypes.map((type) => (
              <button
                key={type.id}
                onClick={() => setFormData({ ...formData, businessType: type.id })}
                className={`flex flex-col items-center gap-3 p-4 rounded-xl border-2 transition-all duration-200 ${
                  formData.businessType === type.id
                    ? 'border-primary-600 bg-primary-50 text-primary-700'
                    : 'border-slate-100 bg-slate-50 text-slate-600 hover:border-slate-200'
                }`}
              >
                <type.icon size={24} />
                <span className="text-sm font-bold">{type.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Basic Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Annual Turnover (₹)</label>
            <input
              type="number"
              name="turnover"
              placeholder="e.g. 1000000"
              onChange={handleInputChange}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Loan Required (₹)</label>
            <input
              type="number"
              name="loanAmount"
              placeholder="e.g. 500000"
              onChange={handleInputChange}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none"
            />
          </div>
        </div>

        {/* Dynamic Requirements Display */}
        <AnimatePresence mode="wait">
          {formData.businessType && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-slate-900 rounded-xl p-6 text-white"
            >
              <div className="flex items-center gap-2 mb-4">
                <FileCheck size={20} className="text-primary-400" />
                <h3 className="font-bold">Required Documents for {selectedType?.name}</h3>
              </div>
              <ul className="space-y-3">
                {selectedType?.docs.map((doc, idx) => (
                  <li key={idx} className="flex items-center gap-3 text-slate-300 text-sm">
                    <div className="w-1.5 h-1.5 bg-primary-500 rounded-full"></div>
                    {doc}
                  </li>
                ))}
                {showAudited && (
                  <li className="flex items-center gap-3 text-primary-300 text-sm font-semibold animate-pulse">
                    <div className="w-1.5 h-1.5 bg-primary-400 rounded-full"></div>
                    Audited Financial Statements (Required for 50L+ Turnover)
                  </li>
                )}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>

        <button className="w-full py-4 bg-primary-600 text-white font-bold rounded-xl shadow-lg shadow-primary-200 hover:bg-primary-700 transition-all hover:translate-y-[-2px] active:translate-y-[0]">
          Generate Application Profile
        </button>
      </div>
    </div>
  );
};

export default CustomerForm;
