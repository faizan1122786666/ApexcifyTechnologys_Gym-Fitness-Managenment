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
import { useAuth } from '../../context/AuthContext';
import { memberService, trainerService, classService, paymentService } from '../../services/api';
import { toast } from 'react-toastify';


// Fallback static data for dashboard stats (can be moved to backend later if API exists)
const defaultStats = { totalMembers: 0, totalTrainers: 0, monthlyRevenue: 0, newSignups: 0 };

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

const MembersTab = ({ members, setMembers }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', password: 'member123', plan: 'Basic' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const itemsPerPage = 5;

  const totalPages = Math.ceil(members.length / itemsPerPage);
  const currentMembers = members.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleCreateMember = async () => {
    if (!formData.name || !formData.email) return;
    setIsSubmitting(true);
    try {
      // Create new member via api
      // Note: Default password is 'member123' for manual admin creations
      const res = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: formData.name, email: formData.email, password: formData.password, role: 'member', membership: formData.plan })
      });
      const data = await res.json();
      if (data.success || res.status === 201) {
          setMembers([...members, data.user || data.data || { ...formData, _id: data._id || Date.now().toString(), role: 'member' }]);
          setShowModal(false);
          setFormData({ name: '', email: '', password: '', plan: 'Basic' });
          toast.success('Member created successfully!');
       } else {
          toast.error(data.message || 'Failed to create member');
       }
    } catch (err) {
      toast.error('Error connecting to backend.');
    } finally {

      setIsSubmitting(false);
    }
  };

  const [editUser, setEditUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const { authService } = await import('../../services/api');
      const res = await authService.adminUpdateUser(editUser._id, {
        name: editUser.name,
        email: editUser.email,
        password: editUser.password,
        role: 'member'
      });
      if (res.data) {
        setMembers(members.map(m => m._id === editUser._id ? { ...m, ...res.data } : m));
        setIsEditing(false);
        setEditUser(null);
        toast.success('Member updated successfully!');
      }
    } catch (err) {
      toast.error('Failed to update member');
    } finally {
      setIsSubmitting(false);
    }

  };


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
            <div className="flex items-center gap-2">
               <button onClick={() => { setEditUser({ ...m, password: '' }); setIsEditing(true); }} className="p-2 text-primary-400 hover:text-primary-300 transition-colors">
                 <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
               </button>
               <button className="p-2 text-dark-400 hover:text-white transition-colors"><MoreVertical className="w-5 h-5" /></button>
            </div>

          </div>
        ))}
      </div>
      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />

      {/* Add Member Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="glass-card w-full max-w-md p-6 animate-slide-up relative">
            <button onClick={() => setShowModal(false)} className="absolute top-4 right-4 text-dark-400 hover:text-white"><X className="w-5 h-5"/></button>
            <h3 className="text-xl font-bold text-white mb-6">Create New Member</h3>
            <div className="space-y-4">
              <div><label className="text-sm text-dark-300 block mb-1">Full Name</label><input type="text" className="input-field" placeholder="John Doe" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} /></div>
              <div><label className="text-sm text-dark-300 block mb-1">Email</label><input type="email" className="input-field" placeholder="john@example.com" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} /></div>
              <div><label className="text-sm text-dark-300 block mb-1">Temporary Password</label><input type="password" className="input-field" placeholder="••••••••" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} /></div>
              <div><label className="text-sm text-dark-300 block mb-1">Plan</label>
                <select className="input-field" value={formData.plan} onChange={e => setFormData({...formData, plan: e.target.value})}><option>Basic</option><option>Premium</option><option>Elite</option></select>
              </div>
              <button disabled={isSubmitting} onClick={handleCreateMember} className="btn-primary w-full mt-4">{isSubmitting ? 'Creating...' : 'Create Member'}</button>
            </div>

          </div>
        </div>
      )}
      {/* Edit Member Modal */}
      {isEditing && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-card w-full max-w-md p-6 relative">
            <button onClick={() => setIsEditing(false)} className="absolute top-4 right-4 text-dark-400 hover:text-white"><X className="w-5 h-5"/></button>
            <h3 className="text-xl font-bold text-white mb-6">Edit Member / Reset Password</h3>
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div><label className="text-sm text-dark-300 block mb-1">Full Name</label><input type="text" className="input-field" value={editUser.name} onChange={e => setEditUser({...editUser, name: e.target.value})} /></div>
              <div><label className="text-sm text-dark-300 block mb-1">Email</label><input type="email" className="input-field" value={editUser.email} onChange={e => setEditUser({...editUser, email: e.target.value})} /></div>
              <div><label className="text-sm text-dark-300 block mb-1">New Password (leave blank to keep current)</label><input type="password" className="input-field" placeholder="••••••••" value={editUser.password} onChange={e => setEditUser({...editUser, password: e.target.value})} /></div>
              <button disabled={isSubmitting} type="submit" className="btn-primary w-full mt-4">{isSubmitting ? 'Updating...' : 'Update Member'}</button>
            </form>
          </div>
        </div>
      )}
    </div>

  );
};

