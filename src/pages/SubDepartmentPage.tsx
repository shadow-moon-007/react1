import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Layers,
  ShieldCheck,
  CheckCircle2,
  Users,
  Bell,
  FolderOpen,
  Mail,
  Phone,
  ArrowRight,
  ChevronRight,
} from 'lucide-react';
import { intranetService } from '../services/intranetService';
import {
  SubDepartment,
  Team,
  Employee,
  Announcement,
  ResourceItem,
} from '../types';
import { Breadcrumbs } from '../components/ui/Breadcrumbs';
import { TeamCard } from '../components/organization/TeamCard';
import { ManagerCard } from '../components/organization/ManagerCard';
import { AnnouncementCard } from '../components/content/AnnouncementCard';
import { ResourceCard } from '../components/content/ResourceCard';

export const SubDepartmentPage: React.FC = () => {
  const { subDepartmentId } = useParams<{ subDepartmentId: string }>();
  const [subDepartment, setSubDepartment] = useState<SubDepartment | null>(null);
  const [teams, setTeams] = useState<Team[]>([]);
  const [manager, setManager] = useState<Employee | null>(null);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [resources, setResources] = useState<ResourceItem[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      if (!subDepartmentId) return;
      const sd = await intranetService.getSubDepartment(subDepartmentId);
      if (sd) {
        setSubDepartment(sd);
        const [tms, emps, anns, res] = await Promise.all([
          intranetService.getTeams(subDepartmentId),
          intranetService.getEmployees(),
          intranetService.getAnnouncements(),
          intranetService.getResources('All', subDepartmentId),
        ]);
        setTeams(tms);
        setEmployees(emps);
        const mgr = emps.find((e) => e.id === sd.managerId);
        setManager(mgr || null);

        // Filter targeted announcements for this sub-department
        const targetedAnns = anns.filter(
          (a) =>
            a.audience === 'Entire GBS' ||
            a.audience === sd.name ||
            a.subDepartmentId === sd.id
        );
        setAnnouncements(targetedAnns);
        setResources(res);
      }
    };
    fetchData();
    const unsubscribe = intranetService.subscribe(fetchData);
    return () => unsubscribe();
  }, [subDepartmentId]);

  if (!subDepartment) {
    return (
      <div className="py-12 text-center text-sm text-[#6B6B6B]">
        Sub-department not found. Return to{' '}
        <Link to="/organization" className="text-[#C8102E] underline">
          Organization Tree
        </Link>
        .
      </div>
    );
  }

  const totalMembers = teams.reduce((acc, t) => acc + t.memberIds.length, 0);

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <Breadcrumbs
        items={[
          { label: 'Organization', to: '/organization' },
          { label: subDepartment.name },
        ]}
      />

      {/* 1. Header & Sub-Department Details */}
      <section className="bg-white border border-[#E3E3E3] rounded-md p-6 sm:p-8">
        <div className="flex items-center gap-2 text-xs font-semibold text-[#8F0B20] uppercase tracking-wider mb-2">
          <Layers className="w-4 h-4 text-[#C8102E]" />
          <span>Sub-Department Charter · {subDepartment.code}</span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#111111] tracking-tight mb-2">
          {subDepartment.name}
        </h1>

        <p className="text-base text-[#6B6B6B] leading-relaxed mb-6">
          {subDepartment.description}
        </p>

        {/* Manager Card */}
        {manager && (
          <div className="mb-6">
            <div className="text-xs font-bold text-[#111111] uppercase tracking-wider mb-2">
              Sub-Department Leadership
            </div>
            <ManagerCard manager={manager} teamName={subDepartment.name} />
          </div>
        )}

        {/* Quick Snapshot */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-[#F6F6F6] border border-[#E3E3E3] rounded-md text-xs">
          <div>
            <div className="text-[#6B6B6B]">Sub-Department Code</div>
            <div className="font-mono font-bold text-[#111111] text-sm">{subDepartment.code}</div>
          </div>
          <div>
            <div className="text-[#6B6B6B]">Engineering Teams</div>
            <div className="font-mono font-bold text-[#111111] text-sm">{teams.length} Teams</div>
          </div>
          <div>
            <div className="text-[#6B6B6B]">Total Staff</div>
            <div className="font-mono font-bold text-[#111111] text-sm">{totalMembers} Engineers</div>
          </div>
          <div>
            <div className="text-[#6B6B6B]">Primary Focus</div>
            <div className="font-semibold text-[#111111] truncate">{subDepartment.primaryFocus}</div>
          </div>
        </div>
      </section>

      {/* 2. Responsibilities */}
      <section className="bg-white border border-[#E3E3E3] rounded-md p-6 sm:p-8">
        <h2 className="text-lg font-bold text-[#111111] mb-3">
          Sub-Department Responsibilities & Scope
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-[#6B6B6B]">
          {subDepartment.responsibilities.map((resp, i) => (
            <div key={i} className="flex items-start gap-2.5 p-3 bg-[#F6F6F6] rounded border border-[#E3E3E3]">
              <CheckCircle2 className="w-4 h-4 text-[#C8102E] shrink-0 mt-0.5" />
              <span className="text-[#111111] leading-relaxed">{resp}</span>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Teams Grid */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold text-[#111111]">
              Teams within {subDepartment.name} ({teams.length})
            </h2>
            <p className="text-xs text-[#6B6B6B]">
              Explore individual engineering squads, managers, and member directories
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {teams.map((team) => {
            const teamMgr = employees.find((e) => e.id === team.managerId);
            return (
              <TeamCard
                key={team.id}
                team={team}
                manager={teamMgr}
                subDepartmentId={subDepartment.id}
              />
            );
          })}
        </div>
      </section>

      {/* 4. Sub-Department Announcements & Resources */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Sub-Department Bulletins */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-[#111111]">
              Targeted Announcements
            </h3>
            <span className="text-xs text-[#6B6B6B]">{announcements.length} bulletins</span>
          </div>

          <div className="space-y-3">
            {announcements.length === 0 ? (
              <div className="p-6 bg-white border border-[#E3E3E3] rounded text-xs text-[#6B6B6B] text-center">
                No active announcements for this sub-department.
              </div>
            ) : (
              announcements.slice(0, 3).map((ann) => (
                <AnnouncementCard key={ann.id} announcement={ann} />
              ))
            )}
          </div>
        </section>

        {/* Sub-Department Resources */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-[#111111]">
              Relevant Resources & Runbooks
            </h3>
            <Link
              to="/resources"
              className="text-xs font-semibold text-[#C8102E] hover:underline"
            >
              All Resources
            </Link>
          </div>

          <div className="space-y-3">
            {resources.length === 0 ? (
              <div className="p-6 bg-white border border-[#E3E3E3] rounded text-xs text-[#6B6B6B] text-center">
                No specific resources configured.
              </div>
            ) : (
              resources.slice(0, 3).map((res) => (
                <ResourceCard key={res.id} resource={res} />
              ))
            )}
          </div>
        </section>
      </div>

      {/* 5. Sub-Department Contact & Communication */}
      <section className="bg-white border border-[#E3E3E3] rounded-md p-6">
        <h3 className="text-base font-bold text-[#111111] mb-2">
          Contact & Communication Channels
        </h3>
        <p className="text-xs text-[#6B6B6B] mb-4">
          Direct lines to {subDepartment.name} leadership, triaging channels, and office hubs.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="p-3 bg-[#F6F6F6] border border-[#E3E3E3] rounded">
            <div className="font-semibold text-[#111111] mb-1">Director Contact</div>
            <div className="text-[#6B6B6B]">{manager?.name}</div>
            <a href={`mailto:${manager?.email}`} className="text-[#C8102E] hover:underline block truncate mt-1">
              {manager?.email}
            </a>
          </div>

          <div className="p-3 bg-[#F6F6F6] border border-[#E3E3E3] rounded">
            <div className="font-semibold text-[#111111] mb-1">Office Hubs</div>
            <div className="text-[#6B6B6B]">Seattle Tech Hub · Floor 4</div>
            <div className="text-[#6B6B6B]">Austin Tech Center · Bldg 2</div>
          </div>

          <div className="p-3 bg-[#F6F6F6] border border-[#E3E3E3] rounded">
            <div className="font-semibold text-[#111111] mb-1">Support Escalations</div>
            <div className="text-[#6B6B6B]">PagerDuty Follow-The-Sun Tier-1</div>
            <Link to="/contact" className="text-[#C8102E] hover:underline block mt-1">
              View on-call schedules →
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
