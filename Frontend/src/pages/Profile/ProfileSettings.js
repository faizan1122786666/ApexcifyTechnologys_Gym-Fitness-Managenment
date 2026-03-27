import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';


const ProfileSettings = () => {
  const { user, updateUser } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [password, setPassword] = useState('');
  const [avatarPreview, setAvatarPreview] = useState(user?.profilePic || user?.avatar || '');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState('');
  const [isSaving, setIsSaving] = useState(false);

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

  return (
    <div className="glass-card p-6 md:p-8 max-w-3xl mx-auto">
      <h2 className="text-2xl font-display font-bold text-white mb-6 border-b border-white/5 pb-4">Profile & Settings</h2>
      
      <div className="flex flex-col md:flex-row gap-10 items-start">
         {/* Avatar Upload Container */}
         <div className="flex flex-col items-center gap-4 w-full md:w-auto text-center">
             <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-primary-500/30 flex items-center justify-center bg-dark-900 shadow-glow relative group">
                {avatarPreview && (avatarPreview.startsWith('http') || avatarPreview.startsWith('data:image')) ? (
                   <img src={avatarPreview} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                   <div className="w-full h-full bg-gradient-to-br from-primary-500 to-accent-emerald text-white flex items-center justify-center text-5xl font-bold">
                     {name?.[0]?.toUpperCase() || 'U'}
                   </div>
                )}
                {/* Overlay on hover */}
                <div {...getRootProps()} className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity cursor-pointer">
                   <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                   <input {...getInputProps()} />
                </div>
             </div>
             
             <div 
               {...getRootProps()} 
               className={`w-full md:w-48 border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-colors duration-200 ${
                 isDragActive ? 'border-primary-500 bg-primary-500/10' : 'border-dark-600 hover:border-primary-400 hover:bg-white/5'
               }`}
             >
                <input {...getInputProps()} />
                <svg className="w-6 h-6 mx-auto mb-2 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
                {isUploading ? (
                  <p className="text-xs text-primary-400 font-medium">Processing...</p>
                ) : (
                  <p className="text-xs text-dark-400 font-medium">Click to change photo</p>
                )}
             </div>
             
             {uploadStatus && (
               <p className={`text-xs text-center max-w-[200px] font-medium ${uploadStatus.includes('failed') ? 'text-red-400' : (uploadStatus.includes('successfully') || uploadStatus.includes('✅')) ? 'text-emerald-400' : 'text-primary-400'}`}>
                 {uploadStatus}
               </p>
             )}
         </div>

         {/* Basic Info Form */}
         <div className="flex-1 w-full space-y-5">
             <div>
                <label className="block text-sm font-medium text-dark-300 mb-2">Display Name</label>
                <input type="text" className="input-field" value={name} onChange={(e) => setName(e.target.value)} />
             </div>
             <div>
                <label className="block text-sm font-medium text-dark-300 mb-2">Email Address</label>
                <input type="email" className="input-field opacity-60 cursor-not-allowed" defaultValue={user?.email} disabled />
                <p className="text-xs text-dark-500 mt-1 italic">Email addresses are verified and cannot be changed.</p>
             </div>
             <div>
                <label className="block text-sm font-medium text-dark-300 mb-2">Change Password</label>
                <input type="password" placeholder="Leave blank to keep current" className="input-field" value={password} onChange={(e) => setPassword(e.target.value)} />
                <p className="text-xs text-dark-500 mt-1 italic">Update your account password here.</p>
             </div>

             <div>
                <label className="block text-sm font-medium text-dark-300 mb-2">Account Role</label>
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
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                    Saving...
                  </>
                ) : 'Save Profile Changes'}
             </button>
         </div>
      </div>
    </div>
  );
};
export default ProfileSettings;
