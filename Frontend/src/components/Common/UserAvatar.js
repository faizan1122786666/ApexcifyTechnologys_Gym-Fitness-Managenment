import React from 'react';

const UserAvatar = ({ src, name, size = 'md', className = '' }) => {
  const sizes = {
    xs: 'w-6 h-6 text-[10px]',
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-14 h-14 text-lg',
    xl: 'w-20 h-20 text-2xl',
    '2xl': 'w-32 h-32 text-5xl',
  };

  const isImageUrl = src && (src.startsWith('/') || src.startsWith('http') || src.startsWith('blob'));
  const initials = name ? name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : '?';

  return (
    <div className={`${sizes[size] || sizes.md} rounded-full overflow-hidden flex-shrink-0 ${className}`}>
      {isImageUrl ? (
        <img
          src={src}
          alt={name || 'User'}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.style.display = 'none';
            e.target.nextSibling.style.display = 'flex';
          }}
        />
      ) : null}
      <div
        className={`w-full h-full bg-gradient-to-br from-primary-500 to-accent-emerald flex items-center justify-center text-white font-bold ${isImageUrl ? 'hidden' : 'flex'}`}
        style={isImageUrl ? { display: 'none' } : {}}
      >
        {initials}
      </div>
    </div>
  );
};

export default UserAvatar;