const TrainersTab = ({ trainers, setTrainers }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', password: 'trainer123', specialization: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const itemsPerPage = 4;

  const totalPages = Math.ceil(trainers.length / itemsPerPage);
  const currentTrainers = trainers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleCreateTrainer = async () => {
    if (!formData.name || !formData.email) return;
    setIsSubmitting(true);
    try {
      const res = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: formData.name, email: formData.email, password: formData.password, role: 'trainer', specialization: formData.specialization })
      });
      const data = await res.json();
      if (data.success || res.status === 201) {
          setTrainers([...trainers, data.user || data.data || { ...formData, _id: data._id || Date.now().toString(), role: 'trainer', rating: 5 }]);
          setShowModal(false);
          setFormData({ name: '', email: '', password: '', specialization: '' });
          toast.success('Trainer created successfully!');
       } else {
          toast.error(data.message || 'Failed to create trainer');
       }
    } catch (err) {
      toast.error('Error connecting to backend.');
    } finally {
      setIsSubmitting(false);
    }

  };

  const [editTrainer, setEditTrainer] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const { authService } = await import('../../services/api');
      const res = await authService.adminUpdateUser(editTrainer._id, {
        name: editTrainer.name,
        email: editTrainer.email,
        password: editTrainer.password,
        role: 'trainer'
      });
      if (res.data) {
        setTrainers(trainers.map(t => t._id === editTrainer._id ? { ...t, ...res.data } : t));
        setIsEditing(false);
        setEditTrainer(null);
        toast.success('Trainer updated successfully!');
      }
    } catch (err) {
      toast.error('Failed to update trainer');
    } finally {
      setIsSubmitting(false);
    }

  };


  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-white">Our Trainers</h2>
        <button onClick={() => setShowModal(true)} className="btn-primary flex items-center gap-2 text-sm !py-2">
          <Plus className="w-4 h-4" /> Add Trainer
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-6">
        {currentTrainers.map(t => (
          <div key={t._id} className="relative group">
             <TrainerCard trainer={t} />
             <button 
               onClick={() => { setEditTrainer({ ...t, password: '' }); setIsEditing(true); }}
               className="absolute top-2 right-2 p-2 bg-dark-900/80 rounded-full text-primary-400 opacity-0 group-hover:opacity-100 transition-opacity z-10 hover:bg-primary-500 hover:text-white"
             >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
             </button>
          </div>
        ))}

      </div>
      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />

      {/* Add Trainer Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="glass-card w-full max-w-md p-6 animate-slide-up relative">
            <button onClick={() => setShowModal(false)} className="absolute top-4 right-4 text-dark-400 hover:text-white"><X className="w-5 h-5"/></button>
            <h3 className="text-xl font-bold text-white mb-6">Create New Trainer</h3>
            <div className="space-y-4">
              <div><label className="text-sm text-dark-300 block mb-1">Full Name</label><input type="text" className="input-field" placeholder="Jane Doe" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} /></div>
              <div><label className="text-sm text-dark-300 block mb-1">Email</label><input type="email" className="input-field" placeholder="jane@fitnessdesk.com" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} /></div>
              <div><label className="text-sm text-dark-300 block mb-1">Initial Password</label><input type="password" className="input-field" placeholder="••••••••" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} /></div>
              <div><label className="text-sm text-dark-300 block mb-1">Specialization</label><input type="text" className="input-field" placeholder="e.g. Yoga & Pilates" value={formData.specialization} onChange={e => setFormData({...formData, specialization: e.target.value})} /></div>

              <button disabled={isSubmitting} onClick={handleCreateTrainer} className="btn-primary w-full mt-4">{isSubmitting ? 'Creating...' : 'Create Trainer'}</button>
            </div>
          </div>
        </div>
      )}
      {/* Edit Trainer Modal */}
      {isEditing && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-card w-full max-w-md p-6 relative">
            <button onClick={() => setIsEditing(false)} className="absolute top-4 right-4 text-dark-400 hover:text-white"><X className="w-5 h-5"/></button>
            <h3 className="text-xl font-bold text-white mb-6">Edit Trainer / Reset Password</h3>
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div><label className="text-sm text-dark-300 block mb-1">Full Name</label><input type="text" className="input-field" value={editTrainer.name} onChange={e => setEditTrainer({...editTrainer, name: e.target.value})} /></div>
              <div><label className="text-sm text-dark-300 block mb-1">Email</label><input type="email" className="input-field" value={editTrainer.email} onChange={e => setEditTrainer({...editTrainer, email: e.target.value})} /></div>
              <div><label className="text-sm text-dark-300 block mb-1">New Password (leave blank to keep current)</label><input type="password" className="input-field" placeholder="••••••••" value={editTrainer.password} onChange={e => setEditTrainer({...editTrainer, password: e.target.value})} /></div>
              <button disabled={isSubmitting} type="submit" className="btn-primary w-full mt-4">{isSubmitting ? 'Updating...' : 'Update Trainer'}</button>
            </form>
          </div>
        </div>
      )}
    </div>

  );
};

