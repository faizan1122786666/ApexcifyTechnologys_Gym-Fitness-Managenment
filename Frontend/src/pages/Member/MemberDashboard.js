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
import { classService, paymentService, reviewService } from '../../services/api';
import { MessageSquarePlus } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';


const MemberOverview = ({ stats }) => {
  const [feedback, setFeedback] = useState('');
  const [feedbackSent, setFeedbackSent] = useState(false);

  const submitFeedback = async () => {
    if (!feedback) return;
    try {
      await reviewService.createReview({ rating: 5, comment: feedback });
      setFeedbackSent(true);
      toast.success('Thank you for your feedback!');
    } catch(err) {
      toast.error('Error submitting feedback');
    }
  };


  const caloriesRemaining = Math.max(0, stats.caloriesTarget - stats.caloriesBurned);

  return (
  <>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <StatsCard title="Workouts This Week" value={stats.workoutsThisWeek} icon="💪" />
      <StatsCard title="Daily Calories" value={stats.caloriesBurned} subtitle={`Target: ${stats.caloriesTarget} kcal`} icon="🔥" />
      <StatsCard title="Calories Remaining" value={caloriesRemaining} subtitle="Fuel your potential" icon="⚡" />
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
    
    {/* Feedback Section */}
    <div className="glass-card p-6 mt-8">
      <div className="flex items-center gap-2 mb-4">
        <MessageSquarePlus className="text-primary-500 w-6 h-6" />
        <h2 className="text-xl font-bold text-white">Leave Us Feedback!</h2>
      </div>
      {feedbackSent ? (
         <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl">Thank you for your feedback! It is now live on the homepage.</div>
      ) : (
         <div className="space-y-4 max-w-lg">
           <p className="text-sm text-dark-400">Your feedback helps us improve the FitnessDesk experience for everyone.</p>
           <div>
             <label className="text-sm text-dark-300 block mb-1">Your detailed experience</label>
             <textarea className="input-field min-h-[100px]" placeholder="Tell us how FitnessDesk transformed your journey..." value={feedback} onChange={e => setFeedback(e.target.value)}></textarea>
           </div>
           <button onClick={submitFeedback} className="btn-primary">Submit Feedback</button>
         </div>
      )}
    </div>
  </>
  );
};


const MemberDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, isMember } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    workoutsThisWeek: 4,
    caloriesBurned: 1850,
    caloriesTarget: 2500, // The fixed goal requested
    streak: 12,
    totalWorkouts: 45
  });

  useEffect(() => {
    if (!user) return;

    // Generate deterministic stats for this user
    const charSum = (user.name + user.email).split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const initialStats = {
      workoutsThisWeek: (charSum % 5) + 2,
      caloriesBurned: (charSum % 1000) + 1200,
      caloriesTarget: 2500,
      streak: (charSum % 20) + 5,
      totalWorkouts: (charSum % 100) + 20
    };
    setStats(initialStats);

    // Live update simulation for "realism"
    const timer = setInterval(() => {
      setStats(prev => ({
        ...prev,
        caloriesBurned: prev.caloriesBurned + 1
      }));
    }, 5000); // add 1 cal every 5 seconds

    return () => clearInterval(timer);
  }, [user]);


  const [availableClasses, setAvailableClasses] = useState([]);
  const [myPayments, setMyPayments] = useState([]);

  useEffect(() => {
    if (user) {
      classService.getAll().then(res => setAvailableClasses(Array.isArray(res.data) ? res.data : [])).catch(() => {});
      paymentService.getMyPayments().then(res => setMyPayments(Array.isArray(res.data) ? res.data : [])).catch(() => {});
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
            <header className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl font-display font-bold text-white mb-2">Member Dashboard</h1>
                <p className="text-dark-400">Welcome back, {user.name} 👋</p>
              </div>
              <button 
                onClick={() => {
                  setStats(prev => ({
                    ...prev,
                    workoutsThisWeek: prev.workoutsThisWeek + 1,
                    totalWorkouts: prev.totalWorkouts + 1
                  }));
                  toast.success('Clocked in! Workout session recorded. 💪');
                }}
                className="btn-primary flex items-center gap-2 group shadow-glow"
              >
                <div className="w-2 h-2 bg-white rounded-full animate-pulse group-hover:scale-125 transition-transform"></div>
                Clock In Now
              </button>
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


