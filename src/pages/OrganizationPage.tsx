import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  Network,
  Layers,
  Users,
  ChevronDown,
  ChevronRight,
  ArrowRight,
  Search,
  ShieldCheck,
  Mail,
  ExternalLink,
} from 'lucide-react';
import { intranetService } from '../services/intranetService';
import { Department, SubDepartment, Team, Employee } from '../types';
import { Breadcrumbs } from '../components/ui/Breadcrumbs';
import { ManagerCard } from '../components/organization/ManagerCard';
import { TeamMemberCard } from '../components/organization/TeamMemberCard';
import { Modal } from '../components/ui/Modal';

export const OrganizationPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [department, setDepartment] = useState<Department | null>(null);
  const [subDepartments, setSubDepartments] = useState<SubDepartment[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [selectedSubDeptId, setSelectedSubDeptId] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const [dept, sds, tms, emps] = await Promise.all([
        intranetService.getDepartment(),
        intranetService.getSubDepartments(),
        intranetService.getTeams(),
        intranetService.getEmployees(),
      ]);
      setDepartment(dept);
      setSubDepartments(sds);
      setTeams(tms);
      setEmployees(emps);
    };
    fetchData();
    const unsubscribe = intranetService.subscribe(fetchData);
    return () => unsubscribe();
  }, []);

  const deptDirector = employees.find((e) => e.id === department?.managerId);

  const filteredTeams = teams.filter((t) => {
    const matchesSubDept =
      selectedSubDeptId === 'all' || t.subDepartmentId === selectedSubDeptId;
    const matchesQuery =
      !searchQuery ||
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSubDept && matchesQuery;
  });

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <Breadcrumbs items={[{ label: 'GBS Hierarchy Tree' }]} />

      {/* Page Title & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#8F0B20] uppercase tracking-wider mb-1">
            <Network className="w-4 h-4 text-[#C8102E]" />
            <span>GBS Department Architecture</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#111111] tracking-tight">
            GBS Structure & Hierarchy Explorer
          </h1>
          <p className="text-sm text-[#6B6B6B] mt-1">
            Navigating exclusively within Global Business Services: GBS Root → GBS-BTS &amp; GPS-BO → Teams → Managers → Members → Resources.
          </p>
        </div>

        {/* Search filter */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-[#6B6B6B]" />
          <input
            type="text"
            placeholder="Filter GBS teams..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs text-[#111111] bg-white border border-[#E3E3E3] rounded focus-visible:outline-none focus-visible:border-[#C8102E]"
          />
        </div>
      </div>

      {/* 1. Level 1: Department Executive Root: GBS */}
      {department && deptDirector && (
        <div className="bg-white border-2 border-[#111111] rounded-md p-6 relative">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-sm bg-[#111111] text-white flex items-center justify-center text-lg font-bold shrink-0">
                {deptDirector.initials}
              </div>
              <div>
                <div className="text-[11px] font-semibold text-[#8F0B20] uppercase tracking-wider">
                  Level 1 · Department Root
                </div>
                <h2 className="text-xl font-extrabold text-[#111111]">
                  {department.name} ({department.code})
                </h2>
                <div className="text-xs text-[#6B6B6B]">
                  Led by <span className="font-semibold text-[#111111]">{deptDirector.name}</span> ({deptDirector.title})
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Link
                to="/overview"
                className="px-3 py-1.5 text-xs font-semibold text-[#111111] bg-[#F6F6F6] hover:bg-neutral-200 border border-[#E3E3E3] rounded transition-colors inline-flex items-center gap-1"
              >
                <span>GBS Charter</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Filter Segmented Control for Sub-Departments */}
      <div className="flex items-center gap-1 p-1 bg-white border border-[#E3E3E3] rounded-md w-fit">
        <button
          onClick={() => setSelectedSubDeptId('all')}
          className={`px-3 py-1.5 text-xs font-medium rounded transition-colors ${
            selectedSubDeptId === 'all'
              ? 'bg-[#111111] text-white'
              : 'text-[#6B6B6B] hover:text-[#111111]'
          }`}
        >
          Entire GBS ({subDepartments.length} Sub-Departments)
        </button>
        {subDepartments.map((sd) => (
          <button
            key={sd.id}
            onClick={() => setSelectedSubDeptId(sd.id)}
            className={`px-3 py-1.5 text-xs font-medium rounded transition-colors ${
              selectedSubDeptId === sd.id
                ? 'bg-[#111111] text-white'
                : 'text-[#6B6B6B] hover:text-[#111111]'
            }`}
          >
            {sd.name}
          </button>
        ))}
      </div>

      {/* 2. Level 2 & 3: Sub-Departments and their Teams */}
      <div className="space-y-8">
        {subDepartments
          .filter((sd) => selectedSubDeptId === 'all' || sd.id === selectedSubDeptId)
          .map((subDept) => {
            const subTeams = filteredTeams.filter((t) => t.subDepartmentId === subDept.id);
            const manager = employees.find((e) => e.id === subDept.managerId);

            return (
              <div
                key={subDept.id}
                className="bg-white border border-[#E3E3E3] rounded-md overflow-hidden"
              >
                {/* Sub-Department Header Bar */}
                <div className="p-6 border-b border-[#E3E3E3] bg-[#F6F6F6]/60 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 text-xs font-semibold text-[#8F0B20] uppercase tracking-wider mb-1">
                      <Layers className="w-3.5 h-3.5 text-[#C8102E]" />
                      <span>Level 2 · Sub-Department</span>
                    </div>
                    <h3 className="text-xl font-bold text-[#111111]">{subDept.name}</h3>
                    <p className="text-xs text-[#6B6B6B] mt-1 max-w-2xl">
                      {subDept.description}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    {manager && (
                      <div className="flex items-center gap-2.5 bg-white border border-[#E3E3E3] px-3 py-2 rounded">
                        <div className="w-7 h-7 rounded-sm bg-[#111111] text-white flex items-center justify-center text-xs font-bold shrink-0">
                          {manager.initials}
                        </div>
                        <div>
                          <div className="text-[10px] text-[#6B6B6B] uppercase font-semibold">
                            Director
                          </div>
                          <div className="text-xs font-bold text-[#111111]">{manager.name}</div>
                        </div>
                      </div>
                    )}
                    <Link
                      to={`/organization/${subDept.id}`}
                      className="px-3 py-2 text-xs font-bold text-white bg-[#C8102E] hover:bg-[#8F0B20] rounded transition-colors inline-flex items-center gap-1.5"
                    >
                      <span>Explore {subDept.code}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>

                {/* Sub-Department Teams Grid */}
                <div className="p-6">
                  <div className="text-xs font-bold text-[#111111] uppercase tracking-wider mb-4 flex items-center justify-between">
                    <span>Teams Under {subDept.name} ({subTeams.length})</span>
                    <span className="text-[#6B6B6B] font-normal normal-case">
                      Click any team to inspect squad members and responsibilities
                    </span>
                  </div>

                  {subTeams.length === 0 ? (
                    <div className="py-6 text-center text-xs text-[#6B6B6B]">
                      No teams matched your query in this sub-department.
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {subTeams.map((team) => {
                        const teamMgr = employees.find((e) => e.id === team.managerId);
                        return (
                          <div
                            key={team.id}
                            onClick={() => setSelectedTeam(team)}
                            className="border border-[#E3E3E3] hover:border-[#111111] rounded p-4 cursor-pointer transition-all hover:shadow-xs group flex flex-col justify-between"
                          >
                            <div>
                              <div className="flex items-center justify-between text-xs text-[#6B6B6B] mb-1.5">
                                <span className="font-mono text-[#8F0B20] font-semibold">
                                  {team.code}
                                </span>
                                <span className="flex items-center gap-1 font-mono text-[#111111]">
                                  <Users className="w-3.5 h-3.5 text-[#6B6B6B]" />
                                  {team.memberIds.length} Members
                                </span>
                              </div>

                              <h4 className="text-base font-bold text-[#111111] group-hover:text-[#C8102E] transition-colors mb-1">
                                {team.name}
                              </h4>
                              <p className="text-xs text-[#6B6B6B] line-clamp-2 leading-relaxed mb-3">
                                {team.description}
                              </p>

                              {teamMgr && (
                                <div className="text-xs text-[#6B6B6B] pt-2 border-t border-[#E3E3E3] flex items-center justify-between">
                                  <span>
                                    Manager: <strong className="text-[#111111] font-medium">{teamMgr.name}</strong>
                                  </span>
                                  <span className="text-[#C8102E] font-semibold text-[11px] group-hover:underline">
                                    Quick Inspect
                                  </span>
                                </div>
                              )}
                            </div>

                            <div className="mt-3 pt-2 border-t border-[#E3E3E3] flex items-center justify-between">
                              <span className="text-[11px] text-[#6B6B6B]">
                                Focus: {team.keyAreas.slice(0, 2).join(' · ')}
                              </span>
                              <Link
                                to={`/organization/${subDept.id}/teams/${team.id}`}
                                onClick={(e) => e.stopPropagation()}
                                className="text-xs font-semibold text-[#111111] hover:text-[#C8102E] inline-flex items-center gap-1"
                              >
                                <span>Full Page</span>
                                <ArrowRight className="w-3.5 h-3.5" />
                              </Link>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
      </div>

      {/* Team Quick Inspection Modal */}
      {selectedTeam && (
        <Modal
          isOpen={!!selectedTeam}
          onClose={() => setSelectedTeam(null)}
          title={selectedTeam.name}
          subtitle={`Part of ${
            subDepartments.find((s) => s.id === selectedTeam.subDepartmentId)?.name
          }`}
          maxWidth="2xl"
        >
          <div className="space-y-6 text-xs">
            {/* Description */}
            <p className="text-sm text-[#111111] leading-relaxed">
              {selectedTeam.description}
            </p>

            {/* Manager Details */}
            {(() => {
              const mgr = employees.find((e) => e.id === selectedTeam.managerId);
              return mgr ? (
                <div>
                  <div className="text-xs font-bold text-[#111111] uppercase tracking-wider mb-2">
                    Team Manager
                  </div>
                  <ManagerCard manager={mgr} />
                </div>
              ) : null;
            })()}

            {/* Responsibilities */}
            <div>
              <div className="text-xs font-bold text-[#111111] uppercase tracking-wider mb-2">
                Core Responsibilities
              </div>
              <ul className="list-disc list-inside space-y-1 text-xs text-[#6B6B6B]">
                {selectedTeam.responsibilities.map((r, i) => (
                  <li key={i}>{r}</li>
                ))}
              </ul>
            </div>

            {/* Team Roster Preview */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-[#111111] uppercase tracking-wider">
                  Squad Members ({selectedTeam.memberIds.length})
                </span>
                <span className="text-xs text-[#6B6B6B]">
                  Location & Titles
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-56 overflow-y-auto pr-1">
                {employees
                  .filter((e) => selectedTeam.memberIds.includes(e.id))
                  .map((emp) => (
                    <div
                      key={emp.id}
                      onClick={() => setSelectedEmployee(emp)}
                      className="p-2.5 bg-[#F6F6F6] hover:bg-neutral-200 border border-[#E3E3E3] rounded flex items-center justify-between cursor-pointer transition-colors"
                    >
                      <div className="flex items-center gap-2 truncate">
                        <div className="w-6 h-6 rounded-xs bg-[#111111] text-white flex items-center justify-center text-[10px] font-bold shrink-0">
                          {emp.initials}
                        </div>
                        <div className="truncate">
                          <div className="font-semibold text-[#111111] truncate">{emp.name}</div>
                          <div className="text-[11px] text-[#6B6B6B] truncate">{emp.title}</div>
                        </div>
                      </div>
                      <span className="text-[10px] text-[#C8102E] font-medium shrink-0 ml-1">
                        Profile
                      </span>
                    </div>
                  ))}
              </div>
            </div>

            {/* Modal Actions */}
            <div className="pt-4 border-t border-[#E3E3E3] flex items-center justify-between">
              <span className="text-xs text-[#6B6B6B]">
                Contact: <span className="font-mono text-[#111111]">{selectedTeam.contactInfo.email}</span>
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => setSelectedTeam(null)}
                  className="px-3 py-1.5 text-xs font-medium text-[#111111] bg-[#F6F6F6] border border-[#E3E3E3] rounded hover:bg-neutral-200"
                >
                  Close
                </button>
                <Link
                  to={`/organization/${selectedTeam.subDepartmentId}/teams/${selectedTeam.id}`}
                  className="px-3.5 py-1.5 text-xs font-bold text-white bg-[#C8102E] hover:bg-[#8F0B20] rounded inline-flex items-center gap-1.5"
                >
                  <span>Go to Team Page</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* Employee Profile Modal */}
      {selectedEmployee && (
        <Modal
          isOpen={!!selectedEmployee}
          onClose={() => setSelectedEmployee(null)}
          title={selectedEmployee.name}
          subtitle={selectedEmployee.title}
          maxWidth="md"
        >
          <div className="space-y-4 text-xs">
            <div className="flex items-center gap-3.5 p-3 bg-[#F6F6F6] rounded border border-[#E3E3E3]">
              <div className="w-12 h-12 rounded-sm bg-[#111111] text-white flex items-center justify-center font-bold text-sm">
                {selectedEmployee.initials}
              </div>
              <div>
                <div className="text-sm font-bold text-[#111111]">{selectedEmployee.name}</div>
                <div className="text-xs text-[#6B6B6B]">{selectedEmployee.title}</div>
                <div className="text-xs text-[#111111] mt-0.5">{selectedEmployee.location}</div>
              </div>
            </div>

            <div className="space-y-2">
              <div>
                <span className="text-[#6B6B6B]">Email: </span>
                <a
                  href={`mailto:${selectedEmployee.email}`}
                  className="font-mono text-[#C8102E] hover:underline"
                >
                  {selectedEmployee.email}
                </a>
              </div>
              {selectedEmployee.phone && (
                <div>
                  <span className="text-[#6B6B6B]">Direct Phone: </span>
                  <span className="text-[#111111]">{selectedEmployee.phone}</span>
                </div>
              )}
              {selectedEmployee.bio && (
                <div className="pt-2 border-t border-[#E3E3E3]">
                  <div className="font-semibold text-[#111111] mb-1">Background:</div>
                  <p className="text-[#6B6B6B] leading-relaxed">{selectedEmployee.bio}</p>
                </div>
              )}
              {selectedEmployee.skills && selectedEmployee.skills.length > 0 && (
                <div className="pt-2 border-t border-[#E3E3E3]">
                  <div className="font-semibold text-[#111111] mb-1">Core Skills:</div>
                  <div className="flex flex-wrap gap-1">
                    {selectedEmployee.skills.map((s, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 bg-[#F6F6F6] border border-[#E3E3E3] rounded-xs text-[11px] text-[#111111]"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-[#E3E3E3] flex justify-end">
              <button
                onClick={() => setSelectedEmployee(null)}
                className="px-3 py-1.5 text-xs font-semibold text-white bg-[#111111] rounded hover:bg-neutral-800"
              >
                Close Profile
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
