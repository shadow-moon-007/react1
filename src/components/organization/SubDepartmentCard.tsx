import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Layers, UserCheck } from 'lucide-react';
import { SubDepartment, Employee } from '../../types';

interface SubDepartmentCardProps {
  subDepartment: SubDepartment;
  manager?: Employee;
  teamCount: number;
}

export const SubDepartmentCard: React.FC<SubDepartmentCardProps> = ({
  subDepartment,
  manager,
  teamCount,
}) => {
  return (
    <div className="bg-white border border-[#E3E3E3] rounded-md p-6 flex flex-col justify-between hover:border-[#111111] transition-all group">
      <div>
        {/* Top Kicker and Tag */}
        <div className="flex items-center justify-between text-xs text-[#6B6B6B] mb-2">
          <span className="font-mono text-[#8F0B20] font-semibold">{subDepartment.code}</span>
          <span className="flex items-center gap-1 font-mono tabular-nums text-[#111111] font-medium">
            <Layers className="w-3.5 h-3.5 text-[#6B6B6B]" />
            {teamCount} Teams
          </span>
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold text-[#111111] group-hover:text-[#C8102E] transition-colors mb-2">
          <Link to={`/organization/${subDepartment.id}`} className="focus-visible:outline-none focus-visible:underline">
            {subDepartment.name}
          </Link>
        </h3>

        {/* Description */}
        <p className="text-sm text-[#6B6B6B] leading-relaxed mb-4">
          {subDepartment.description}
        </p>

        {/* Manager info */}
        {manager && (
          <div className="p-3 bg-[#F6F6F6] border border-[#E3E3E3] rounded mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-sm bg-[#111111] text-white flex items-center justify-center text-xs font-semibold">
                {manager.initials}
              </div>
              <div>
                <div className="text-[11px] text-[#6B6B6B] uppercase font-semibold tracking-wider">
                  Manager
                </div>
                <div className="text-xs font-bold text-[#111111]">{manager.name}</div>
              </div>
            </div>
            <span className="text-[11px] text-[#6B6B6B] hidden sm:inline">{manager.title}</span>
          </div>
        )}

        {/* Key Responsibilities */}
        {subDepartment.responsibilities && (
          <div className="space-y-1.5 mb-4">
            <div className="text-xs font-semibold text-[#111111]">Key Responsibilities:</div>
            <ul className="text-xs text-[#6B6B6B] space-y-1 list-disc list-inside">
              {subDepartment.responsibilities.slice(0, 3).map((r, i) => (
                <li key={i} className="line-clamp-1">{r}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Action link */}
      <div className="pt-4 border-t border-[#E3E3E3] flex items-center justify-between">
        <span className="text-xs text-[#6B6B6B]">
          Explore hierarchy & teams
        </span>
        <Link
          to={`/organization/${subDepartment.id}`}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#C8102E] hover:text-[#8F0B20] transition-colors group-hover:translate-x-0.5 duration-150"
        >
          <span>View Sub-Department</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
};
