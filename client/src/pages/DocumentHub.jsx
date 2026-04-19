import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import useAuthStore from '../store/useAuthStore';
import { 
  FileText, 
  CheckCircle2, 
  Clock, 
  ShieldCheck, 
  Download,
  AlertCircle,
  Briefcase,
  ChevronRight,
  Info,
  X,
  FileSearch,
  Check
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const DocumentHub = () => {
  const [customers, setCustomers] = useState([]);
  const [selectedCust, setSelectedCust] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sampleDoc, setSampleDoc] = useState(null);
  const { token } = useAuthStore();

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const res = await api.get('/api/customers');
        setCustomers(res.data);
        if (res.data.length > 0) setSelectedCust(res.data[0]);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching customers:', err);
        setLoading(false);
      }
    };
    fetchCustomers();
  }, [token]);

  const docChecklist = {
    proprietor: [
      'Pan Card of Proprietor',
      'Aadhar Card / Voter ID',
      'GST Registration Certificate',
      'Shop & Establishment License',
      '6 Months Bank Statements',
      'Latest ITR (Computation of Income)'
    ],
    pvt_ltd: [
      'Company Pan Card',
      'MOA & AOA',
      'Certificate of Incorporation',
      'Board Resolution',
      'List of Directors & KYCs',
      'Audited Balance Sheets (2 Years)',
      '12 Months Bank Statements'
    ],
    llp: [
      'LLP Pan Card',
      'LLP Agreement',
      'Partnership Deed',
      'Registration Certificate',
      'KYC of All Partners',
      'GST Returns'
    ]
  };

  const docDetails = {
    'Pan Card of Proprietor': 'Must be clear color scan. Name must match Bank Account exactly.',
    'Aadhar Card / Voter ID': 'Front and Back required. Address must match Business Location or Residence.',
    'GST Registration Certificate': 'Full 3-page set (Form REG-06). Status must be ACTIVE.',
    '6 Months Bank Statements': 'Must be in PDF format with digital sign or bank stamp on all pages.',
    'Latest ITR (Computation of Income)': 'Latest 2 Financial Years required with Acknowledgment (Form V).',
    'Company Pan Card': 'Pan Card in the name of the Private Limited Entity.',
    'MOA & AOA': 'Memorandum and Articles of Association. All pages must be visible.',
    'Certificate of Incorporation': 'COI issued by Registrar of Companies (ROC).',
    'Audited Balance Sheets (2 Years)': 'Full audit report with CA Sign, Seal, and UDIN number.',
    'Partnership Deed': 'Registered Deed showing Profit Sharing Ratio and Partner Powers.'
  };

  const handleViewSample = (doc) => {
    setSampleDoc({
      title: doc,
      detail: docDetails[doc] || 'Please ensure the document is clear, valid, and recently issued (within 6 months where applicable).',
      checklist: [
        'High Resolution Scan',
        'Digital Signature / Stamp',
        'Valid Expiry Date',
        'Self-Attested Copy'
      ]
    });
  };

  const exportChecklist = () => {
    if (!selectedCust) return;
    let content = `*BANKCORE COMPLIANCE CHECKLIST*\nCustomer: ${selectedCust.name}\nType: ${selectedCust.businessType.toUpperCase()}\nDate: ${new Date().toLocaleDateString()}\n\nREQUIRED DOCUMENTS:\n`;
    docChecklist[selectedCust.businessType]?.forEach((doc, i) => {
      content += `${i + 1}. [ ] ${doc}\n`;
    });
    content += `\n--- Standard formats must follow RBI/Compliance V2.4 ---`;
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${selectedCust.name}_Compliance_List.txt`;
    link.click();
  };

  return (
    <div className="space-y-8 min-h-screen">
      {/* Sample Viewer Modal */}
      <AnimatePresence>
        {sampleDoc && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              onClick={() => setSampleDoc(null)}
              className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="glass max-w-lg w-full p-8 rounded-[2.5rem] relative z-10 shadow-2xl overflow-hidden"
            >
              <div className="absolute -right-20 -top-20 w-64 h-64 bg-primary-500/10 rounded-full blur-[100px]"></div>
              
              <div className="flex justify-between items-start mb-8 relative z-10">
                <div className="w-14 h-14 icon-glow-primary rounded-2xl flex items-center justify-center">
                  <FileSearch size={28} />
                </div>
                <button 
                  onClick={() => setSampleDoc(null)}
                  className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
                >
                  <X size={20} className="text-slate-400" />
                </button>
              </div>

              <div className="relative z-10">
                <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight mb-2">{sampleDoc.title}</h3>
                <p className="text-sm text-slate-500 font-medium leading-relaxed mb-8">{sampleDoc.detail}</p>
                
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Acceptance Criteria</h4>
                <div className="space-y-3">
                  {sampleDoc.checklist.map((item, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 bg-slate-900/5 dark:bg-white/5 rounded-2xl border border-slate-200/50 dark:border-white/5">
                      <div className="w-5 h-5 bg-green-500 text-white rounded-lg flex items-center justify-center shadow-lg shadow-green-500/20">
                        <Check size={12} strokeWidth={4} />
                      </div>
                      <span className="text-xs font-black text-slate-700 dark:text-slate-200">{item}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-8 pt-6 border-t border-slate-200/50 dark:border-white/10 flex justify-end">
                  <button 
                    onClick={() => setSampleDoc(null)}
                    className="px-8 py-3.5 bg-primary-600 text-white text-[10px] font-black rounded-xl uppercase tracking-widest hover:bg-primary-700 transition-all shadow-xl shadow-primary-500/20 active:scale-95"
                  >
                    Understood
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className="pt-20">
        <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">Compliance Center</h1>
        <p className="text-[10px] font-black text-slate-500 underline decoration-primary-500 underline-offset-8 uppercase tracking-[0.25em] mt-3">Identity & Verification Ecosystem</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Customer List Sidebar */}
        <div className="lg:col-span-1 space-y-6">
           <div className="glass p-6 rounded-[2.5rem] h-[700px] flex flex-col relative overflow-hidden border border-white/40 dark:border-white/10 shadow-2xl shadow-slate-900/5 dark:shadow-black/20">
              <div className="absolute -right-10 -top-10 w-32 h-32 bg-primary-500/10 rounded-full blur-3xl"></div>
              
              <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2 relative z-10">
                <div className="icon-glow-primary w-6 h-6 rounded-lg flex items-center justify-center">
                  <Briefcase size={12} />
                </div>
                Active Portfolios
              </h3>
              
              <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar relative z-10">
                 {customers.map(c => (
                    <button
                      key={c._id}
                      onClick={() => setSelectedCust(c)}
                      className={`w-full text-left p-4 rounded-2xl transition-all border group relative overflow-hidden ${
                        selectedCust?._id === c._id 
                          ? 'bg-primary-600/10 border-primary-500/30 ring-1 ring-primary-500/20' 
                          : 'bg-transparent border-transparent hover:bg-slate-900/5 dark:hover:bg-white/5'
                      }`}
                    >
                       <div className="relative z-10">
                         <p className={`text-sm font-black transition-colors ${selectedCust?._id === c._id ? 'text-primary-600 dark:text-primary-400' : 'text-slate-800 dark:text-slate-300'}`}>
                           {c.name}
                         </p>
                         <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1 opacity-70">{c.businessType.replace('_', ' ')}</p>
                       </div>
                       {selectedCust?._id === c._id && (
                         <div className="absolute right-3 top-1/2 -translate-y-1/2 text-primary-500">
                            <ChevronRight size={16} strokeWidth={3} />
                         </div>
                       )}
                    </button>
                 ))}
              </div>
           </div>
        </div>

        {/* Requirements Display */}
        <div className="lg:col-span-3">
           {selectedCust ? (
             <motion.div 
               key={selectedCust._id}
               initial={{ opacity: 0, x: 20 }}
               animate={{ opacity: 1, x: 0 }}
               className="space-y-8"
             >
                <div className="glass p-8 rounded-[2.5rem] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 relative overflow-hidden border border-white/40 dark:border-white/10 shadow-2xl shadow-slate-900/5 dark:shadow-black/20">
                   <div className="absolute -left-20 -top-20 w-64 h-64 bg-primary-500/5 rounded-full blur-[100px]"></div>
                   
                   <div className="flex items-center gap-6 relative z-10">
                      <div className="w-16 h-16 icon-glow-primary rounded-2xl flex items-center justify-center shadow-2xl">
                         <ShieldCheck size={32} strokeWidth={2.5} />
                      </div>
                      <div>
                         <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter">{selectedCust.name}</h2>
                         <div className="flex gap-2 mt-2">
                            <span className="text-[10px] font-black bg-slate-900 dark:bg-white dark:text-slate-900 text-white px-3 py-1 rounded-xl uppercase tracking-widest shadow-lg shadow-black/5">{selectedCust.businessType.replace('_', ' ')}</span>
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1 bg-slate-100 dark:bg-white/5 px-3 py-1 rounded-xl transition-colors">
                              <div className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-pulse"></div>
                              Verification Pending
                            </span>
                         </div>
                      </div>
                   </div>
                   <div className="flex gap-3 relative z-10">
                      <button 
                        onClick={exportChecklist}
                        className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white text-[11px] font-black rounded-2xl hover:bg-slate-800 transition-all uppercase tracking-widest shadow-xl shadow-slate-900/10 active:scale-95"
                      >
                         <Download size={16} /> Export Checklist
                      </button>
                   </div>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                   <div className="space-y-6">
                      <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Compliance Vault</h4>
                      <div className="space-y-3">
                         {docChecklist[selectedCust.businessType]?.map((doc, idx) => (
                            <div key={idx} className="glass p-5 rounded-[1.75rem] flex items-center justify-between group hover:border-primary-500/20 transition-all bounce-hover">
                               <div className="flex items-center gap-4">
                                  <div className="w-10 h-10 bg-white dark:bg-slate-900 rounded-xl flex items-center justify-center text-slate-400 group-hover:bg-primary-500 group-hover:text-white transition-all duration-500 shadow-sm">
                                     <FileText size={20} />
                                  </div>
                                  <span className="text-xs font-black text-slate-800 dark:text-slate-200 tracking-tight">{doc}</span>
                               </div>
                               <div className="flex items-center gap-2">
                                  <button 
                                    onClick={() => handleViewSample(doc)}
                                    title="View Sample" 
                                    className="p-2 text-slate-400 hover:text-primary-500 transition-colors"
                                  >
                                     <Info size={16} />
                                  </button>
                                  <button className="p-1 text-slate-200 hover:text-green-500 transition-all">
                                     <CheckCircle2 size={24} />
                                  </button>
                               </div>
                            </div>
                         ))}
                      </div>
                   </div>

                   <div className="space-y-6">
                      <div className="bg-gradient-to-br from-slate-900 to-indigo-950 p-6 rounded-[2rem] text-white">
                         <h4 className="text-sm font-black mb-4 flex items-center gap-2">
                            <AlertCircle size={18} className="text-amber-500" /> Underwriting Alert
                         </h4>
                         <p className="text-xs text-slate-400 font-medium leading-relaxed mb-6">
                            For <span className="text-white font-bold">{selectedCust.name}</span>, ensure the GST returns match the bank statement turnovers (₹{selectedCust.turnover?.toLocaleString()}).
                         </p>
                         <div className="p-3 bg-white/5 border border-white/10 rounded-xl flex items-center gap-3">
                            <Info size={16} className="text-primary-400" />
                            <p className="text-[10px] font-bold">Policy version: V2.4 (FY 2026)</p>
                         </div>
                      </div>

                      <div className="glass p-6 rounded-[2rem]">
                         <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Verification Audit</h4>
                         <div className="space-y-4">
                            {[1, 2].map(i => (
                               <div key={i} className="flex gap-4">
                                  <div className="shrink-0 w-2 h-2 bg-green-500 rounded-full mt-1.5 shadow-[0_0_8px_rgba(34,197,94,0.5)]"></div>
                                  <div>
                                     <p className="text-[10px] font-black text-slate-900 dark:text-white">Admin Verified Identity</p>
                                     <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">14 APR 2026 • 2:30 PM</p>
                                  </div>
                               </div>
                            ))}
                         </div>
                      </div>
                   </div>
                </div>
             </motion.div>
           ) : (
             <div className="flex flex-col items-center justify-center h-[500px] text-slate-400">
                <FileText size={48} className="opacity-20 mb-4" />
                <p className="text-sm font-bold italic">Select a customer to view document vault.</p>
             </div>
           )}
        </div>
      </div>
    </div>
  );
};

export default DocumentHub;
