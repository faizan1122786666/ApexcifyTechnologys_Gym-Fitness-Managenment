import React from 'react';
import UserAvatar from '../Common/UserAvatar';
import { Star } from 'lucide-react';

const TrainerCard = ({ trainer, onEnroll }) => {
  return (
    <div className="glass-card-hover overflow-hidden group h-full flex flex-col">
      <div className="h-2 bg-gradient-to-r from-primary-500 to-accent-emerald"></div>
      <div className="p-6 text-center flex-1 flex flex-col">
        {/* ... existing content ... */}
        <div className="mx-auto flex justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
           <div className="ring-2 ring-primary-500/20 rounded-full p-1 bg-gradient-to-br from-primary-500/10 to-accent-emerald/10">
              <UserAvatar src={trainer.profilePic || trainer.avatar} name={trainer.name} size="xl" />
           </div>
        </div>

        <h3 className="text-lg font-semibold text-white">{trainer.name}</h3>
        <p className="text-primary-400 text-sm font-medium mt-1">{trainer.specialization}</p>

        <p className="text-dark-400 text-sm mt-3 line-clamp-2 flex-1">{trainer.bio || 'Professional fitness coach dedicated to your success and health goals.'}</p>

        <div className="flex items-center justify-center gap-4 mt-4 text-xs text-dark-500">
          <span className="flex items-center gap-1">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {trainer.experience || '5+ Years'}
          </span>
          <span>•</span>
          <span>{trainer.schedule?.join(', ') || 'Flexible'}</span>
        </div>

        <button 
          onClick={() => onEnroll && onEnroll(trainer._id)}
          className="w-full mt-5 py-2.5 bg-primary-500/10 text-primary-400 rounded-xl text-sm font-medium hover:bg-primary-500 hover:text-white transition-all duration-300"
        >
          Enroll Now
        </button>
      </div>
    </div>
  );
};


export default TrainerCard;
