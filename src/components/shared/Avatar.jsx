import React, { useState } from 'react';

const Avatar = ({ name = '', src = '', className = '', initialsClassName = '' }) => {
  const [imageError, setImageError] = useState(false);

  const getInitials = (fullName) => {
    if (!fullName) return '?';
    const parts = fullName.trim().split(/\s+/);
    if (parts.length === 1) return parts[0][0].toUpperCase();
    return (parts[0][0] + (parts[parts.length - 1][0] || '')).toUpperCase();
  };

  const hasImage = src && !src.includes('picsum.photos') && !src.includes('placeholder') && !imageError;

  if (hasImage) {
    return (
      <img
        src={src}
        alt={name}
        className={`${className} object-cover`}
        onError={() => setImageError(true)}
      />
    );
  }

  return (
    <div className={`${className} flex items-center justify-center bg-gradient-to-tr from-orange-500 to-amber-300 overflow-hidden`}>
      <span className={`font-bold text-white ${initialsClassName}`}>
        {getInitials(name)}
      </span>
    </div>
  );
};

export default Avatar;
