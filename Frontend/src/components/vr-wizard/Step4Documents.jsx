import React, { useRef } from 'react';
import { Upload, CheckCircle2, FileText, AlertCircle } from 'lucide-react';
import { useVRWizard } from '../../contexts/VRWizardContext';
import WizardNav from './WizardNav';

const Step4Documents = () => {
  const { wizard, updateFields, saveAndNext } = useVRWizard();
  const { identityProof, addressProof, vehicleInvoice, insuranceProof, documentsConfirmed } = wizard;

  const fileInputRef = useRef(null);
  const [activeDoc, setActiveDoc] = React.useState(null);

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file || !activeDoc) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result;
      updateFields({ [activeDoc]: base64String });
    };
    reader.readAsDataURL(file);
  };

  const triggerUpload = (docField) => {
    setActiveDoc(docField);
    fileInputRef.current?.click();
  };

  const handleNext = () => {
    saveAndNext({ documentsConfirmed: true });
  };

  const isAllUploaded = identityProof && addressProof && vehicleInvoice && insuranceProof;

  const DocUploader = ({ title, desc, field, value }) => (
    <div className={`p-4 rounded-xl border-2 transition-all flex items-center justify-between ${value ? 'border-emerald-500 bg-emerald-50' : 'border-dashed border-slate-300 hover:border-blue-400 hover:bg-blue-50 cursor-pointer'}`} onClick={() => !value && triggerUpload(field)}>
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${value ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-500'}`}>
          {value ? <CheckCircle2 className="w-5 h-5" /> : <FileText className="w-5 h-5" />}
        </div>
        <div>
          <p className={`text-sm font-bold ${value ? 'text-emerald-800' : 'text-slate-700'}`}>{title}</p>
          <p className={`text-xs ${value ? 'text-emerald-600' : 'text-slate-500'}`}>{value ? 'Uploaded successfully' : desc}</p>
        </div>
      </div>
      {!value && (
        <button className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-600 shadow-sm flex items-center gap-1.5">
          <Upload className="w-3 h-3" />
          Upload
        </button>
      )}
      {value && (
         <button onClick={(e) => { e.stopPropagation(); updateFields({[field]: null}) }} className="text-xs text-red-500 hover:underline font-medium">Remove</button>
      )}
    </div>
  );

  return (
    <div className="flex flex-col h-full">
      <div className="px-8 pt-8 pb-4">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center font-bold text-sm">4</div>
          <p className="text-xs font-semibold text-blue-600 uppercase tracking-wide">Step 4 of 8</p>
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-1">Upload Required Documents</h2>
        <p className="text-slate-500 text-sm font-medium">Please provide clear copies of the following documents.</p>
      </div>

      <div className="flex-1 overflow-y-auto px-8 pb-4 space-y-4">
        <input 
          type="file" 
          ref={fileInputRef} 
          className="hidden" 
          accept="image/*,.pdf" 
          onChange={handleFileUpload} 
        />
        
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 flex gap-2 items-start">
           <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
           <p className="text-xs text-amber-800 font-medium leading-relaxed">
             Make sure all documents are clearly legible. Max file size is 2MB per document. Images will be stored securely.
           </p>
        </div>

        <DocUploader 
          title="Identity Proof" 
          desc="Aadhar Card, PAN Card, or Passport" 
          field="identityProof" 
          value={identityProof} 
        />
        
        <DocUploader 
          title="Address Proof" 
          desc="Utility bill, Rent agreement, or Aadhar" 
          field="addressProof" 
          value={addressProof} 
        />
        
        <DocUploader 
          title="Vehicle Invoice" 
          desc="Original purchase invoice from dealer" 
          field="vehicleInvoice" 
          value={vehicleInvoice} 
        />
        
        <DocUploader 
          title="Insurance Proof" 
          desc="Valid vehicle insurance certificate" 
          field="insuranceProof" 
          value={insuranceProof} 
        />

        {isAllUploaded && (
          <label className="flex items-center gap-3 p-4 bg-slate-50 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-100 mt-6">
            <input 
              type="checkbox" 
              className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
              checked={documentsConfirmed}
              onChange={(e) => updateFields({ documentsConfirmed: e.target.checked })}
            />
            <span className="text-sm font-medium text-slate-700">
              I declare that all uploaded documents are genuine and valid.
            </span>
          </label>
        )}
      </div>

      <WizardNav onNext={handleNext} disabledNext={!isAllUploaded || !documentsConfirmed} />
    </div>
  );
};

export default Step4Documents;
