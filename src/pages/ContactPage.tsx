import React, { useState, useEffect } from 'react';
import {
  PhoneCall,
  Mail,
  MessageSquare,
  MapPin,
  ShieldAlert,
  Clock,
  ExternalLink,
} from 'lucide-react';
import { intranetService } from '../services/intranetService';
import { Employee, Team, SubDepartment } from '../types';
import { Breadcrumbs } from '../components/ui/Breadcrumbs';

export const ContactPage: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [subDepartments, setSubDepartments] = useState<SubDepartment[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const [emps, tms, sds] = await Promise.all([
        intranetService.getEmployees(),
        intranetService.getTeams(),
        intranetService.getSubDepartments(),
      ]);
      setEmployees(emps);
      setTeams(tms);
      setSubDepartments(sds);
    };
    fetchData();
  }, []);

  const leadership = employees.filter(
    (e) =>
      e.role === 'GBS Vice President' ||
      e.role === 'Sub-Department Director' ||
      e.role === 'Team Manager' ||
      e.role === 'Operations Manager'
  );

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <Breadcrumbs items={[{ label: 'GBS Contacts & Directory' }]} />

      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-semibold text-[#8F0B20] uppercase tracking-wider mb-1">
          <PhoneCall className="w-4 h-4 text-[#C8102E]" />
          <span>GBS Department Directory</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#111111] tracking-tight">
          GBS Contacts & On-Call Escalation Directory
        </h1>
        <p className="text-sm text-[#6B6B6B] mt-1">
          Direct lines to GBS leadership, delivery center supervisors, financial close bridges, and team distribution lists.
        </p>
      </div>

      {/* Emergency Outage Callout */}
      <div className="p-5 bg-red-50 border border-red-200 rounded-md">
        <div className="flex items-start gap-3">
          <ShieldAlert className="w-5 h-5 text-[#C8102E] shrink-0 mt-0.5" />
          <div className="text-xs">
            <h3 className="font-bold text-[#8F0B20] text-sm mb-1">
              Critical Service Escalation &amp; Month-End Close Bridge
            </h3>
            <p className="text-[#111111] mb-2 leading-relaxed">
              If critical ERP batch synchronization, robotic automation pipelines, or global customer disbursements are impaired, engage the GBS Duty Incident Commander immediately.
            </p>
            <div className="flex flex-wrap items-center gap-3 font-medium">
              <span className="text-[#111111]">GBS Hotline: <strong className="font-mono text-[#8F0B20]">+1 (800) 555-GBS-HOT</strong></span>
              <span>·</span>
              <span className="text-[#111111]">Teams Channel: <strong className="font-mono">#gbs-operational-bridge</strong></span>
              <span>·</span>
              <span className="text-[#111111]">PagerDuty Escalation: <strong className="font-mono">GBS-Duty-Commander</strong></span>
            </div>
          </div>
        </div>
      </div>

      {/* Team Channels & Distribution Lists */}
      <section className="bg-white border border-[#E3E3E3] rounded-md p-6">
        <h2 className="text-lg font-bold text-[#111111] mb-4">
          GBS Operational Squad Communication Channels
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-[#F6F6F6] text-[#6B6B6B] border-b border-[#E3E3E3]">
              <tr>
                <th className="py-2.5 px-3 font-semibold">Team Name</th>
                <th className="py-2.5 px-3 font-semibold">Sub-Department</th>
                <th className="py-2.5 px-3 font-semibold">Teams Channel</th>
                <th className="py-2.5 px-3 font-semibold">Distribution List</th>
                <th className="py-2.5 px-3 font-semibold">Delivery Hub</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E3E3E3]">
              {teams.map((t) => {
                const sd = subDepartments.find((s) => s.id === t.subDepartmentId);
                return (
                  <tr key={t.id} className="hover:bg-[#F6F6F6]/60">
                    <td className="py-2.5 px-3 font-bold text-[#111111]">{t.name}</td>
                    <td className="py-2.5 px-3 font-semibold text-[#8F0B20]">{sd?.name}</td>
                    <td className="py-2.5 px-3 font-mono text-[#111111]">{t.contactInfo.channel}</td>
                    <td className="py-2.5 px-3">
                      <a href={`mailto:${t.contactInfo.email}`} className="text-[#C8102E] hover:underline font-mono">
                        {t.contactInfo.email}
                      </a>
                    </td>
                    <td className="py-2.5 px-3 text-[#6B6B6B]">{t.contactInfo.officeLocation.split(',')[0]}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* Leadership Directory */}
      <section className="bg-white border border-[#E3E3E3] rounded-md p-6">
        <h2 className="text-lg font-bold text-[#111111] mb-4">
          GBS Executive Leadership &amp; Operational Managers
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {leadership.map((leader) => (
            <div key={leader.id} className="p-4 bg-[#F6F6F6] border border-[#E3E3E3] rounded">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-sm bg-[#111111] text-white flex items-center justify-center text-xs font-bold shrink-0">
                  {leader.initials}
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-bold text-[#111111] truncate">{leader.name}</div>
                  <div className="text-xs text-[#6B6B6B] truncate">{leader.title}</div>
                </div>
              </div>

              <div className="space-y-1 text-xs text-[#6B6B6B] pt-2 border-t border-[#E3E3E3]">
                <div className="truncate">
                  Email: <a href={`mailto:${leader.email}`} className="text-[#C8102E] hover:underline">{leader.email}</a>
                </div>
                {leader.phone && (
                  <div>
                    Phone: <span className="text-[#111111]">{leader.phone}</span>
                  </div>
                )}
                <div>
                  Hub: <span className="text-[#111111]">{leader.location}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
