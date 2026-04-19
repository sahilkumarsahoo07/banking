import React from 'react';
import CustomerForm from '../components/CustomerForm';

const CustomerIntakePage = () => {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">New Customer Intake</h1>
        <p className="text-slate-500 mt-1">Generate document requirements based on business profile.</p>
      </div>
      <CustomerForm />
    </div>
  );
};

export default CustomerIntakePage;
