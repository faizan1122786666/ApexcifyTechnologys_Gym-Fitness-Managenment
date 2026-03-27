import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import Navbar from '../../components/Layout/Navbar';
import Sidebar from '../../components/Layout/Sidebar';
import StatsCard from '../../components/Dashboard/StatsCard';
import ScheduleCalendar from '../../components/ClassScheduling/ScheduleCalendar';
import ClassCard from '../../components/ClassScheduling/ClassCard';
import WorkoutPlan from '../../components/Workout/WorkoutPlan';
import DietPlan from '../../components/Workout/DietPlan';
import ProfileSettings from '../../pages/Profile/ProfileSettings';
import { mockWorkoutPlans, mockDietPlans } from '../../data/staticData';
import { classService, memberService, trainerService } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import UserAvatar from '../../components/Common/UserAvatar';


const TrainerOverview = ({ stats }) => (
  <>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      <StatsCard title="Assigned Members" value={stats.assignedMembers} icon="👥" />
      <StatsCard title="Classes Today" value={stats.classesToday} icon="📅" />
      <StatsCard title="Active Classes" value={stats.activeClasses} icon="⏰" />
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2">
        <ScheduleCalendar />
      </div>
      <div className="lg:col-span-1">
        <div className="glass-card p-6 min-h-[400px]">
           <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
           <div className="space-y-4">
              <button className="w-full btn-primary !bg-white/5 !text-white hover:!bg-primary-500/10 flex items-center justify-center gap-2">
                 📝 Create Workout Plan
              </button>
              <button className="w-full btn-primary !bg-white/5 !text-white hover:!bg-primary-500/10 flex items-center justify-center gap-2">
                 🥗 Create Diet Plan
              </button>
              <button className="w-full btn-primary !bg-white/5 !text-white hover:!bg-primary-500/10 flex items-center justify-center gap-2">
                 📋 Manage Attendance
              </button>
           </div>
        </div>
      </div>
    </div>
  </>
);

const TrainerDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, isTrainer } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({ assignedMembers: 0, classesToday: 0, activeClasses: 0 });

  const [myClasses, setMyClasses] = useState([]);
  const [assignedMembers, setAssignedMembers] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      try {
        const [classesRes, membersRes] = await Promise.all([
          classService.getAll().catch(() => ({ data: [] })),
          trainerService.getMembers().catch(() => ({ data: [] }))
        ]);
        
        const allSystemClasses = Array.isArray(classesRes.data) ? classesRes.data : [];
        const trainerClasses = allSystemClasses.filter(c => (c.trainer && c.trainer._id === user._id) || c.trainer === user._id);
        const trainerMembers = Array.isArray(membersRes.data) ? membersRes.data : [];

        setMyClasses(trainerClasses);
        setAssignedMembers(trainerMembers);
        
        setStats({
          assignedMembers: trainerMembers.length,
          classesToday: trainerClasses.filter(c => c.schedule.day === new Intl.DateTimeFormat('en-US', { weekday: 'long' }).format(new Date())).length,
          activeClasses: trainerClasses.length
        });
      } catch (err) {
        console.error("Failed to load trainer data", err);
      }
    };
    
    fetchData();
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
              <h1 className="text-3xl font-display font-bold text-white mb-2">Trainer Dashboard</h1>
              <p className="text-dark-400">Welcome back, {user.name} 👋</p>
            </header>

            <Routes>
              <Route path="/" element={<TrainerOverview stats={stats} />} />
              <Route path="/classes" element={
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {myClasses.map(c => <ClassCard key={c.id} classData={c} />)}
                </div>
              } />
              <Route path="/members" element={
                <div className="glass-card p-6">
                  <h2 className="text-xl font-bold text-white mb-4">Assigned Members</h2>
                  <div className="space-y-4">{assignedMembers.map(m => (
                    <div key={m._id} className="flex flex-col sm:flex-row justify-between sm:items-center bg-white/5 p-4 rounded-xl hover:bg-white/10 gap-4">
                      <div className="flex items-center gap-4">
                        <UserAvatar src={m.profilePic} name={m.name} size="md" />
                        <div>
                          <p className="font-semibold text-white">{m.name}</p>
                          <p className="text-sm text-dark-400">{m.email}</p>
                          <p className="text-[10px] text-dark-500 uppercase font-bold mt-1 tracking-wider">Joined {new Date(m.joinedAt).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                         <button className="px-3 py-1 bg-primary-500/10 text-primary-400 text-xs rounded-lg hover:bg-primary-500 hover:text-white transition-colors">Assign Diet</button>
                         <button className="px-3 py-1 bg-accent-emerald/10 text-emerald-400 text-xs rounded-lg hover:bg-emerald-500 hover:text-white transition-colors">Assign Workout</button>
                      </div>
                    </div>
                  ))}</div>

                </div>
              } />
              <Route path="/workouts" element={
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {mockWorkoutPlans.map(w => <WorkoutPlan key={w.id} plan={w} />)}
                </div>
              } />
              <Route path="/diets" element={
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {mockDietPlans.map(d => <DietPlan key={d.id} plan={d} />)}
                </div>
              } />
              <Route path="/profile" element={<ProfileSettings />} />
              <Route path="/schedule" element={<ScheduleCalendar />} />
            </Routes>
          </div>
        </main>
      </div>
    </div>
  );
};

export default TrainerDashboard;

