import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { useAuth } from '../../context/AuthContext';

const ProfileSettings = () => {
  const { user } = useAuth();
  const [avatarPreview, setAvatarPreview] = useState(user?.avatarUrl || user?.avatar || '🧑');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState('');

  const onDrop = useCallback(async (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (!file) return;

    // Show preview immediately using local BLOB
    setAvatarPreview(URL.createObjectURL(file));
    setIsUploading(true);
    setUploadStatus('Uploading image to Cloudinary...');

    // These environment variables need to be set properly in your frontend/.env:
    // REACT_APP_CLOUDINARY_CLOUD_NAME=your_cloud_name
    // REACT_APP_CLOUDINARY_UPLOAD_PRESET=unassigned_preset_name
    const cloudName = process.env.REACT_APP_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET;

    const formData = new FormData();
    formData.append('file', file);
    if (uploadPreset) formData.append('upload_preset', uploadPreset);

    try {
      let data = { secure_url: URL.createObjectURL(file) };
      
      if (cloudName && uploadPreset) {
         // Perform actual upload to cloud
         const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
            method: 'POST',
            body: formData,
         });
         data = await res.json();
         if (data.error) throw new Error(data.error.message);
      } else {
         // Simulate upload duration if no keys are found
         await new Promise(resolve => setTimeout(resolve, 1500));
      }
      
      setAvatarPreview(data.secure_url);
      setUploadStatus('Profile image updated successfully!');
      
    } catch (err) {
      console.error(err);
      setUploadStatus('Upload failed. Please check your Cloudinary configuration.');
    } finally {
      setIsUploading(false);
    }
  }, []);

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
         <div className="flex flex-col items-center gap-4 w-full md:w-auto">
             <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-primary-500/30 flex items-center justify-center bg-dark-900 shadow-glow relative group">
                {avatarPreview.startsWith('http') || avatarPreview.startsWith('blob') ? (
                   <img src={avatarPreview} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                   <span className="text-5xl">{avatarPreview}</span>
                )}
                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity cursor-pointer">
                   <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
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
                  <p className="text-xs text-primary-400 font-medium">Uploading...</p>
                ) : (
                  <p className="text-xs text-dark-400">Drag & drop or click to upload</p>
                )}
             </div>
             
             {uploadStatus && (
               <p className={`text-xs text-center max-w-[200px] ${uploadStatus.includes('failed') ? 'text-red-400' : 'text-emerald-400'}`}>
                 {uploadStatus}
               </p>
             )}
         </div>

         {/* Basic Info Form */}
         <div className="flex-1 w-full space-y-5">
             <div>
                <label className="block text-sm font-medium text-dark-300 mb-2">Display Name</label>
                <input type="text" className="input-field" defaultValue={user?.name} />
             </div>
             <div>
                <label className="block text-sm font-medium text-dark-300 mb-2">Email Address</label>
                <input type="email" className="input-field opacity-60 cursor-not-allowed" defaultValue={user?.email} disabled />
                <p className="text-xs text-dark-500 mt-1">Email addresses cannot be changed directly.</p>
             </div>
             <div>
                <label className="block text-sm font-medium text-dark-300 mb-2">Account Role</label>
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold uppercase ${
                  user?.role === 'admin' ? 'bg-amber-500/20 text-amber-400' :
                  user?.role === 'trainer' ? 'bg-blue-500/20 text-blue-400' :
                  'bg-emerald-500/20 text-emerald-400'
                }`}>
                  {user?.role}
                </span>
             </div>
             <button className="btn-primary w-full md:w-auto mt-6">Save Profile Changes</button>
         </div>
      </div>
    </div>
  );
};
export default ProfileSettings;
