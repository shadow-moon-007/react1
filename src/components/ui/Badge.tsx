import React from 'react';

interface StatusTagProps {
  label: string;
  tone?: 'neutral' | 'red' | 'green' | 'amber' | 'blue';
  className?: string;
}

export const StatusTag: React.FC<StatusTagProps> = ({
  label,
  tone = 'neutral',
  className = '',
}) => {
  const tones = {
    neutral: 'text-[#6B6B6B] border border-[#E3E3E3] bg-[#F6F6F6]',
    red: 'text-[#8F0B20] border border-red-200 bg-red-50',
    green: 'text-emerald-800 border border-emerald-200 bg-emerald-50',
    amber: 'text-amber-800 border border-amber-200 bg-amber-50',
    blue: 'text-blue-800 border border-blue-200 bg-blue-50',
  };

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-sm ${tones[tone]} ${className}`}
    >
      {label}
    </span>
  );
};
