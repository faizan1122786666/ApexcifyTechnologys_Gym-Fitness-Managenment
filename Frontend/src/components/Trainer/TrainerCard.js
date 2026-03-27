import React from 'react';
import UserAvatar from '../Common/UserAvatar';
import { Star } from 'lucide-react';

const TrainerCard = ({ trainer }) => {
  return (
    <div className="glass-card-hover overflow-hidden group">
      <div className="h-2 bg-gradient-to-r from-primary-500 to-accent-emerald"></div>
      <div className="p-6 text-center">
        {/* Avatar */}
        <div className="mx-auto flex justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
           <div className="ring-2 ring-primary-500/20 rounded-full p-1 bg-gradient-to-br from-primary-500/10 to-accent-emerald/10">
              <UserAvatar src={trainer.avatar} name={trainer.name} size="xl" />
           </div>
        </div>

        {/* Info */}
        <h3 className="text-lg font-semibold text-white">{trainer.name}</h3>
        <p className="text-primary-400 text-sm font-medium mt-1">{trainer.specialization}</p>

        {/* Rating */}
        <div className="flex items-center justify-center gap-1 mt-2">
          <div className="flex">
            {Array.from({ length: 5 }, (_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${i < Math.floor(trainer.rating) ? 'text-amber-400 fill-amber-400' : 'text-dark-700'}`}
              />
            ))}
          </div>
          <span className="text-dark-400 text-sm ml-1">{trainer.rating} <span className="text-[10px]">({trainer.reviews})</span></span>
        </div>

        {/* Bio */}
        <p className="text-dark-400 text-sm mt-3 line-clamp-2">{trainer.bio}</p>

        {/* Details */}
        <div className="flex items-center justify-center gap-4 mt-4 text-xs text-dark-500">
          <span className="flex items-center gap-1">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {trainer.experience}
          </span>
          <span>•</span>
          <span>{trainer.schedule?.join(', ')}</span>
        </div>

        {/* Certifications */}
        <div className="flex flex-wrap justify-center gap-1.5 mt-4">
          {trainer.certifications?.slice(0, 3).map((cert, i) => (
            <span key={i} className="px-2 py-0.5 bg-primary-500/10 text-primary-400 rounded-full text-[10px] font-medium">
              {cert}
            </span>
          ))}
        </div>

        {/* Action */}
        <button className="w-full mt-5 py-2.5 bg-primary-500/10 text-primary-400 rounded-xl text-sm font-medium hover:bg-primary-500 hover:text-white transition-all duration-300">
          View Profile
        </button>
      </div>
    </div>
  );
};

export default TrainerCard;