const ClassesTab = ({ classes, trainers, setClasses }) => {
  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({ 
    className: '', 
    description: '', 
    trainer: '', 
    day: 'Monday', 
    time: '09:00', 
    capacity: 20, 
    price: 0,
    image: ''
  });

  const handleCreateClass = async () => {
    if (!formData.className || !formData.trainer || !formData.description) {
      alert('Please fill in all required fields');
      return;
    }
    setIsSubmitting(true);
    try {
      const res = await classService.create(formData);
      if (res.data) {
        setClasses([...classes, res.data]);
        setShowModal(false);
        setFormData({ className: '', description: '', trainer: '', day: 'Monday', time: '09:00', capacity: 20, price: 0, image: '' });
        toast.success('Class scheduled successfully!');
      }
    } catch (err) {
      toast.error('Failed to create class. Please try again.');
    } finally {
      setIsSubmitting(false);
    }

  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center bg-dark-900 shadow-xl p-4 rounded-xl border border-white/5">
         <h2 className="text-xl font-bold text-white uppercase tracking-wider">Class Schedule & Management</h2>
         <button onClick={() => setShowModal(true)} className="btn-primary flex items-center gap-2 !py-2 shadow-glow">
            <Plus className="w-4 h-4" /> Add New Class
         </button>
      </div>

      <ScheduleCalendar />
      
      <h2 className="text-xl font-bold text-white mb-6">Active Classes Directory</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {classes.length > 0 ? (
          classes.map(c => <ClassCard key={c.id || c._id} classData={c} />)
        ) : (
          <div className="col-span-full py-12 text-center glass-card">
            <p className="text-dark-500">No classes found. Start by adding one!</p>
          </div>
        )}
      </div>

      {/* Add Class Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md flex justify-center items-start p-4 animate-fade-in overflow-y-auto pt-20 pb-10">
          <div className="glass-card w-full max-w-2xl p-6 md:p-8 animate-slide-up relative">

            <button onClick={() => setShowModal(false)} className="absolute top-4 right-4 text-dark-400 hover:text-white transition-colors">
              <X className="w-6 h-6"/>
            </button>
            
            <div className="mb-6">
              <h3 className="text-2xl font-display font-bold text-white mb-1">Create New Class</h3>
              <p className="text-dark-400 text-sm">Fill in the details below to schedule a new gym session.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="text-sm font-semibold text-dark-300 block mb-2">Class Name</label>
                <input type="text" className="input-field" placeholder="e.g. Advanced CrossFit" value={formData.className} onChange={e => setFormData({...formData, className: e.target.value})} />
              </div>
              <div className="md:col-span-2">
                <label className="text-sm font-semibold text-dark-300 block mb-2">Detailed Description</label>
                <textarea className="input-field min-h-[80px]" placeholder="What will members learn in this class?" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
              </div>
              
              <div>
                <label className="text-sm font-semibold text-dark-300 block mb-2">Assign Trainer</label>
                <select className="input-field" value={formData.trainer} onChange={e => setFormData({...formData, trainer: e.target.value})}>
                  <option value="">Select a Trainer</option>
                  {trainers.map(t => <option key={t._id} value={t._id}>{t.name}</option>)}
                </select>
              </div>
              
              <div>
                <label className="text-sm font-semibold text-dark-300 block mb-2">Day of Week</label>
                <select className="input-field" value={formData.day} onChange={e => setFormData({...formData, day: e.target.value})}>
                  {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(d => <option key={d}>{d}</option>)}
                </select>
              </div>

              <div>
                <label className="text-sm font-semibold text-dark-300 block mb-2">Start Time</label>
                <input type="time" className="input-field" value={formData.time} onChange={e => setFormData({...formData, time: e.target.value})} />
              </div>

              <div>
                <label className="text-sm font-semibold text-dark-300 block mb-2">Class Capacity</label>
                <input type="number" className="input-field" value={formData.capacity} onChange={e => setFormData({...formData, capacity: Number(e.target.value)})} />
              </div>

              <div>
                <label className="text-sm font-semibold text-dark-300 block mb-2">Session Price ($)</label>
                <input type="number" className="input-field" value={formData.price} onChange={e => setFormData({...formData, price: Number(e.target.value)})} />
              </div>

              <div>
                <label className="text-sm font-semibold text-dark-300 block mb-2">Image URL (Optional)</label>
                <input type="text" className="input-field" placeholder="https://..." value={formData.image} onChange={e => setFormData({...formData, image: e.target.value})} />
              </div>
            </div>

            <div className="mt-8 flex gap-4">
              <button onClick={() => setShowModal(false)} className="btn-secondary flex-1">Cancel</button>
              <button disabled={isSubmitting} onClick={handleCreateClass} className="btn-primary flex-1 shadow-glow">
                {isSubmitting ? 'Creating...' : 'Create Class'}
              </button>
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
  
  const [members, setMembers] = useState([]);
  const [trainers, setTrainers] = useState([]);
  const [classes, setClasses] = useState([]);
  const [payments, setPayments] = useState([]);
  const [stats, setStats] = useState(defaultStats);
  const [isLoading, setIsLoading] = useState(true);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const [membersRes, trainersRes, classesRes, paymentsRes] = await Promise.all([
          memberService.getAll().catch(() => ({ data: [] })),
          trainerService.getAll().catch(() => ({ data: [] })),
          classService.getAll().catch(() => ({ data: [] })),
          paymentService.getAll().catch(() => ({ data: [] }))
        ]);

        const loadedMembers = Array.isArray(membersRes.data) ? membersRes.data : [];
        const loadedTrainers = Array.isArray(trainersRes.data) ? trainersRes.data : [];
        const loadedClasses = Array.isArray(classesRes.data) ? classesRes.data : [];
        const loadedPayments = Array.isArray(paymentsRes.data) ? paymentsRes.data : [];

        setMembers(loadedMembers);
        setTrainers(loadedTrainers);
        setClasses(loadedClasses);
        setPayments(loadedPayments);
        
        setStats({
           totalMembers: loadedMembers.length,
           totalTrainers: loadedTrainers.length,
           monthlyRevenue: loadedPayments.reduce((acc, curr) => acc + (curr.amount || 0), 0),
           newSignups: loadedMembers.filter(m => new Date(m.createdAt) > new Date(Date.now() - 30*24*60*60*1000)).length || 0
        });
      } catch (error) {
        console.error("Failed to fetch admin data", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    if (user) {
      fetchData();
    }
  }, [user]);

  if (!user || (!isAdmin && user.role !== 'admin')) {
    navigate('/login');
    return null;
  }

  if (isLoading) {
    return <div className="min-h-screen bg-dark-950 flex items-center justify-center text-primary-500 font-bold text-xl uppercase tracking-widest animate-pulse">Loading FitnessDesk Admin...</div>;
  }

  return (
    <div className="min-h-screen bg-dark-950 flex flex-col pt-16 md:pt-20">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        {!sidebarOpen && (
           <button onClick={() => setSidebarOpen(true)} className="fixed bottom-4 right-4 z-40 lg:hidden w-12 h-12 bg-primary-500 rounded-full flex items-center justify-center text-white shadow-glow hover:scale-110 transition-transform">
             <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
           </button>
        )}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 lg:ml-64 transition-all duration-300">
          <div className="max-w-6xl mx-auto">
            <header className="mb-8 p-6 glass-card border-l-4 border-l-primary-500">
              <h1 className="text-3xl font-display font-bold text-white mb-2 tracking-tight">Admin Control Center</h1>
              <p className="text-dark-400 font-medium">System status: <span className="text-emerald-400">Operational</span> • Welcome, {user.name}</p>
            </header>
            
            <Routes>
              <Route path="/" element={<AdminOverview stats={stats} />} />
              <Route path="/members" element={<MembersTab members={members} setMembers={setMembers} />} />
              <Route path="/trainers" element={<TrainersTab trainers={trainers} setTrainers={setTrainers} />} />
              <Route path="/classes" element={<ClassesTab classes={classes} trainers={trainers} setClasses={setClasses} />} />
              <Route path="/payments" element={
                <div className="glass-card p-6">
                  <h2 className="text-xl font-bold text-white mb-6 uppercase tracking-wider">Financial Transactions</h2>
                  <div className="space-y-3">
                    {payments.length > 0 ? (
                      payments.map(p => <PaymentCard key={p.id || p._id} payment={p} />)
                    ) : (
                      <p className="text-dark-500 text-center py-8 italic">No payment records found.</p>
                    )}
                  </div>
                </div>
              } />
              <Route path="/attendance" element={<AttendanceTracker />} />
              <Route path="/subscriptions" element={
                <div className="space-y-6">
                   <h2 className="text-xl font-bold text-white uppercase tracking-wider">Subscription Management</h2>
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


export default AdminDashboard;
