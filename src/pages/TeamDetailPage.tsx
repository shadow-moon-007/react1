import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import {
  Users,
  ShieldCheck,
  CheckCircle2,
  Mail,
  MessageSquare,
  MapPin,
  ExternalLink,
  Search,
  FolderOpen,
  PhoneCall,
  Clock,
  Layers,
  ArrowRight,
} from 'lucide-react';
import { intranetService } from '../services/intranetService';
import {
  Team,
  SubDepartment,
  Employee,
  ResourceItem,
  DocumentItem,
  QuickLink,
} from '../types';
import { Breadcrumbs } from '../components/ui/Breadcrumbs';
import { ManagerCard } from '../components/organization/ManagerCard';
import { TeamMemberCard } from '../components/organization/TeamMemberCard';
import { ResourceCard } from '../components/content/ResourceCard';
import { Modal } from '../components/ui/Modal';
import { Button } from '../components/ui/Button';

export const TeamDetailPage: React.FC = () => {
  const { subDepartmentId, teamId } = useParams<{
    subDepartmentId: string;
    teamId: string;
  }>();
  const [searchParams] = useSearchParams();
  const [team, setTeam] = useState<Team | null>(null);
  const [subDepartment, setSubDepartment] = useState<SubDepartment | null>(null);
  const [manager, setManager] = useState<Employee | null>(null);
  const [members, setMembers] = useState<Employee[]>([]);
  const [teamResources, setTeamResources] = useState<ResourceItem[]>([]);
  const [teamDocs, setTeamDocs] = useState<DocumentItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  const [selectedProfile, setSelectedProfile] = useState<Employee | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!teamId) return;
      const t = await intranetService.getTeam(teamId);
      if (t) {
        setTeam(t);
        const [sd, emps, allRes, allDocs] = await Promise.all([
          intranetService.getSubDepartment(t.subDepartmentId),
          intranetService.getEmployees({ teamId: t.id }),
          intranetService.getResources(),
          intranetService.getDocuments(),
        ]);
        setSubDepartment(sd || null);
        setMembers(emps);
        const mgr = emps.find((e) => e.id === t.managerId);
        setManager(mgr || null);

        // Filter resources applicable to this team or its subdepartment
        const res = allRes.filter(
          (r) =>
            r.teamId === t.id ||
            r.applicableTo === t.id ||
            r.subDepartmentId === t.subDepartmentId ||
            r.applicableTo === 'All Teams'
        );
        setTeamResources(res);

        const docs = allDocs.filter(
          (d) => d.teamId === t.id || d.subDepartmentId === t.subDepartmentId
        );
        setTeamDocs(docs);

        // If URL has ?emp=id, auto-select profile
        const empId = searchParams.get('emp');
        if (empId) {
          const emp = emps.find((e) => e.id === empId);
          if (emp) setSelectedProfile(emp);
        }
      }
    };
    fetchData();
    const unsubscribe = intranetService.subscribe(fetchData);
    return () => unsubscribe();
  }, [teamId, searchParams]);

  if (!team || !subDepartment) {
    return (
      <div className="py-12 text-center text-sm text-[#6B6B6B]">
        Team not found.{' '}
        <Link to="/organization" className="text-[#C8102E] underline">
          Return to Organization Explorer
        </Link>
      </div>
    );
  }

  // Filter members by search & role
  const filteredMembers = members.filter((m) => {
    const matchesQuery =
      !searchQuery ||
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.skills.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesRole =
      roleFilter === 'All' ||
      (roleFilter === 'Manager' && m.id === team.managerId) ||
      (roleFilter === 'Lead' && (m.role === 'Solutions Architect' || m.role === 'Lead Specialist' || m.title.toLowerCase().includes('lead') || m.title.toLowerCase().includes('architect') || m.title.toLowerCase().includes('senior'))) ||
      (roleFilter === 'Members' && m.role === 'Team Member');

    return matchesQuery && matchesRole;
  });

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <Breadcrumbs
        items={[
          { label: 'Organization', to: '/organization' },
          { label: subDepartment.name, to: `/organization/${subDepartment.id}` },
          { label: team.name },
        ]}
      />

      {/* 1. Team Header */}
      <section className="bg-white border border-[#E3E3E3] rounded-md p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-[#6B6B6B] mb-2">
          <div className="flex items-center gap-2">
            <span className="font-mono text-[#8F0B20] font-bold">{team.code}</span>
            <span aria-hidden="true">·</span>
            <Link
              to={`/organization/${subDepartment.id}`}
              className="text-[#111111] hover:text-[#C8102E] font-medium"
            >
              {subDepartment.name}
            </Link>
          </div>
          <span className="font-mono tabular-nums text-[#111111] font-semibold flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5 text-[#6B6B6B]" />
            {team.memberIds.length} Team Members
          </span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#111111] tracking-tight mb-3">
          {team.name}
        </h1>

        <p className="text-base text-[#6B6B6B] leading-relaxed max-w-3xl mb-6">
          {team.description}
        </p>

        {/* Manager Card Section */}
        {manager && (
          <div className="mb-6">
            <div className="text-xs font-bold text-[#111111] uppercase tracking-wider mb-2">
              Team Manager
            </div>
            <ManagerCard
              manager={manager}
              teamName={team.name}
              onSelect={() => setSelectedProfile(manager)}
            />
          </div>
        )}

        {/* Tech Stack / Key Areas Kicker */}
        {team.techStack && (
          <div className="pt-4 border-t border-[#E3E3E3] flex flex-wrap items-center gap-2 text-xs">
            <span className="font-semibold text-[#111111]">Primary Technologies:</span>
            {team.techStack.map((tech, i) => (
              <span
                key={i}
                className="px-2 py-0.5 bg-[#F6F6F6] border border-[#E3E3E3] rounded text-[11px] font-mono text-[#111111]"
              >
                {tech}
              </span>
            ))}
          </div>
        )}
      </section>

      {/* 2. Responsibilities & Key Focus Areas */}
      <section className="bg-white border border-[#E3E3E3] rounded-md p-6 sm:p-8">
        <h2 className="text-lg font-bold text-[#111111] mb-3">
          Responsibilities & Operational Scope
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-[#6B6B6B]">
          {team.responsibilities.map((resp, i) => (
            <div key={i} className="flex items-start gap-2.5 p-3 bg-[#F6F6F6] rounded border border-[#E3E3E3]">
              <CheckCircle2 className="w-4 h-4 text-[#C8102E] shrink-0 mt-0.5" />
              <span className="text-[#111111] leading-relaxed">{resp}</span>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Team Members (Searchable / Filterable Directory) */}
      <section className="bg-white border border-[#E3E3E3] rounded-md p-6 sm:p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-xl font-bold text-[#111111]">
              Team Members ({filteredMembers.length})
            </h2>
            <p className="text-xs text-[#6B6B6B]">
              Engineers, architects, and managers assigned to {team.name}
            </p>
          </div>

          {/* Controls: Search and Role Filter Tabs */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-[#6B6B6B]" />
              <input
                type="text"
                placeholder="Search by name, skill, title..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 pr-3 py-1.5 text-xs text-[#111111] bg-[#F6F6F6] border border-[#E3E3E3] rounded focus-visible:outline-none focus-visible:border-[#C8102E] w-48 sm:w-60"
              />
            </div>

            <div className="flex items-center gap-1 p-0.5 bg-[#F6F6F6] border border-[#E3E3E3] rounded text-xs">
              {['All', 'Manager', 'Lead', 'Members'].map((r) => (
                <button
                  key={r}
                  onClick={() => setRoleFilter(r)}
                  className={`px-2.5 py-1 rounded transition-colors ${
                    roleFilter === r
                      ? 'bg-white text-[#111111] font-semibold shadow-xs'
                      : 'text-[#6B6B6B] hover:text-[#111111]'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>
        </div>

        {filteredMembers.length === 0 ? (
          <div className="py-8 text-center text-xs text-[#6B6B6B]">
            No team members matched your criteria.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredMembers.map((member) => (
              <TeamMemberCard
                key={member.id}
                employee={member}
                teamName={team.name}
                onViewProfile={(m) => setSelectedProfile(m)}
              />
            ))}
          </div>
        )}
      </section>

      {/* 4. Team Resources & Runbooks */}
      <section className="bg-white border border-[#E3E3E3] rounded-md p-6 sm:p-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold text-[#111111]">Relevant Resources & Tools</h2>
            <p className="text-xs text-[#6B6B6B]">
              Standard operating procedures, internal portals, and architecture guidelines
            </p>
          </div>
          <Link
            to="/resources"
            className="text-xs font-semibold text-[#C8102E] hover:underline"
          >
            All Resources
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {teamResources.slice(0, 4).map((res) => (
            <ResourceCard key={res.id} resource={res} />
          ))}
        </div>
      </section>

      {/* 5. Team Contact & Escalation Information */}
      <section className="bg-white border border-[#E3E3E3] rounded-md p-6">
        <h3 className="text-base font-bold text-[#111111] mb-2">
          Contact & Triage Protocols
        </h3>
        <p className="text-xs text-[#6B6B6B] mb-4">
          How to engage {team.name} for questions, pull request reviews, and urgent escalation.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          <div className="p-3 bg-[#F6F6F6] border border-[#E3E3E3] rounded">
            <div className="font-semibold text-[#111111] mb-1">Slack / Teams Channel</div>
            <div className="font-mono text-[#8F0B20] font-bold">{team.contactInfo.channel}</div>
            <div className="text-[#6B6B6B] mt-1 text-[11px]">Primary team chat bridge</div>
          </div>

          <div className="p-3 bg-[#F6F6F6] border border-[#E3E3E3] rounded">
            <div className="font-semibold text-[#111111] mb-1">Distribution List</div>
            <a
              href={`mailto:${team.contactInfo.email}`}
              className="text-[#C8102E] hover:underline block truncate font-mono text-[11px]"
            >
              {team.contactInfo.email}
            </a>
            <div className="text-[#6B6B6B] mt-1 text-[11px]">All team members DL</div>
          </div>

          <div className="p-3 bg-[#F6F6F6] border border-[#E3E3E3] rounded">
            <div className="font-semibold text-[#111111] mb-1">Office Location</div>
            <div className="text-[#111111] font-medium">{team.contactInfo.officeLocation}</div>
            <div className="text-[#6B6B6B] mt-1 text-[11px]">In-person pod seating</div>
          </div>

          <div className="p-3 bg-[#F6F6F6] border border-[#E3E3E3] rounded">
            <div className="font-semibold text-[#111111] mb-1">On-Call Coverage</div>
            <div className="text-[#111111] font-medium">{team.contactInfo.onCallRotation}</div>
            <div className="text-[#6B6B6B] mt-1 text-[11px]">24/7 PagerDuty integration</div>
          </div>
        </div>
      </section>

      {/* Selected Employee Profile Modal */}
      {selectedProfile && (
        <Modal
          isOpen={!!selectedProfile}
          onClose={() => setSelectedProfile(null)}
          title={selectedProfile.name}
          subtitle={`${selectedProfile.title} · ${team.name}`}
          maxWidth="md"
        >
          <div className="space-y-4 text-xs">
            <div className="flex items-center gap-3.5 p-3.5 bg-[#F6F6F6] rounded border border-[#E3E3E3]">
              <div className="w-12 h-12 rounded-sm bg-[#111111] text-white flex items-center justify-center font-bold text-sm">
                {selectedProfile.initials}
              </div>
              <div className="min-w-0">
                <div className="text-base font-bold text-[#111111]">{selectedProfile.name}</div>
                <div className="text-xs text-[#6B6B6B]">{selectedProfile.title}</div>
                <div className="text-xs text-[#111111] mt-0.5">{selectedProfile.location}</div>
              </div>
            </div>

            <div className="space-y-2">
              <div>
                <span className="text-[#6B6B6B]">Email: </span>
                <a
                  href={`mailto:${selectedProfile.email}`}
                  className="font-mono text-[#C8102E] hover:underline"
                >
                  {selectedProfile.email}
                </a>
              </div>
              <div>
                <span className="text-[#6B6B6B]">Manager: </span>
                <span className="font-semibold text-[#111111]">{manager?.name || 'N/A'}</span>
              </div>
              {selectedProfile.bio && (
                <div className="pt-2 border-t border-[#E3E3E3]">
                  <div className="font-semibold text-[#111111] mb-1">Profile & Focus:</div>
                  <p className="text-[#6B6B6B] leading-relaxed">{selectedProfile.bio}</p>
                </div>
              )}
              {selectedProfile.skills && (
                <div className="pt-2 border-t border-[#E3E3E3]">
                  <div className="font-semibold text-[#111111] mb-1">Key Technical Skills:</div>
                  <div className="flex flex-wrap gap-1">
                    {selectedProfile.skills.map((s, i) => (
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

            <div className="pt-4 border-t border-[#E3E3E3] flex justify-between items-center">
              <a
                href={`https://teams.microsoft.com/l/chat/0/0?users=${encodeURIComponent(selectedProfile.email)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-[#111111] rounded hover:bg-neutral-800"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Chat via Teams</span>
              </a>
              <button
                onClick={() => setSelectedProfile(null)}
                className="px-3 py-1.5 text-xs font-medium text-[#111111] bg-[#F6F6F6] border border-[#E3E3E3] rounded hover:bg-neutral-200"
              >
                Close
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
