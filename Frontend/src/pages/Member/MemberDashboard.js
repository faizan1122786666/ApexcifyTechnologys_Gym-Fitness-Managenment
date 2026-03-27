import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import Navbar from '../../components/Layout/Navbar';
import Sidebar from '../../components/Layout/Sidebar';
import StatsCard from '../../components/Dashboard/StatsCard';
import WorkoutPlan from '../../components/Workout/WorkoutPlan';
import DietPlan from '../../components/Workout/DietPlan';
import ClassCard from '../../components/ClassScheduling/ClassCard';
import ScheduleCalendar from '../../components/ClassScheduling/ScheduleCalendar';
import AttendanceTracker from '../../components/Attendance/AttendanceTracker';
import PaymentCard from '../../components/Payment/PaymentCard';
import SubscriptionPlan from '../../components/Payment/SubscriptionPlan';
import ProfileSettings from '../../pages/Profile/ProfileSettings';
import { mockWorkoutPlans, mockDietPlans } from '../../data/staticData';
import { classService, paymentService } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const MemberOverview = ({ stats }) => (
  <>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <StatsCard title="Workouts This Week" value={stats.workoutsThisWeek} icon="💪" />
      <StatsCard title="Calories Burned" value={stats.caloriesBurned} icon="🔥" />
      <StatsCard title="Current Streak" value={`${stats.streak} Days`} icon="⚡" />
      <StatsCard title="Total Workouts" value={stats.totalWorkouts} icon="🏆" />
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div>
         <h2 className="text-xl font-bold text-white mb-4">Current Workout Plan</h2>
         <WorkoutPlan plan={mockWorkoutPlans[0]} />
      </div>
      <div>
         <h2 className="text-xl font-bold text-white mb-4">Current Diet Plan</h2>
         <DietPlan plan={mockDietPlans[0]} />
      </div>
    </div>
  </>
);

const MemberDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, isMember } = useAuth();
  const navigate = useNavigate();
  const stats = { workoutsThisWeek: 4, caloriesBurned: 1850, streak: 12, totalWorkouts: 45 };

  const [availableClasses, setAvailableClasses] = useState([]);
  const [myPayments, setMyPayments] = useState([]);

  useEffect(() => {
    if (user) {
      classService.getAll().then(res => setAvailableClasses(res.data.data)).catch(()=>{});
      paymentService.getAll().then(res => setMyPayments(res.data.data)).catch(()=>{});
    }
  }, [user]);

  return (
    <div className="min-h-screen bg-dark-950 flex flex-col pt-16 md:pt-20">
      <Navbar />
      <div className="flex flex-1 relative">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        {!sidebarOpen && (
           <button onClick={() => setSidebarOpen(true)} className="fixed bottom-4 right-4 z-40 lg:hidden w-12 h-12 bg-primary-500 rounded-full flex items-center justify-center text-white shadow-glow">
             <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
           </button>
        )}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 lg:ml-64 transition-all duration-300">
          <div className="max-w-6xl mx-auto">
            <header className="mb-8">
              <h1 className="text-3xl font-display font-bold text-white mb-2">Member Dashboard</h1>
              <p className="text-dark-400">Welcome back, {user.name} 👋</p>
            </header>

            <Routes>
              <Route path="/" element={<MemberOverview stats={stats} />} />
              <Route path="/classes" element={
                <div className="space-y-8">
                  <ScheduleCalendar />
                  <h2 className="text-xl font-bold text-white">Available Classes</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {availableClasses.map(c => <ClassCard key={c.id} classData={c} />)}
                  </div>
                </div>
              } />
              <Route path="/workouts" element={
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {mockWorkoutPlans.map(w => <WorkoutPlan key={w.id} plan={w} />)}
                </div>
              } />
              <Route path="/diet" element={
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {mockDietPlans.map(d => <DietPlan key={d.id} plan={d} />)}
                </div>
              } />
              <Route path="/attendance" element={<AttendanceTracker memberId={user.id} />} />
              <Route path="/payments" element={
                <div className="glass-card p-6">
                  <h2 className="text-xl font-bold text-white mb-6">My Payments History</h2>
                  <div className="space-y-3">
                    {myPayments.map(p => <PaymentCard key={p.id} payment={p} />)}
                  </div>
                </div>
              } />
              <Route path="/subscription" element={
                <div>
                   <h2 className="text-xl font-bold text-white mb-6">Upgrade Plan</h2>
                   <SubscriptionPlan />
                </div>
              } />
              <Route path="/profile" element={<ProfileSettings />} />
            </Routes>
          </div>
        </main>
      </div>
    </div>
  );
};

export default MemberDashboard;

