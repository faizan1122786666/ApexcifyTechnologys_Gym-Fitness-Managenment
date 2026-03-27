import React from 'react';

const DietPlan = ({ plan }) => {
  return (
    <div className="glass-card-hover overflow-hidden">
      <div className="h-1.5 bg-gradient-to-r from-emerald-500 to-teal-500"></div>
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-white">{plan.name}</h3>
            <p className="text-dark-400 text-sm mt-1">by {plan.trainerName}</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold gradient-text">{plan.calories}</p>
            <p className="text-dark-500 text-xs">cal/day</p>
          </div>
        </div>

        <div className="inline-flex items-center px-3 py-1 bg-primary-500/10 rounded-full text-primary-400 text-xs font-medium mb-5">
          🎯 Goal: {plan.goal}
        </div>

        {/* Meals */}
        <div className="space-y-3">
          <p className="text-xs uppercase text-dark-500 font-semibold tracking-wider">Daily Meals</p>
          {plan.meals.map((meal, i) => (
            <div key={i} className="flex items-start gap-3 p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-colors">
              <div className="text-center min-w-[50px]">
                <p className="text-primary-400 text-xs font-semibold">{meal.time}</p>
              </div>
              <div className="w-px h-full bg-white/10"></div>
              <div className="flex-1">
                <p className="text-white text-sm font-medium">{meal.name}</p>
                <p className="text-dark-400 text-xs mt-0.5">{meal.items}</p>
              </div>
              <span className="text-xs text-dark-500 shrink-0">{meal.calories} cal</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DietPlan;
