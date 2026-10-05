import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Users, ShieldCheck } from 'lucide-react';
import { Team, Employee } from '../../types';

interface TeamCardProps {
  team: Team;
  manager?: Employee;
  subDepartmentId: string;
}

export const TeamCard: React.FC<TeamCardProps> = ({ team, manager, subDepartmentId }) => {
  return (
    <div className="bg-white border border-[#E3E3E3] rounded-md p-5 flex flex-col justify-between hover:border-[#111111] transition-all group">
      <div>
        {/* Header line */}
        <div className="flex items-center justify-between text-xs text-[#6B6B6B] mb-2">
          <span className="font-mono text-[#8F0B20] font-semibold">{team.code}</span>
          <span className="flex items-center gap-1 font-mono tabular-nums text-[#111111] font-medium">
            <Users className="w-3.5 h-3.5 text-[#6B6B6B]" />
            {team.memberIds.length} Members
          </span>
        </div>

        {/* Team Title */}
        <h4 className="text-base font-bold text-[#111111] group-hover:text-[#C8102E] transition-colors mb-1.5">
          <Link
            to={`/organization/${subDepartmentId}/teams/${team.id}`}
            className="focus-visible:outline-none focus-visible:underline"
          >
            {team.name}
          </Link>
        </h4>

        {/* Description */}
        <p className="text-xs text-[#6B6B6B] leading-relaxed mb-3 line-clamp-2">
          {team.description}
        </p>

        {/* Manager Strip */}
        {manager && (
          <div className="py-2 px-2.5 bg-[#F6F6F6] rounded border border-[#E3E3E3] flex items-center justify-between mb-3 text-xs">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-3.5 h-3.5 text-[#C8102E] shrink-0" />
              <span className="text-[#6B6B6B]">Manager:</span>
              <span className="font-semibold text-[#111111]">{manager.name}</span>
            </div>
          </div>
        )}

        {/* Key Areas / Tech tags */}
        {team.keyAreas && team.keyAreas.length > 0 && (
          <div className="text-[11px] text-[#6B6B6B]">
            <span className="font-medium text-[#111111]">Key Focus: </span>
            <span>{team.keyAreas.slice(0, 3).join(' · ')}</span>
          </div>
        )}
      </div>

      {/* Action link */}
      <div className="pt-3 mt-4 border-t border-[#E3E3E3] flex items-center justify-between">
        <span className="text-xs text-[#6B6B6B]">View roster & resources</span>
        <Link
          to={`/organization/${subDepartmentId}/teams/${team.id}`}
          className="inline-flex items-center gap-1 text-xs font-semibold text-[#C8102E] hover:text-[#8F0B20] transition-colors group-hover:translate-x-0.5 duration-150"
        >
          <span>View Team</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
};
