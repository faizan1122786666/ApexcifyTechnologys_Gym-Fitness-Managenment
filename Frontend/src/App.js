import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import HomePage from './pages/Home/HomePage';
import LoginPage from './pages/Login/LoginPage';
import SignupPage from './pages/Signup/SignupPage';
import AdminDashboard from './pages/Admin/AdminDashboard';
import TrainerDashboard from './pages/Trainer/TrainerDashboard';
import MemberDashboard from './pages/Member/MemberDashboard';

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="App bg-dark-950 min-h-screen text-white">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            
            <Route path="/admin/*" element={<AdminDashboard />} />
            <Route path="/trainer/*" element={<TrainerDashboard />} />
            <Route path="/member/*" element={<MemberDashboard />} />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
