import React from 'react';
import EMICalculator from '../components/EMICalculator';

const EMIPage = () => {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">EMI Calculator</h1>
        <p className="text-slate-500 mt-1">Calculate your loan repayments with Flat and Reducing interest rates.</p>
      </div>
      <EMICalculator />
    </div>
  );
};

export default EMIPage;
