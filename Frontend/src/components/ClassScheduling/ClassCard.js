import React from 'react';
import { getPercentage } from '../../utils/helpers';

const ClassCard = ({ classData, onEnroll }) => {
  const enrollPercentage = getPercentage(classData.enrolled, classData.capacity);
  const isFull = classData.enrolled >= classData.capacity;

  return (
    <div className="glass-card-hover overflow-hidden group">
      {/* Top Bar Gradient */}
      <div className={`h-1.5 bg-gradient-to-r ${classData.color}`}></div>

      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="w-14 h-14 bg-gradient-to-br from-white/5 to-white/10 rounded-2xl flex items-center justify-center text-3xl group-hover:scale-110 transition-transform duration-300">
            {classData.image}
          </div>
          <span className={`badge ${
            classData.level === 'Beginner' ? 'badge-success' :
            classData.level === 'Intermediate' ? 'badge-warning' :
            classData.level === 'Advanced' ? 'badge-danger' :
            'badge-info'
          }`}>
            {classData.level}
          </span>
        </div>

        {/* Info */}
        <h3 className="text-lg font-semibold text-white mb-1">{classData.name}</h3>
        <p className="text-dark-400 text-sm mb-3 line-clamp-2">{classData.description}</p>

        {/* Schedule */}
        <div className="flex items-center gap-4 text-sm text-dark-400 mb-4">
          <span className="flex items-center gap-1">
            <svg className="w-4 h-4 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {classData.schedule.time}
          </span>
          <span className="flex items-center gap-1">
            <svg className="w-4 h-4 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            {classData.schedule.day}
          </span>
          <span className="flex items-center gap-1">
            <svg className="w-4 h-4 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {classData.schedule.duration}
          </span>
        </div>

        {/* Trainer */}
        <div className="flex items-center gap-2 mb-4">
          <div className="w-6 h-6 bg-primary-500/20 rounded-full flex items-center justify-center text-xs">
            🏋️
          </div>
          <span className="text-sm text-dark-300">{classData.trainerName}</span>
        </div>

        {/* Capacity Bar */}
        <div className="mb-4">
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="text-dark-400">{classData.enrolled}/{classData.capacity} enrolled</span>
            <span className={`font-medium ${isFull ? 'text-red-400' : 'text-primary-400'}`}>{enrollPercentage}%</span>
          </div>
          <div className="w-full h-2 bg-dark-900 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                isFull ? 'bg-red-500' : enrollPercentage > 80 ? 'bg-amber-500' : 'bg-gradient-to-r from-primary-500 to-accent-emerald'
              }`}
              style={{ width: `${enrollPercentage}%` }}
            ></div>
          </div>
        </div>

        {/* Action */}
        <button
          onClick={() => onEnroll && onEnroll(classData.id)}
          disabled={isFull}
          className={`w-full py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${
            isFull
              ? 'bg-dark-800 text-dark-500 cursor-not-allowed'
              : 'bg-primary-500/10 text-primary-400 hover:bg-primary-500 hover:text-white'
          }`}
        >
          {isFull ? 'Class Full' : 'Enroll Now'}
        </button>
      </div>
    </div>
  );
};

export default ClassCard;
