import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Layers,
  Users,
  ShieldCheck,
  Activity,
  ArrowRight,
  ExternalLink,
  Calendar,
  AlertCircle,
  FileText,
  Search,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { intranetService } from '../services/intranetService';
import {
  Department,
  SubDepartment,
  Team,
  Announcement,
  QuickLink,
  ResourceItem,
  DepartmentEvent,
  Employee,
} from '../types';
import { SubDepartmentCard } from '../components/organization/SubDepartmentCard';
import { AnnouncementCard } from '../components/content/AnnouncementCard';
import { QuickLinkCard } from '../components/content/QuickLinkCard';
import { ResourceCard } from '../components/content/ResourceCard';
import { Modal } from '../components/ui/Modal';
import { Button } from '../components/ui/Button';

export const HomePage: React.FC = () => {
  const { user } = useAuth();
  const [department, setDepartment] = useState<Department | null>(null);
  const [subDepartments, setSubDepartments] = useState<SubDepartment[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [quickLinks, setQuickLinks] = useState<QuickLink[]>([]);
  const [resources, setResources] = useState<ResourceItem[]>([]);
  const [events, setEvents] = useState<DepartmentEvent[]>([]);
  const [activeModalResource, setActiveModalResource] = useState<ResourceItem | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const [dept, sds, tms, emps, anns, qls, res, evts] = await Promise.all([
        intranetService.getDepartment(),
        intranetService.getSubDepartments(),
        intranetService.getTeams(),
        intranetService.getEmployees(),
        intranetService.getAnnouncements(),
        intranetService.getQuickLinks(),
        intranetService.getResources(),
        intranetService.getEvents(),
      ]);
      setDepartment(dept);
      setSubDepartments(sds);
      setTeams(tms);
      setEmployees(emps);
      setAnnouncements(anns);
      setQuickLinks(qls);
      setResources(res);
      setEvents(evts);
    };

    fetchData();
    const unsubscribe = intranetService.subscribe(fetchData);
    return () => unsubscribe();
  }, []);

  const leadership = employees.filter(
    (e) => e.role === 'GBS Vice President' || e.role === 'Sub-Department Director'
  );

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* 1. Welcome Section & Greeting: "This is the GBS intranet" */}
      <section className="bg-white border border-[#E3E3E3] rounded-md p-6 sm:p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-[#8F0B20] uppercase tracking-wider mb-1">
              <span className="w-2 h-2 bg-[#C8102E] rounded-full" />
              <span>Global Business Services (GBS) Department Intranet</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#111111] tracking-tight">
              Good morning, {user.name.split(' ')[0]}. Welcome to the GBS Intranet.
            </h1>
            <p className="text-sm text-[#6B6B6B] mt-1.5 leading-relaxed max-w-2xl">
              This portal is the dedicated internal home for the <span className="font-semibold text-[#111111]">GBS (Global Business Services)</span> department. Explore our organization hierarchy, our two sub-departments (<span className="font-semibold text-[#111111]">GBS-BTS</span> &amp; <span className="font-semibold text-[#111111]">GPS-BO</span>), operational teams, managers, process SOPs, and shared service systems.
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <Link to="/organization">
              <Button variant="primary" size="md">
                <span>GBS Hierarchy Tree</span>
                <ArrowRight className="w-4 h-4 ml-1.5" />
              </Button>
            </Link>
          </div>
        </div>

        {/* 2. Department Snapshot Metrics */}
        <div className="mt-8 pt-6 border-t border-[#E3E3E3] grid grid-cols-2 sm:grid-cols-5 gap-4">
          <div className="border-r border-[#E3E3E3] pr-3 last:border-r-0">
            <div className="text-2xl font-bold font-mono tabular-nums text-[#111111]">
              {subDepartments.length}
            </div>
            <div className="text-xs text-[#6B6B6B] mt-0.5">Sub-Departments (BTS &amp; BO)</div>
          </div>
          <div className="border-r border-[#E3E3E3] pr-3 last:border-r-0">
            <div className="text-2xl font-bold font-mono tabular-nums text-[#111111]">
              {teams.length}
            </div>
            <div className="text-xs text-[#6B6B6B] mt-0.5">GBS Teams</div>
          </div>
          <div className="border-r border-[#E3E3E3] pr-3 last:border-r-0">
            <div className="text-2xl font-bold font-mono tabular-nums text-[#111111]">
              {teams.length}
            </div>
            <div className="text-xs text-[#6B6B6B] mt-0.5">Team Managers</div>
          </div>
          <div className="border-r border-[#E3E3E3] pr-3 last:border-r-0">
            <div className="text-2xl font-bold font-mono tabular-nums text-[#111111]">
              {employees.length}
            </div>
            <div className="text-xs text-[#6B6B6B] mt-0.5">GBS Practitioners</div>
          </div>
          <div className="col-span-2 sm:col-span-1">
            <div className="text-2xl font-bold font-mono tabular-nums text-[#8F0B20]">
              99.8%
            </div>
            <div className="text-xs text-[#6B6B6B] mt-0.5">SLA Target Met</div>
          </div>
        </div>
      </section>

      {/* 3. Department Navigation: Prominently expose GBS-BTS and GPS-BO */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold text-[#111111]">GBS Core Structure</h2>
            <p className="text-xs text-[#6B6B6B]">
              Navigate into our two specialized sub-departments: GBS-BTS and GPS-BO
            </p>
          </div>
          <Link
            to="/organization"
            className="text-xs font-semibold text-[#C8102E] hover:underline inline-flex items-center gap-1"
          >
            <span>Full GBS Org Tree</span>
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

      {/* 4. Latest Announcements & Department Priority Alerts */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold text-[#111111]">GBS Announcements & Bulletins</h2>
            <p className="text-xs text-[#6B6B6B]">
              Global town halls, automation releases, and operational SOP recertification notices
            </p>
          </div>
          <Link
            to="/announcements"
            className="text-xs font-semibold text-[#C8102E] hover:underline inline-flex items-center gap-1"
          >
            <span>All GBS Bulletins</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {announcements.slice(0, 4).map((ann, idx) => (
            <AnnouncementCard
              key={ann.id}
              announcement={ann}
              featured={idx === 0}
            />
          ))}
        </div>
      </section>

      {/* 5. Quick Links Grid */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold text-[#111111]">GBS Core Systems & Quick Links</h2>
            <p className="text-xs text-[#6B6B6B]">
              Direct access to ServiceNow, SAP S/4HANA, Coupa, Celonis, and PowerBI dashboards
            </p>
          </div>
          <Link
            to="/quick-links"
            className="text-xs font-semibold text-[#C8102E] hover:underline inline-flex items-center gap-1"
          >
            <span>All Quick Links ({quickLinks.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {quickLinks.slice(0, 6).map((ql) => (
            <QuickLinkCard key={ql.id} quickLink={ql} />
          ))}
        </div>
      </section>

      {/* 6. Employee Resources & Upcoming Events (Two-Column Layout) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Popular Employee Resources */}
        <section className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-bold text-[#111111]">GBS Employee Resources & SOPs</h2>
              <p className="text-xs text-[#6B6B6B]">
                Operating models, service level agreements, intake forms, and quality toolkits
              </p>
            </div>
            <Link
              to="/resources"
              className="text-xs font-semibold text-[#C8102E] hover:underline inline-flex items-center gap-1"
            >
              <span>All Resources</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {resources.slice(0, 4).map((res) => (
              <ResourceCard
                key={res.id}
                resource={res}
                onOpen={(r) => setActiveModalResource(r)}
              />
            ))}
          </div>
        </section>

        {/* Right 1 Col: Upcoming Events */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-[#111111]">Upcoming Events</h2>
            <Link to="/events" className="text-xs text-[#C8102E] hover:underline font-semibold">
              Calendar
            </Link>
          </div>

          <div className="bg-white border border-[#E3E3E3] rounded-md divide-y divide-[#E3E3E3]">
            {events.slice(0, 3).map((evt) => (
              <div key={evt.id} className="p-4 space-y-1">
                <div className="flex items-center justify-between text-xs text-[#6B6B6B]">
                  <span className="font-semibold text-[#111111]">{evt.type}</span>
                  <span className="font-mono text-[11px]">{evt.date.split(',')[1] || evt.date}</span>
                </div>
                <h4 className="text-xs font-bold text-[#111111]">{evt.title}</h4>
                <p className="text-xs text-[#6B6B6B] line-clamp-1">{evt.description}</p>
                <div className="text-[11px] text-[#6B6B6B] pt-1">
                  Time: {evt.time}
                </div>
              </div>
            ))}
          </div>

          {/* Quick Contact Card */}
          <div className="bg-white border border-[#E3E3E3] rounded-md p-4">
            <h3 className="text-xs font-bold text-[#111111] mb-2 uppercase tracking-wider text-[#6B6B6B]">
              Need Operational Assistance?
            </h3>
            <p className="text-xs text-[#6B6B6B] mb-3">
              Consult the GBS on-call escalation matrix for financial closing bridges and partner dispute triaging.
            </p>
            <Link to="/contact">
              <Button variant="outline" size="sm" fullWidth>
                <span>View GBS Contacts</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Button>
            </Link>
          </div>
        </section>
      </div>

      {/* 7. Key Department Leadership */}
      <section className="bg-white border border-[#E3E3E3] rounded-md p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold text-[#111111]">GBS Department Leadership</h2>
            <p className="text-xs text-[#6B6B6B]">
              Executive leadership team for Global Business Services, GBS-BTS, and GPS-BO
            </p>
          </div>
          <Link
            to="/overview"
            className="text-xs font-semibold text-[#C8102E] hover:underline inline-flex items-center gap-1"
          >
            <span>GBS Charter</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {leadership.map((leader) => (
            <div key={leader.id} className="p-4 bg-[#F6F6F6] border border-[#E3E3E3] rounded">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-sm bg-[#111111] text-white flex items-center justify-center text-xs font-bold shrink-0">
                  {leader.initials}
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-bold text-[#111111] truncate">{leader.name}</div>
                  <div className="text-xs text-[#6B6B6B] truncate">{leader.title}</div>
                </div>
              </div>
              <div className="mt-3 pt-2 border-t border-[#E3E3E3] flex items-center justify-between text-xs">
                <span className="text-[#6B6B6B]">{leader.location}</span>
                <a
                  href={`mailto:${leader.email}`}
                  className="font-semibold text-[#C8102E] hover:underline"
                >
                  Contact
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Resource Modal Preview */}
      <Modal
        isOpen={!!activeModalResource}
        onClose={() => setActiveModalResource(null)}
        title={activeModalResource?.title || 'Resource'}
        subtitle={`Category: ${activeModalResource?.category} · Applicable: ${activeModalResource?.applicableTo}`}
      >
        <div className="space-y-4 text-xs">
          <p className="text-sm text-[#111111] leading-relaxed">
            {activeModalResource?.description}
          </p>
          <div className="p-3 bg-[#F6F6F6] border border-[#E3E3E3] rounded space-y-1">
            <div className="text-[#6B6B6B]">Format: <span className="font-semibold text-[#111111]">{activeModalResource?.format}</span></div>
            <div className="text-[#6B6B6B]">Last Certified: <span className="text-[#111111]">{activeModalResource?.lastUpdated}</span></div>
            <div className="text-[#6B6B6B]">Audience Scope: <span className="text-[#111111]">{activeModalResource?.applicableTo}</span></div>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" size="sm" onClick={() => setActiveModalResource(null)}>
              Close
            </Button>
            <Button variant="primary" size="sm" onClick={() => setActiveModalResource(null)}>
              <span>Access In GBS Hub</span>
              <ExternalLink className="w-3.5 h-3.5 ml-1" />
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
