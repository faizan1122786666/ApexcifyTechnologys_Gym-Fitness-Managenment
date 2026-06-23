import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import { User, Mail, Key, Camera, Save, X, Eye, EyeOff } from 'lucide-react';
import ChangePassword from '../Auth/ChangePassword';

const ProfileSettings = () => {
  const { user, updateUser } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [password, setPassword] = useState('');
  const [avatarPreview, setAvatarPreview] = useState(user?.profilePic || user?.avatar || '');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');

  const onDrop = useCallback(async (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (!file) return;

    setIsUploading(true);
    setUploadStatus('Processing image...');

    try {
      // Use FileReader to convert the image to a Base64 string
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = async () => {
         const base64Data = reader.result;
         setAvatarPreview(base64Data);
         setUploadStatus('Image preview updated! Click save to persist.');
         setIsUploading(false);
      };
      reader.onerror = () => {
         throw new Error('FileReader failed');
      }
    } catch (err) {
      console.error(err);
      setUploadStatus('Failed to process image.');
      setIsUploading(false);
    }
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    setUploadStatus('Saving changes...');
    try {
       const { authService } = await import('../../services/api');
       const updateData = { 
         name: name,
         profilePic: avatarPreview
       };
       // Only include password if it's set
       if (password.trim()) {
         updateData.password = password;
       }

       const res = await authService.updateProfile(updateData);
       
       if (res.data) {
         updateUser(res.data);
         setPassword(''); // Clear password field
         setUploadStatus('Profile updated successfully! ✅');
         toast.success('Profile updated successfully!');
       }
    } catch (err) {
      console.error(err);
      setUploadStatus('Failed to save changes. Please try again.');
      toast.error('Failed to update profile. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.jpeg', '.png', '.jpg', '.gif'] },
    maxFiles: 1
  });

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'password', label: 'Password', icon: Key },
  ];

  return (
    <div className="glass-card p-6 md:p-8 max-w-4xl mx-auto animate-slide-up">
      <h2 className="text-2xl font-display font-bold text-white mb-6 border-b border-white/5 pb-4 flex items-center gap-3">
        <User className="w-6 h-6 text-primary-400" />
        Profile & Settings
      </h2>

      {/* Tab Navigation */}
      <div className="flex space-x-1 mb-6 bg-dark-900/50 rounded-lg p-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                activeTab === tab.id
                  ? 'bg-primary-500/20 text-primary-400 shadow-glow'
                  : 'text-dark-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Profile Tab */}
      {activeTab === 'profile' && (
        <div className="flex flex-col md:flex-row gap-10 items-start">
          {/* Avatar Upload Container */}
          <div className="flex flex-col items-center gap-4 w-full md:w-auto text-center">
            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-primary-500/30 flex items-center justify-center bg-gradient-to-br from-dark-900 to-dark-800 shadow-glow relative group">
              {avatarPreview && (avatarPreview.startsWith('http') || avatarPreview.startsWith('data:image')) ? (
                <img src={avatarPreview} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-primary-500 to-accent-emerald text-white flex items-center justify-center text-5xl font-bold">
                  {name?.[0]?.toUpperCase() || 'U'}
                </div>
              )}
              {/* Overlay on hover */}
              <div {...getRootProps()} className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity cursor-pointer">
                <Camera className="w-8 h-8 text-white" />
                <input {...getInputProps()} />
              </div>
            </div>
            
            <div 
              {...getRootProps()} 
              className={`w-full md:w-48 border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-all duration-200 ${
                isDragActive ? 'border-primary-500 bg-primary-500/10' : 'border-dark-600 hover:border-primary-400 hover:bg-white/5'
              }`}
            >
              <input {...getInputProps()} />
              <Camera className="w-6 h-6 mx-auto mb-2 text-primary-400" />
              {isUploading ? (
                <p className="text-xs text-primary-400 font-medium">Processing...</p>
              ) : (
                <p className="text-xs text-dark-400 font-medium">Click to change photo</p>
              )}
            </div>
            
            {uploadStatus && (
              <p className={`text-xs text-center max-w-[200px] font-medium ${
                uploadStatus.includes('failed') ? 'text-red-400' : 
                (uploadStatus.includes('successfully') || uploadStatus.includes('✅')) ? 'text-emerald-400' : 
                'text-primary-400'
              }`}>
                {uploadStatus}
              </p>
            )}
          </div>

          {/* Basic Info Form */}
          <div className="flex-1 w-full space-y-5">
            <div>
              <label className="block text-sm font-medium text-dark-300 mb-2 flex items-center gap-2">
                <User className="w-4 h-4 text-primary-400" />
                Display Name
              </label>
              <input 
                type="text" 
                className="input-field" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                placeholder="Enter your name"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-dark-300 mb-2 flex items-center gap-2">
                <Mail className="w-4 h-4 text-primary-400" />
                Email Address
              </label>
              <input 
                type="email" 
                className="input-field opacity-60 cursor-not-allowed" 
                defaultValue={user?.email} 
                disabled 
              />
              <p className="text-xs text-dark-500 mt-1 italic">Email addresses are verified and cannot be changed.</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-dark-300 mb-2">
                Account Role
              </label>
              <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase ${
                user?.role === 'admin' ? 'bg-amber-500/20 text-amber-400' :
                user?.role === 'trainer' ? 'bg-blue-500/20 text-blue-400' :
                'bg-emerald-500/20 text-emerald-400'
              }`}>
                {user?.role}
              </span>
            </div>

            <button 
              onClick={handleSave} 
              disabled={isSaving || isUploading}
              className="btn-primary w-full md:w-auto mt-6 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isSaving ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Save Profile Changes
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Password Tab */}
      {activeTab === 'password' && <ChangePassword />}
    </div>
  );
};

export default ProfileSettings;