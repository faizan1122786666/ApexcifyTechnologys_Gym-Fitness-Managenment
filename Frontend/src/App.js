import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import HomePage from './pages/Home/HomePage';
import LoginPage from './pages/Login/LoginPage';
import SignupPage from './pages/Signup/SignupPage';
import AdminDashboard from './pages/Admin/AdminDashboard';
import TrainerDashboard from './pages/Trainer/TrainerDashboard';
import MemberDashboard from './pages/Member/MemberDashboard';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/index.css';
import ProtectedRoute from './components/Auth/ProtectedRoute';

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="App bg-dark-950 min-h-screen text-white">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            
            <Route path="/admin/*" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            } />
            <Route path="/trainer/*" element={
              <ProtectedRoute allowedRoles={['trainer', 'admin']}>
                <TrainerDashboard />
              </ProtectedRoute>
            } />
            <Route path="/member/*" element={
              <ProtectedRoute allowedRoles={['member', 'admin', 'trainer']}>
                <MemberDashboard />
              </ProtectedRoute>
            } />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          <ToastContainer 
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="dark"
          />
        </div>
      </AuthProvider>
    </Router>
  );
}


export default App;
