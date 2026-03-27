import React from 'react';

const WorkoutPlan = ({ plan }) => {
  return (
    <div className="glass-card-hover overflow-hidden">
      <div className="h-1.5 bg-gradient-to-r from-primary-500 to-accent-emerald"></div>
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-white">{plan.name}</h3>
            <p className="text-dark-400 text-sm mt-1">{plan.description}</p>
          </div>
          <span className={`badge ${
            plan.level === 'Beginner' ? 'badge-success' :
            plan.level === 'Intermediate' ? 'badge-warning' : 'badge-danger'
          }`}>{plan.level}</span>
        </div>

        <div className="flex items-center gap-4 text-sm text-dark-400 mb-5">
          <span className="flex items-center gap-1">
            <svg className="w-4 h-4 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {plan.duration}
          </span>
          <span className="flex items-center gap-1">
            <svg className="w-4 h-4 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            {plan.trainerName}
          </span>
        </div>

        {/* Exercise List */}
        <div className="space-y-2">
          <p className="text-xs uppercase text-dark-500 font-semibold tracking-wider">Exercises</p>
          {plan.exercises.map((exercise, i) => (
            <div key={i} className="flex items-center justify-between p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-colors">
              <div className="flex items-center gap-3">
                <span className="w-7 h-7 bg-primary-500/20 rounded-lg flex items-center justify-center text-primary-400 text-xs font-bold">
                  {i + 1}
                </span>
                <span className="text-sm text-white">{exercise.name}</span>
              </div>
              <div className="flex items-center gap-3 text-xs text-dark-400">
                <span>{exercise.sets} sets</span>
                <span>×</span>
                <span>{exercise.reps}</span>
                <span className="text-dark-600">|</span>
                <span className="text-primary-400">{exercise.rest} rest</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WorkoutPlan;
