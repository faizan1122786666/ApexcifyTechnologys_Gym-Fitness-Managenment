import React, { useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import Navbar from '../../components/Layout/Navbar';
import Sidebar from '../../components/Layout/Sidebar';
import StatsCard from '../../components/Dashboard/StatsCard';
import RecentActivity from '../../components/Dashboard/RecentActivity';
import AttendanceTracker from '../../components/Attendance/AttendanceTracker';
import SubscriptionPlan from '../../components/Payment/SubscriptionPlan';
import PaymentCard from '../../components/Payment/PaymentCard';
import ScheduleCalendar from '../../components/ClassScheduling/ScheduleCalendar';
import ClassCard from '../../components/ClassScheduling/ClassCard';
import TrainerCard from '../../components/Trainer/TrainerCard';
import ProfileSettings from '../../pages/Profile/ProfileSettings';
import Pagination from '../../components/Common/Pagination';
import UserAvatar from '../../components/Common/UserAvatar';
import { Plus, X, Search, MoreVertical } from 'lucide-react';
import { mockDashboardStats, mockPayments, mockClasses, mockUsers } from '../../data/mockData';
import { useAuth } from '../../context/AuthContext';

const AdminOverview = ({ stats }) => (
  <>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <StatsCard title="Total Members" value={stats.totalMembers} change={12} changeType="up" icon="👥" />
      <StatsCard title="Active Trainers" value={stats.totalTrainers} change={5} changeType="up" icon="🏋️‍♂️" />
      <StatsCard title="Monthly Revenue" value={`$${stats.monthlyRevenue.toLocaleString()}`} change={15} changeType="up" icon="💳" />
      <StatsCard title="New Signups" value={stats.newSignups} change={2} changeType="down" icon="📈" />
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2">
         <div className="glass-card p-6 h-full min-h-[400px]">
            <h3 className="text-lg font-semibold text-white mb-4">Revenue Growth</h3>
            <div className="flex items-center justify-center h-64 border border-white/5 rounded-xl bg-dark-900/50">
                <p className="text-dark-500">Revenue tracking chart displayed here 📊</p>
            </div>
         </div>
      </div>
      <div className="lg:col-span-1">
         <RecentActivity />
      </div>
    </div>
  </>
);

const MembersTab = ({ members }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const itemsPerPage = 5;

  const totalPages = Math.ceil(members.length / itemsPerPage);
  const currentMembers = members.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="glass-card p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h2 className="text-xl font-bold text-white">Member Directory</h2>
        <button onClick={() => setShowModal(true)} className="btn-primary flex items-center gap-2 text-sm !py-2">
          <Plus className="w-4 h-4" /> Add Member
        </button>
      </div>

      <div className="space-y-4">
        {currentMembers.map(m => (
          <div key={m.id} className="flex justify-between items-center bg-white/5 p-4 rounded-xl hover:bg-white/10 transition-colors">
            <div className="flex items-center gap-4">
              <UserAvatar src={m.avatar} name={m.name} size="md" />
              <div>
                <p className="font-semibold text-white">{m.name}</p>
                <p className="text-sm text-dark-400">{m.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
               <span className="badge badge-success hidden sm:inline-block">{m.membership} Plan</span>
               <button className="p-2 text-dark-400 hover:text-white transition-colors"><MoreVertical className="w-5 h-5" /></button>
            </div>
          </div>
        ))}
      </div>
      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />

      {/* Add Member Modal (Placeholder for UI) */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="glass-card w-full max-w-md p-6 animate-slide-up relative">
            <button onClick={() => setShowModal(false)} className="absolute top-4 right-4 text-dark-400 hover:text-white"><X className="w-5 h-5"/></button>
            <h3 className="text-xl font-bold text-white mb-6">Create New Member</h3>
            <div className="space-y-4">
              <div><label className="text-sm text-dark-300 block mb-1">Full Name</label><input type="text" className="input-field" placeholder="John Doe" /></div>
              <div><label className="text-sm text-dark-300 block mb-1">Email</label><input type="email" className="input-field" placeholder="john@example.com" /></div>
              <div><label className="text-sm text-dark-300 block mb-1">Plan</label>
                <select className="input-field"><option>Basic</option><option>Premium</option><option>Elite</option></select>
              </div>
              <button onClick={() => setShowModal(false)} className="btn-primary w-full mt-4">Create Member</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const TrainersTab = ({ trainers }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const itemsPerPage = 4;

  const totalPages = Math.ceil(trainers.length / itemsPerPage);
  const currentTrainers = trainers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-white">Our Trainers</h2>
        <button onClick={() => setShowModal(true)} className="btn-primary flex items-center gap-2 text-sm !py-2">
          <Plus className="w-4 h-4" /> Add Trainer
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-6">
        {currentTrainers.map(t => <TrainerCard key={t.id} trainer={t} />)}
      </div>
      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />

      {/* Add Trainer Modal (Placeholder for UI) */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="glass-card w-full max-w-md p-6 animate-slide-up relative">
            <button onClick={() => setShowModal(false)} className="absolute top-4 right-4 text-dark-400 hover:text-white"><X className="w-5 h-5"/></button>
            <h3 className="text-xl font-bold text-white mb-6">Create New Trainer</h3>
            <div className="space-y-4">
              <div><label className="text-sm text-dark-300 block mb-1">Full Name</label><input type="text" className="input-field" placeholder="Jane Doe" /></div>
              <div><label className="text-sm text-dark-300 block mb-1">Email</label><input type="email" className="input-field" placeholder="jane@fitnessdesk.com" /></div>
              <div><label className="text-sm text-dark-300 block mb-1">Specialization</label><input type="text" className="input-field" placeholder="e.g. Yoga & Pilates" /></div>
              <button onClick={() => setShowModal(false)} className="btn-primary w-full mt-4">Create Trainer</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const AdminDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const stats = mockDashboardStats.admin;

  if (!user || (!isAdmin && user.role !== 'admin')) {
    navigate('/login');
    return null;
  }

  const members = mockUsers.filter(u => u.role === 'member');
  const trainers = mockUsers.filter(u => u.role === 'trainer');

  return (
    <div className="min-h-screen bg-dark-950 flex flex-col pt-16 md:pt-20">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        {!sidebarOpen && (
           <button onClick={() => setSidebarOpen(true)} className="fixed bottom-4 right-4 z-40 lg:hidden w-12 h-12 bg-primary-500 rounded-full flex items-center justify-center text-white shadow-glow">
             <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
           </button>
        )}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 lg:ml-64 transition-all duration-300">
          <div className="max-w-6xl mx-auto">
            <header className="mb-8">
              <h1 className="text-3xl font-display font-bold text-white mb-2">Admin Dashboard</h1>
              <p className="text-dark-400">Welcome back, {user.name} 👋</p>
            </header>
            
            <Routes>
              <Route path="/" element={<AdminOverview stats={stats} />} />
              <Route path="/members" element={<MembersTab members={members} />} />
              <Route path="/trainers" element={<TrainersTab trainers={trainers} />} />
              <Route path="/classes" element={
                <div className="space-y-8">
                  <ScheduleCalendar />
                  <h2 className="text-xl font-bold text-white">All Classes</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {mockClasses.map(c => <ClassCard key={c.id} classData={c} />)}
                  </div>
                </div>
              } />
              <Route path="/payments" element={
                <div className="glass-card p-6">
                  <h2 className="text-xl font-bold text-white mb-6">Recent Payments</h2>
                  <div className="space-y-3">
                    {mockPayments.map(p => <PaymentCard key={p.id} payment={p} />)}
                  </div>
                </div>
              } />
              <Route path="/attendance" element={<AttendanceTracker />} />
              <Route path="/subscriptions" element={<SubscriptionPlan />} />
              <Route path="/profile" element={<ProfileSettings />} />
            </Routes>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
