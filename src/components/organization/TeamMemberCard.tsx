import React from 'react';
import { Mail, MapPin } from 'lucide-react';
import { Employee } from '../../types';

interface TeamMemberCardProps {
  employee: Employee;
  teamName?: string;
  onViewProfile?: (employee: Employee) => void;
}

export const TeamMemberCard: React.FC<TeamMemberCardProps> = ({
  employee,
  teamName,
  onViewProfile,
}) => {
  const isManager =
    employee.role === 'Team Manager' ||
    employee.role === 'Operations Manager' ||
    employee.role === 'Sub-Department Director' ||
    employee.role === 'GBS Vice President';

  return (
    <div
      className={`bg-white border rounded-md p-4 transition-colors flex flex-col justify-between ${
        isManager ? 'border-[#111111] shadow-xs' : 'border-[#E3E3E3] hover:border-neutral-400'
      }`}
    >
      <div>
        <div className="flex items-start gap-3">
          <div
            className={`w-10 h-10 rounded-sm flex items-center justify-center font-bold text-xs shrink-0 ${
              isManager
                ? 'bg-[#111111] text-white border border-neutral-900'
                : 'bg-[#F6F6F6] text-[#111111] border border-[#E3E3E3]'
            }`}
          >
            {employee.initials}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-sm font-semibold text-[#111111] truncate">{employee.name}</span>
              {isManager && (
                <span className="text-[10px] font-semibold text-[#8F0B20] bg-red-50 border border-red-200 px-1 py-0.2 rounded-xs">
                  Manager
                </span>
              )}
            </div>
            <div className="text-xs text-[#6B6B6B] truncate">{employee.title}</div>
            {teamName && (
              <div className="text-xs text-[#111111] font-medium mt-0.5 truncate">{teamName}</div>
            )}
          </div>
        </div>

        <div className="mt-3 space-y-1 text-xs text-[#6B6B6B]">
          <div className="flex items-center gap-1.5 truncate">
            <Mail className="w-3.5 h-3.5 text-[#6B6B6B] shrink-0" />
            <a
              href={`mailto:${employee.email}`}
              className="text-[#6B6B6B] hover:text-[#C8102E] truncate hover:underline"
            >
              {employee.email}
            </a>
          </div>
          <div className="flex items-center gap-1.5 truncate">
            <MapPin className="w-3.5 h-3.5 text-[#6B6B6B] shrink-0" />
            <span className="truncate">{employee.location}</span>
          </div>
        </div>

        {employee.skills && employee.skills.length > 0 && (
          <div className="mt-3 pt-2.5 border-t border-[#E3E3E3] text-[11px] text-[#6B6B6B]">
            <span className="font-medium text-[#111111]">Focus: </span>
            <span>{employee.skills.slice(0, 3).join(' · ')}</span>
          </div>
        )}
      </div>

      <div className="mt-3 pt-2.5 border-t border-[#E3E3E3] flex items-center justify-between">
        <a
          href={`mailto:${employee.email}`}
          className="text-xs font-medium text-[#6B6B6B] hover:text-[#111111] transition-colors"
        >
          Send Email
        </a>
        {onViewProfile && (
          <button
            onClick={() => onViewProfile(employee)}
            className="text-xs font-semibold text-[#C8102E] hover:underline"
          >
            View Profile
          </button>
        )}
      </div>
    </div>
  );
};
