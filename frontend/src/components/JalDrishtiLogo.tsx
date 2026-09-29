import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const JalDrishtiLogo: React.FC<LogoProps> = ({ className = '', size = 'md' }) => {
  const dimensions = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-12 h-12',
  }[size];

  return (
    <div className={`relative flex items-center justify-center rounded-xl bg-gradient-to-br from-slate-900 via-brand-800 to-brand-600 text-white shadow-md p-1.5 ${dimensions} ${className}`}>
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-full h-full text-white"
      >
        {/* Water Drop Contour */}
        <path d="M12 2.5C12 2.5 5.5 10 5.5 14.5C5.5 18.0899 8.41015 21 12 21C15.5899 21 18.5 18.0899 18.5 14.5C18.5 10 12 2.5 12 2.5Z" fill="#0284c7" fillOpacity="0.4" stroke="#e0f2fe" />
        {/* Sun Core */}
        <circle cx="12" cy="11" r="2.5" fill="#f59e0b" stroke="#fef3c7" strokeWidth="1" />
        {/* Sprout Leaf Base */}
        <path d="M12 18.5C12 18.5 10 16 10 14.5C10 13.5 11 13 12 14.5C13 13 14 13.5 14 14.5C14 16 12 18.5 12 18.5Z" fill="#16a34a" />
      </svg>
    </div>
  );
};
