import React, { useEffect, useState } from 'react';
import { Receipt, AlertCircle, Loader2 } from 'lucide-react';
import { useVRWizard } from '../../contexts/VRWizardContext';
import WizardNav from './WizardNav';

const Step5Fees = () => {
  const { wizard, updateFields, saveAndNext } = useVRWizard();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchFee = async () => {
      if (wizard.feeAmount) return; // already fetched
      
      setLoading(true);
      try {
        const res = await fetch(`https://parivahan-sewa2-0-backend.onrender.com/api/v1/vr/fee?vehicleType=${encodeURIComponent(wizard.vehicleType || 'Two Wheeler')}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token') || sessionStorage.getItem('token')}`
          }
        });
        if (res.ok) {
          const data = await res.json();
          updateFields({ feeAmount: data.fee });
        } else {
          // fallback
          updateFields({ feeAmount: 500 });
        }
      } catch (err) {
        updateFields({ feeAmount: 500 });
      } finally {
        setLoading(false);
      }
    };
    
    fetchFee();
  }, [wizard.vehicleType, wizard.feeAmount, updateFields]);

  const handleNext = () => {
    saveAndNext({ feeAmount: wizard.feeAmount });
  };

  return (
    <div className="flex flex-col h-full">
      <div className="px-8 pt-8 pb-4">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center font-bold text-sm">5</div>
          <p className="text-xs font-semibold text-blue-600 uppercase tracking-wide">Step 5 of 8</p>
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-1">Fee Estimation</h2>
        <p className="text-slate-500 text-sm font-medium">Estimated registration fees for your {wizard.vehicleType || 'vehicle'}.</p>
      </div>

      <div className="flex-1 overflow-y-auto px-8 pb-4">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-48 space-y-4">
            <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
            <p className="text-slate-500 text-sm">Calculating fees based on your vehicle details...</p>
          </div>
        ) : (
          <div className="max-w-md">
            <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
              <div className="bg-slate-50 border-b border-slate-100 p-4 flex items-center gap-3">
                <Receipt className="w-5 h-5 text-slate-500" />
                <h3 className="font-semibold text-slate-800">Fee Breakdown</h3>
              </div>
              
              <div className="p-4 space-y-3">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-600">Registration Fee</span>
                  <span className="font-medium text-slate-800">â‚¹{wizard.feeAmount || 0}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-600">Smart Card Fee</span>
                  <span className="font-medium text-slate-800">â‚¹200</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-600">Postal Charges</span>
                  <span className="font-medium text-slate-800">â‚¹50</span>
                </div>
                
                <div className="border-t border-slate-100 pt-3 mt-3 flex justify-between items-center">
                  <span className="font-bold text-slate-800">Total Estimated Amount</span>
                  <span className="text-xl font-bold text-blue-600">â‚¹{((wizard.feeAmount || 0) + 250).toLocaleString()}</span>
                </div>
              </div>
            </div>
            
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 flex gap-2 items-start mt-4">
               <AlertCircle className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
               <p className="text-xs text-blue-800 font-medium leading-relaxed">
                 This is an estimated fee. The final fee may vary based on your state's tax regulations and the exact vehicle invoice value.
               </p>
            </div>
          </div>
        )}
      </div>

      <WizardNav onNext={handleNext} disabledNext={loading || !wizard.feeAmount} />
    </div>
  );
};

export default Step5Fees;
