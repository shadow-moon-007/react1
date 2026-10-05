import React from 'react';
import { Mail, MessageSquare, MapPin, Phone, ShieldCheck } from 'lucide-react';
import { Employee } from '../../types';

interface ManagerCardProps {
  manager: Employee;
  teamName?: string;
  onSelect?: () => void;
}

export const ManagerCard: React.FC<ManagerCardProps> = ({ manager, teamName, onSelect }) => {
  return (
    <div className="bg-white border-2 border-[#111111] rounded-md p-5 relative overflow-hidden">
      {/* Subtle top indicator bar in corporate red */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-[#C8102E]" />

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-sm bg-[#111111] text-white flex items-center justify-center font-bold text-sm shrink-0 border border-neutral-800">
            {manager.initials}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base font-bold text-[#111111]">{manager.name}</span>
              <span className="text-[11px] font-semibold text-[#8F0B20] bg-red-50 border border-red-200 px-1.5 py-0.2 rounded-xs flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-[#C8102E]" />
                Manager
              </span>
            </div>
            <div className="text-xs text-[#6B6B6B] font-medium">{manager.title}</div>
            {teamName && (
              <div className="text-xs text-[#111111] mt-0.5 font-medium">{teamName}</div>
            )}
          </div>
        </div>

        {/* Contact actions */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <a
            href={`mailto:${manager.email}`}
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#111111] bg-[#F6F6F6] hover:bg-neutral-200 border border-[#E3E3E3] rounded transition-colors"
          >
            <Mail className="w-3.5 h-3.5 text-[#6B6B6B]" />
            <span>Email</span>
          </a>
          <a
            href={`https://teams.microsoft.com/l/chat/0/0?users=${encodeURIComponent(manager.email)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-[#111111] hover:bg-[#222222] rounded transition-colors"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Teams Chat</span>
          </a>
          {onSelect && (
            <button
              onClick={onSelect}
              className="px-2.5 py-1.5 text-xs font-medium text-[#C8102E] hover:underline"
            >
              View Profile
            </button>
          )}
        </div>
      </div>

      {/* Manager location & phone */}
      <div className="mt-3 pt-3 border-t border-[#E3E3E3] flex flex-wrap items-center gap-y-1 gap-x-4 text-xs text-[#6B6B6B]">
        <div className="flex items-center gap-1.5">
          <MapPin className="w-3.5 h-3.5 text-[#6B6B6B] shrink-0" />
          <span>{manager.location}</span>
        </div>
        {manager.phone && (
          <div className="flex items-center gap-1.5">
            <Phone className="w-3.5 h-3.5 text-[#6B6B6B] shrink-0" />
            <span>{manager.phone}</span>
          </div>
        )}
        <div className="text-[#6B6B6B]">
          Direct: <span className="font-mono text-[#111111]">{manager.email}</span>
        </div>
      </div>
    </div>
  );
};
