import React from 'react';
import { mockRecentActivity } from '../../data/staticData';

const RecentActivity = () => {
  return (
    <div className="glass-card p-6">
      <h3 className="text-lg font-semibold text-white mb-4">Recent Activity</h3>
      <div className="space-y-3">
        {mockRecentActivity.map((activity) => (
          <div key={activity.id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-colors duration-200">
            <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-lg shrink-0">
              {activity.icon}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-white font-medium truncate">{activity.action}</p>
              <p className="text-xs text-dark-400 truncate">{activity.user}</p>
            </div>
            <span className="text-xs text-dark-500 shrink-0">{activity.time}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentActivity;


