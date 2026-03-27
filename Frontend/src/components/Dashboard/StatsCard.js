import React from 'react';

const StatsCard = ({ icon, title, value, change, changeType, subtitle }) => {
  return (
    <div className="glass-card-hover p-6 group">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-dark-400 text-sm font-medium">{title}</p>
          <p className="text-3xl font-display font-bold text-white mt-2">{value}</p>
          {subtitle && <p className="text-dark-500 text-xs mt-1">{subtitle}</p>}
        </div>
        <div className="w-12 h-12 bg-gradient-to-br from-primary-500/20 to-accent-emerald/20 rounded-xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform duration-300">
          {icon}
        </div>
      </div>
      {change !== undefined && (
        <div className="flex items-center gap-1 mt-3">
          <span className={`text-sm font-medium ${changeType === 'up' ? 'text-emerald-400' : 'text-red-400'}`}>
            {changeType === 'up' ? '↑' : '↓'} {change}%
          </span>
          <span className="text-dark-500 text-xs">vs last month</span>
        </div>
      )}
    </div>
  );
};

export default StatsCard;
