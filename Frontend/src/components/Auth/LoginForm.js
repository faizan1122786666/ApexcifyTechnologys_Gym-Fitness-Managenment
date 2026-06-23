import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import { Eye, EyeOff, Mail, Lock, User, ChevronRight, Sparkles, Zap } from 'lucide-react';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [demoMode, setDemoMode] = useState(false);
  
  const { login, isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      const role = user.role;
      navigate(role === 'admin' ? '/admin' : role === 'trainer' ? '/trainer' : '/member');
    }
  }, [isAuthenticated, user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const result = await login(email, password);
      if (result.success) {
        toast.success(`Welcome back, ${result.user.name}! 🎉`);
        
        // Add remember me functionality
        if (rememberMe) {
          localStorage.setItem('fitnessDesk_rememberMe', 'true');
        } else {
          localStorage.removeItem('fitnessDesk_rememberMe');
        }
        
        const role = result.user.role;
        setTimeout(() => {
          navigate(role === 'admin' ? '/admin' : role === 'trainer' ? '/trainer' : '/member');
        }, 1000);
      } else {
        toast.error(result.error);
        setError(result.error);
      }
    } catch (err) {
      toast.error('An unexpected error occurred. Please try again.');
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = (demoEmail, demoPassword) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    setDemoMode(true);
  };

  const demoAccounts = [
    { 
      role: 'Admin', 
      email: 'admin@fitnessdesk.com', 
      password: 'admin123', 
      icon: '👨‍💼', 
      color: 'from-amber-500 to-yellow-600',
      description: 'Full system control'
    },
    { 
      role: 'Trainer', 
      email: 'sarah@fitnessdesk.com', 
      password: 'trainer123', 
      icon: '🏋️‍♀️', 
      color: 'from-blue-500 to-cyan-600',
      description: 'Manage classes & members'
    },
    { 
      role: 'Member', 
      email: 'john@gmail.com', 
      password: 'member123', 
      icon: '🧑', 
      color: 'from-emerald-500 to-teal-600',
      description: 'Track workouts & progress'
    },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center px-4 pt-20 relative overflow-hidden">
      {/* Enhanced Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-gradient-to-br from-primary-500/20 to-transparent rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-gradient-to-br from-accent-emerald/20 to-transparent rounded-full blur-3xl animate-float" style={{animationDelay: '3s'}}></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-gradient-to-br from-primary-500/5 to-transparent rounded-full blur-3xl animate-pulse"></div>
      </div>

      {/* Animated particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-primary-400/30 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 6}s`,
              animationDuration: `${3 + Math.random() * 4}s`,
            }}
          />
        ))}
      </div>

      <div className="w-full max-w-md relative z-10 animate-fade-in">
        {/* Enhanced Header */}
        <div className="text-center mb-8 animate-slide-up">
          <Link to="/" className="inline-flex items-center gap-3 mb-6 group">
            <div className="w-16 h-16 rounded-full flex items-center justify-center transform group-hover:scale-110 transition-all duration-300 overflow-hidden bg-gradient-to-br from-primary-500/20 to-accent-emerald/20 backdrop-blur-sm border border-white/10 shadow-glow">
              <div className="relative">
                <img src="/images/logo.png" alt="FitnessDesk Logo" className="w-10 h-10 object-cover rounded-full" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-primary-400 to-accent-emerald rounded-full animate-pulse"></div>
              </div>
            </div>
            <span className="text-3xl font-display font-bold text-white tracking-wide">
              Fitness<span className="gradient-text">Desk</span>
            </span>
          </Link>

          <h1 className="text-4xl font-display font-bold text-white mb-3 bg-gradient-to-r from-white to-primary-300 bg-clip-text text-transparent">
            Welcome Back
          </h1>
          <p className="text-dark-400 text-lg">Sign in to your FitnessDesk account</p>
        </div>

        {/* Enhanced Login Form */}
        <div className="glass-card p-8 animate-slide-up" style={{animationDelay: '0.2s'}}>
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 text-red-400 text-sm text-center animate-slide-up backdrop-blur-sm">
                <div className="flex items-center justify-center gap-2">
                  <Zap className="w-4 h-4" />
                  {error}
                </div>
              </div>
            )}

            {/* Email Input */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-dark-300 flex items-center gap-2">
                <Mail className="w-4 h-4 text-primary-400" />
                Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-field pl-12 focus:shadow-glow transition-all duration-300"
                  placeholder="you@example.com"
                  required
                  disabled={isLoading}
                />
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-500 transition-colors duration-300" />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-dark-300 flex items-center gap-2">
                <Lock className="w-4 h-4 text-primary-400" />
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-field pl-12 pr-12 focus:shadow-glow transition-all duration-300"
                  placeholder="••••••••"
                  required
                  disabled={isLoading}
                />
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-500 transition-colors duration-300" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-dark-500 hover:text-primary-400 transition-all duration-300"
                  disabled={isLoading}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 text-primary-500 bg-dark-900/60 border-white/20 rounded focus:ring-primary-500 focus:ring-2"
                  disabled={isLoading}
                />
                <span className="text-sm text-dark-400 group-hover:text-white transition-colors duration-200">
                  Remember me
                </span>
              </label>
              <Link 
                to="/forgot-password" 
                className="text-sm text-primary-400 hover:text-primary-300 transition-colors duration-200"
              >
                Forgot password?
              </Link>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full flex items-center justify-center gap-2 relative overflow-hidden"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Signing in...
                </>
              ) : (
                <>
                  Sign In
                  <ChevronRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-transparent text-dark-400">Or continue with</span>
            </div>
          </div>

          {/* Demo Accounts */}
          <div className="space-y-3">
            <p className="text-center text-sm text-dark-400 flex items-center justify-center gap-2">
              <Sparkles className="w-4 h-4 text-primary-400" />
              Try demo accounts
              <Sparkles className="w-4 h-4 text-primary-400" />
            </p>
            <div className="grid grid-cols-1 gap-2">
              {demoAccounts.map((account, index) => (
                <button
                  key={account.role}
                  type="button"
                  onClick={() => handleDemoLogin(account.email, account.password)}
                  className={`p-3 rounded-xl border border-white/10 bg-gradient-to-r ${account.color} text-white font-medium transition-all duration-300 hover:scale-105 hover:shadow-glow relative overflow-hidden group`}
                  style={{animationDelay: `${index * 0.1}s`}}
                  disabled={isLoading}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{account.icon}</span>
                      <div className="text-left">
                        <div className="font-semibold">{account.role}</div>
                        <div className="text-xs opacity-80">{account.description}</div>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </div>
                  {demoMode && email === account.email && (
                    <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Sign Up Link */}
          <div className="text-center mt-6">
            <p className="text-dark-400">
              Don't have an account?{' '}
              <Link 
                to="/signup" 
                className="text-primary-400 hover:text-primary-300 font-medium transition-colors duration-200"
              >
                Sign up for free
              </Link>
            </p>
          </div>
        </div>

        {/* Enhanced Footer */}
        <div className="text-center mt-8 text-xs text-dark-500 animate-fade-in" style={{animationDelay: '0.4s'}}>
          <p>By signing in, you agree to our Terms of Service and Privacy Policy</p>
          <p className="mt-1">© 2024 FitnessDesk. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;