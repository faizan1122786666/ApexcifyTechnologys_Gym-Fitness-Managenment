import { classService } from '../../services/api';
import React, { useState, useEffect } from 'react';

const ScheduleCalendar = () => {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const [selectedDay, setSelectedDay] = useState('Mon');
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);

  const dayMap = {
    'Mon': 'Monday',
    'Tue': 'Tuesday',
    'Wed': 'Wednesday',
    'Thu': 'Thursday',
    'Fri': 'Friday',
    'Sat': 'Saturday',
    'Sun': 'Sunday'
  };

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        setLoading(true);
        const res = await classService.getAll();
        setClasses(res.data);
      } catch (err) {
        console.error('Error fetching classes:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchClasses();
  }, []);

  const dayClasses = classes.filter(c => c.schedule.day === dayMap[selectedDay]);

  if (loading) {
    return (
      <div className="glass-card p-6 flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="glass-card p-6">
      <h3 className="text-lg font-semibold text-white mb-4">Weekly Schedule</h3>

      {/* Day Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {days.map((day) => (
          <button
            key={day}
            onClick={() => setSelectedDay(day)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 whitespace-nowrap ${selectedDay === day
              ? 'bg-primary-500 text-white shadow-glow'
              : 'bg-white/5 text-dark-400 hover:text-white hover:bg-white/10'
              }`}
          >
            {day}
          </button>
        ))}
      </div>

      {/* Classes for selected day */}
      <div className="space-y-3">
        {dayClasses.length > 0 ? (
          dayClasses.map((cls) => (
            <div key={cls._id} className="flex items-center gap-4 p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-colors duration-200">
              <div className="text-center min-w-[80px]">
                <p className="text-primary-400 font-semibold text-sm">{cls.schedule.time}</p>
                <p className="text-dark-500 text-xs">{cls.duration || '60 min'}</p>
              </div>
              <div className={`w-1 h-12 rounded-full bg-gradient-to-b ${cls.color || 'from-primary-500 to-indigo-600'}`}></div>
              <div className="flex-1">
                <p className="text-white font-medium text-sm">{cls.className}</p>
                <p className="text-dark-400 text-xs">{(cls.trainer && cls.trainer.name) || 'Staff'} • {cls.category || 'Fitness'}</p>
              </div>
              <div className="text-right">
                <p className="text-dark-300 text-xs">{(cls.enrolledMembers && cls.enrolledMembers.length) || 0}/{cls.capacity}</p>
                <span className={`badge text-[10px] ${cls.level === 'Beginner' ? 'badge-success' :
                  cls.level === 'Intermediate' ? 'badge-warning' :
                    cls.level === 'Advanced' ? 'badge-danger' : 'badge-info'
                  }`}>{cls.level || 'All Levels'}</span>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-dark-500">
            <p className="text-3xl mb-2">📅</p>
            <p className="text-sm">No classes scheduled for {dayMap[selectedDay]}</p>
          </div>
        )}
      </div>
    </div>
  );
};


export default ScheduleCalendar;


