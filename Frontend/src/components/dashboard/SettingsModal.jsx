import React, { useState, useRef } from 'react';
import { X, Camera, Loader2, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { updateProfile } from '../../utils/api';

const SettingsModal = ({ onClose }) => {
  const { user, updateUser } = useAuth();
  const [fullName, setFullName] = useState(user?.fullName || '');
  const [profilePhoto, setProfilePhoto] = useState(user?.profilePhoto || '');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setError("Image size must be less than 2MB");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePhoto(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const updatedData = await updateProfile({ fullName, profilePhoto });
      updateUser({ fullName: updatedData.fullName, profilePhoto: updatedData.profilePhoto });
      setSuccess(true);
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (err) {
      setError(err.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl border border-slate-200 flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <h2 className="text-xl font-bold text-slate-800">Settings & Profile</h2>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Content */}
        <form onSubmit={handleSave} className="p-6 space-y-6">
          
          {/* Profile Photo Upload */}
          <div className="flex flex-col items-center">
            <div className="relative group">
              <div className="w-24 h-24 rounded-full border-4 border-white shadow-md bg-slate-100 overflow-hidden flex items-center justify-center">
                <img src={profilePhoto || '/userIcon.png'} alt="Profile" className="w-full h-full object-cover" />
              </div>
              <button 
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-0 right-0 p-2 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-colors cursor-pointer group-hover:scale-105"
              >
                <Camera className="w-4 h-4" />
              </button>
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                accept="image/*" 
                className="hidden" 
              />
            </div>
            <p className="text-xs text-slate-500 mt-3 font-medium">Click camera to upload new photo</p>
          </div>

          {/* User Info Fields */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Full Name</label>
              <input 
                type="text" 
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                required
                className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-sm px-4 py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500" 
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Email Address</label>
              <input 
                type="email" 
                value={user?.email || ''}
                disabled
                className="w-full bg-slate-100 border border-slate-200 text-slate-500 text-sm px-4 py-2.5 rounded-xl cursor-not-allowed opacity-70" 
              />
              <p className="text-[11px] text-slate-400 mt-1">Email address cannot be changed.</p>
            </div>
          </div>

          {error && <p className="text-sm font-semibold text-red-500 text-center">{error}</p>}
          {success && <p className="text-sm font-semibold text-emerald-600 text-center flex items-center justify-center gap-1"><CheckCircle2 className="w-4 h-4" /> Profile updated successfully!</p>}

          <div className="pt-4 border-t border-slate-100">
            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-all shadow-md disabled:opacity-70 flex justify-center items-center gap-2"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SettingsModal;
