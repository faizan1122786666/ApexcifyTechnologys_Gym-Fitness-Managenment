import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { authService } from '../../services/api';
import { toast } from 'react-toastify';
import { Key, Eye, EyeOff, Save, X } from 'lucide-react';

const ChangePassword = () => {
  const { user } = useAuth();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error('Please fill in all password fields');
      return;
    }

    if (newPassword.length < 6) {
      toast.error('New password must be at least 6 characters long');
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }

    if (newPassword === currentPassword) {
      toast.error('New password must be different from current password');
      return;
    }

    setIsLoading(true);

    try {
      // For admin users updating other users, use admin endpoint
      if (user?.role === 'admin') {
        // Admin can change any user's password
        const response = await authService.adminUpdateUser(user._id, {
          password: newPassword
        });
        
        if (response.data) {
          toast.success('Password changed successfully! 🎉');
          // Clear form
          setCurrentPassword('');
          setNewPassword('');
          setConfirmPassword('');
        }
      } else {
        // Regular users need to verify current password
        try {
          // First verify current password by attempting login
          const loginResponse = await authService.login({
            email: user.email,
            password: currentPassword
          });

          if (loginResponse.data && loginResponse.data.token) {
            // Current password is correct, now update to new password
            const updateResponse = await authService.updateProfile({
              password: newPassword
            });

            if (updateResponse.data) {
              toast.success('Password changed successfully! 🎉');
              // Clear form
              setCurrentPassword('');
              setNewPassword('');
              setConfirmPassword('');
            }
          }
        } catch (error) {
          if (error.response?.status === 401) {
            toast.error('Current password is incorrect');
          } else {
            throw error;
          }
        }
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to change password';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="glass-card p-6 animate-slide-up">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-500/20 to-accent-emerald/20 flex items-center justify-center">
          <Key className="w-6 h-6 text-primary-400" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-white">Change Password</h3>
          <p className="text-sm text-dark-400">Update your account password</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Current Password */}
        {user?.role !== 'admin' && (
          <div>
            <label className="block text-sm font-medium text-dark-300 mb-2">
              Current Password *
            </label>
            <div className="relative">
              <input
                type={showCurrentPassword ? 'text' : 'password'}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="input-field pr-12"
                placeholder="Enter your current password"
                required
              />
              <button
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-dark-400 hover:text-primary-400 transition-colors"
              >
                {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
        )}

        {/* New Password */}
        <div>
          <label className="block text-sm font-medium text-dark-300 mb-2">
            New Password *
          </label>
          <div className="relative">
            <input
              type={showNewPassword ? 'text' : 'password'}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="input-field pr-12"
              placeholder="Enter new password (min 6 characters)"
              required
            />
            <button
              type="button"
              onClick={() => setShowNewPassword(!showNewPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-dark-400 hover:text-primary-400 transition-colors"
            >
              {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Confirm New Password */}
        <div>
          <label className="block text-sm font-medium text-dark-300 mb-2">
            Confirm New Password *
          </label>
          <div className="relative">
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="input-field pr-12"
              placeholder="Confirm your new password"
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-dark-400 hover:text-primary-400 transition-colors"
            >
              {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Password Requirements */}
        <div className="bg-dark-900/50 border border-white/10 rounded-lg p-3">
          <p className="text-xs text-dark-400 mb-2">Password requirements:</p>
          <ul className="text-xs text-dark-400 space-y-1">
            <li className={newPassword.length >= 6 ? 'text-emerald-400' : ''}>
              ✓ At least 6 characters
            </li>
            <li className={newPassword !== currentPassword && currentPassword ? 'text-emerald-400' : ''}>
              ✓ Different from current password
            </li>
            <li className={newPassword === confirmPassword && newPassword ? 'text-emerald-400' : ''}>
              ✓ Passwords match
            </li>
          </ul>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="btn-primary w-full flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              Updating...
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              Change Password
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default ChangePassword;