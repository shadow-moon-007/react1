import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Building2,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Target,
  FileCheck,
  Users,
} from 'lucide-react';
import { intranetService } from '../services/intranetService';
import { Department, SubDepartment, Team, Employee } from '../types';
import { SubDepartmentCard } from '../components/organization/SubDepartmentCard';
import { Breadcrumbs } from '../components/ui/Breadcrumbs';

export const OverviewPage: React.FC = () => {
  const [department, setDepartment] = useState<Department | null>(null);
  const [subDepartments, setSubDepartments] = useState<SubDepartment[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [director, setDirector] = useState<Employee | null>(null);
  const [employees, setEmployees] = useState<Employee[]>([]);

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
      if (dept) {
        const dir = emps.find((e) => e.id === dept.managerId);
        setDirector(dir || null);
      }
    };
    fetchData();
    const unsubscribe = intranetService.subscribe(fetchData);
    return () => unsubscribe();
  }, []);

  if (!department) return null;

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <Breadcrumbs items={[{ label: 'GBS Department Overview' }]} />

      {/* 1. Department Header */}
      <section className="bg-white border border-[#E3E3E3] rounded-md p-6 sm:p-8">
        <div className="flex items-center gap-2 text-xs font-semibold text-[#8F0B20] uppercase tracking-wider mb-2">
          <Building2 className="w-4 h-4 text-[#C8102E]" />
          <span>GBS Department Charter & Operating Mandate</span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#111111] tracking-tight mb-3">
          Global Business Services (GBS)
        </h1>

        <p className="text-base text-[#6B6B6B] leading-relaxed max-w-3xl mb-6">
          {department.description}
        </p>

        {/* Department Director Card */}
        {director && (
          <div className="p-4 bg-[#F6F6F6] border border-[#E3E3E3] rounded-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-sm bg-[#111111] text-white flex items-center justify-center font-bold text-sm shrink-0">
                {director.initials}
              </div>
              <div>
                <div className="text-[11px] font-semibold text-[#8F0B20] uppercase tracking-wider">
                  GBS Vice President
                </div>
                <div className="text-base font-bold text-[#111111]">{director.name}</div>
                <div className="text-xs text-[#6B6B6B]">{director.title}</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <a
                href={`mailto:${director.email}`}
                className="px-3 py-1.5 text-xs font-medium text-[#111111] bg-white border border-[#E3E3E3] rounded hover:bg-neutral-100 transition-colors"
              >
                Executive Contact
              </a>
            </div>
          </div>
        )}

        {/* Mission Statement */}
        <div className="mt-6 pt-6 border-t border-[#E3E3E3]">
          <div className="flex items-center gap-2 text-xs font-bold text-[#111111] uppercase tracking-wider mb-2">
            <Target className="w-4 h-4 text-[#C8102E]" />
            <span>GBS Mission</span>
          </div>
          <p className="text-sm font-medium text-[#111111] italic leading-relaxed bg-[#F6F6F6] p-4 rounded border-l-4 border-[#C8102E]">
            "{department.mission}"
          </p>
        </div>
      </section>

      {/* 2. Department Introduction & Operational Role */}
      <section className="bg-white border border-[#E3E3E3] rounded-md p-6 sm:p-8">
        <h2 className="text-xl font-bold text-[#111111] mb-3">GBS Operational Role & Mandate</h2>
        <p className="text-sm text-[#6B6B6B] leading-relaxed mb-6">
          {department.charter}
        </p>

        {/* Strategic Pillars */}
        <h3 className="text-sm font-bold text-[#111111] uppercase tracking-wider mb-4 text-[#6B6B6B]">
          Four Strategic Pillars
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {department.strategicPillars.map((pillar, idx) => (
            <div key={idx} className="p-4 bg-[#F6F6F6] border border-[#E3E3E3] rounded">
              <div className="flex items-center gap-2 text-sm font-bold text-[#111111] mb-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#C8102E] shrink-0" />
                <span>{pillar.title}</span>
              </div>
              <p className="text-xs text-[#6B6B6B] leading-relaxed">
                {pillar.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Sub-Departments (Prominent Cards) */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold text-[#111111]">GBS Sub-Departments</h2>
            <p className="text-xs text-[#6B6B6B]">
              Structured exclusively into two specialized arms: GBS-BTS and GPS-BO
            </p>
          </div>
          <Link
            to="/organization"
            className="text-xs font-semibold text-[#C8102E] hover:underline inline-flex items-center gap-1"
          >
            <span>GBS Hierarchy Explorer</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {subDepartments.map((subDept) => {
            const mgr = employees.find((e) => e.id === subDept.managerId);
            const subTeams = teams.filter((t) => t.subDepartmentId === subDept.id);
            return (
              <SubDepartmentCard
                key={subDept.id}
                subDepartment={subDept}
                manager={mgr}
                teamCount={subTeams.length}
              />
            );
          })}
        </div>
      </section>
    </div>
  );
};
