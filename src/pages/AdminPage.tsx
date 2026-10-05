import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Settings,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  Users,
  Layers,
  Bell,
  Link2,
  FileText,
  Shield,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { intranetService } from '../services/intranetService';
import {
  Team,
  SubDepartment,
  Employee,
  Announcement,
  ResourceItem,
  QuickLink,
  DocumentItem,
} from '../types';
import { useAuth } from '../context/AuthContext';
import { Breadcrumbs } from '../components/ui/Breadcrumbs';
import { Modal } from '../components/ui/Modal';
import { Button } from '../components/ui/Button';

export const AdminPage: React.FC = () => {
  const { user, activeRole } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const getTabFromPath = () => {
    if (location.pathname.includes('/admin/organization')) return 'organization';
    if (location.pathname.includes('/admin/content')) return 'content';
    return 'dashboard';
  };

  const [activeTab, setActiveTab] = useState<'dashboard' | 'organization' | 'content'>(getTabFromPath);
  const [contentSubTab, setContentSubTab] = useState<'announcements' | 'resources' | 'quickLinks' | 'documents'>('announcements');

  useEffect(() => {
    setActiveTab(getTabFromPath());
  }, [location.pathname]);

  const handleTabChange = (tab: 'dashboard' | 'organization' | 'content') => {
    setActiveTab(tab);
    if (tab === 'dashboard') navigate('/admin');
    else if (tab === 'organization') navigate('/admin/organization');
    else if (tab === 'content') navigate('/admin/content');
  };

  const [teams, setTeams] = useState<Team[]>([]);
  const [subDepartments, setSubDepartments] = useState<SubDepartment[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [resources, setResources] = useState<ResourceItem[]>([]);
  const [quickLinks, setQuickLinks] = useState<QuickLink[]>([]);
  const [documents, setDocuments] = useState<DocumentItem[]>([]);

  // Action status message
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  // Modals for CRUD operations
  const [isAddTeamModalOpen, setIsAddTeamModalOpen] = useState(false);
  const [isEditTeamModalOpen, setIsEditTeamModalOpen] = useState(false);
  const [teamToEdit, setTeamToEdit] = useState<Team | null>(null);

  const [isCreateAnnouncementModalOpen, setIsCreateAnnouncementModalOpen] = useState(false);
  const [isAddQuickLinkModalOpen, setIsAddQuickLinkModalOpen] = useState(false);
  const [isAddResourceModalOpen, setIsAddResourceModalOpen] = useState(false);

  // Form states
  const [newTeam, setNewTeam] = useState({
    name: '',
    code: '',
    subDepartmentId: 'gbs-bts',
    managerId: 'emp-004',
    description: '',
    responsibilities: '',
    keyAreas: '',
    channel: '#gbs-new-team',
    email: 'new-team@gbs.enterprise.corp',
    officeLocation: 'Tampa Delivery Center, Bldg 3',
  });

  const [newAnnouncement, setNewAnnouncement] = useState({
    title: '',
    summary: '',
    content: '',
    category: 'Strategic' as Announcement['category'],
    audience: 'Entire GBS' as Announcement['audience'],
    priority: 'Normal' as Announcement['priority'],
    readTime: '3 min read',
  });

  const [newQuickLink, setNewQuickLink] = useState({
    title: '',
    description: '',
    category: 'Business Operations' as QuickLink['category'],
    url: 'https://gbs.portal.enterprise.corp',
    scope: 'Entire GBS' as QuickLink['scope'],
    iconName: 'Layers',
  });

  const [newResource, setNewResource] = useState({
    title: '',
    description: '',
    category: 'IT' as ResourceItem['category'],
    applicableTo: 'All Teams',
    url: '#/documents/new-resource',
    lastUpdated: 'October 2026',
    format: 'Guide' as ResourceItem['format'],
  });

  const refreshData = async () => {
    const [tms, sds, emps, anns, res, qls, docs] = await Promise.all([
      intranetService.getTeams(),
      intranetService.getSubDepartments(),
      intranetService.getEmployees(),
      intranetService.getAnnouncements(),
      intranetService.getResources(),
      intranetService.getQuickLinks(),
      intranetService.getDocuments(),
    ]);
    setTeams(tms);
    setSubDepartments(sds);
    setEmployees(emps);
    setAnnouncements(anns);
    setResources(res);
    setQuickLinks(qls);
    setDocuments(docs);
  };

  useEffect(() => {
    refreshData();
    const unsubscribe = intranetService.subscribe(refreshData);
    return () => unsubscribe();
  }, []);

  const showStatus = (msg: string) => {
    setStatusMessage(msg);
    setTimeout(() => setStatusMessage(null), 4000);
  };

  // Handlers
  const handleCreateTeam = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTeam.name) return;

    await intranetService.addTeam({
      name: newTeam.name,
      code: newTeam.code || newTeam.name.slice(0, 3).toUpperCase(),
      subDepartmentId: newTeam.subDepartmentId,
      managerId: newTeam.managerId,
      description: newTeam.description,
      responsibilities: newTeam.responsibilities
        ? newTeam.responsibilities.split('\n').filter(Boolean)
        : ['Continuous improvement and technical delivery'],
      keyAreas: newTeam.keyAreas
        ? newTeam.keyAreas.split(',').map((s) => s.trim())
        : ['Engineering', 'Architecture'],
      memberIds: [newTeam.managerId],
      contactInfo: {
        channel: newTeam.channel,
        email: newTeam.email,
        officeLocation: newTeam.officeLocation,
        onCallRotation: 'PagerDuty Assigned',
      },
    });

    setIsAddTeamModalOpen(false);
    setNewTeam({
      name: '',
      code: '',
      subDepartmentId: 'sub-platform',
      managerId: 'emp-004',
      description: '',
      responsibilities: '',
      keyAreas: '',
      channel: '#new-team-channel',
      email: 'new-team@enterprise.corp',
      officeLocation: 'Seattle Tech Hub, Floor 4',
    });
    showStatus(`Team "${newTeam.name}" was successfully added to the intranet hierarchy!`);
  };

  const handleUpdateTeam = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!teamToEdit) return;

    await intranetService.updateTeam(teamToEdit.id, {
      name: teamToEdit.name,
      description: teamToEdit.description,
      managerId: teamToEdit.managerId,
      subDepartmentId: teamToEdit.subDepartmentId,
    });

    setIsEditTeamModalOpen(false);
    showStatus(`Team "${teamToEdit.name}" was updated.`);
  };

  const handleCreateAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAnnouncement.title) return;

    await intranetService.createAnnouncement({
      title: newAnnouncement.title,
      summary: newAnnouncement.summary,
      content: newAnnouncement.content,
      author: {
        name: user.name,
        title: user.title,
        avatarInitials: user.initials,
      },
      publishedDate: new Date().toISOString().split('T')[0],
      category: newAnnouncement.category,
      audience: newAnnouncement.audience,
      status: 'Published',
      priority: newAnnouncement.priority,
      readTime: newAnnouncement.readTime,
    });

    setIsCreateAnnouncementModalOpen(false);
    setNewAnnouncement({
      title: '',
      summary: '',
      content: '',
      category: 'Strategic',
      audience: 'Entire GBS',
      priority: 'Normal',
      readTime: '3 min read',
    });
    showStatus(`Announcement "${newAnnouncement.title}" has been published across the intranet!`);
  };

  const handleAddQuickLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuickLink.title) return;

    await intranetService.addQuickLink({
      ...newQuickLink,
      isExternal: true,
    });

    setIsAddQuickLinkModalOpen(false);
    showStatus(`Quick link "${newQuickLink.title}" was added.`);
  };

  const handleAddResource = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newResource.title) return;

    await intranetService.addResource(newResource);
    setIsAddResourceModalOpen(false);
    showStatus(`Resource "${newResource.title}" was added.`);
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <Breadcrumbs items={[{ label: 'Administration & CMS' }]} />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#8F0B20] uppercase tracking-wider mb-1">
            <LayoutDashboard className="w-4 h-4 text-[#C8102E]" />
            <span>Future CMS Administration POC</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#111111] tracking-tight">
            Intranet Content & Organization Management
          </h1>
          <p className="text-sm text-[#6B6B6B] mt-1">
            Visual prototype of the departmental CMS. Edit teams, reassign managers, publish targeted announcements, and curate resources.
          </p>
        </div>

        {/* Persona Pill */}
        <div className="p-2.5 bg-white border border-[#E3E3E3] rounded flex items-center gap-3">
          <div className="w-8 h-8 rounded-sm bg-[#111111] text-white flex items-center justify-center font-bold text-xs shrink-0">
            {user.initials}
          </div>
          <div className="text-xs">
            <div className="font-bold text-[#111111]">{user.name}</div>
            <div className="text-[#8F0B20] font-semibold">{activeRole}</div>
          </div>
        </div>
      </div>

      {/* Status Banner */}
      {statusMessage && (
        <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs rounded-md flex items-center justify-between animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="font-semibold">{statusMessage}</span>
          </div>
          <span className="text-[11px] text-emerald-700">Immediate in-memory update</span>
        </div>
      )}

      {/* Main Admin Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-[#E3E3E3] text-sm">
        <button
          onClick={() => handleTabChange('dashboard')}
          className={`py-2.5 px-4 font-semibold border-b-2 transition-colors ${
            activeTab === 'dashboard'
              ? 'border-[#C8102E] text-[#111111]'
              : 'border-transparent text-[#6B6B6B] hover:text-[#111111]'
          }`}
        >
          Dashboard Overview
        </button>
        <button
          onClick={() => handleTabChange('organization')}
          className={`py-2.5 px-4 font-semibold border-b-2 transition-colors ${
            activeTab === 'organization'
              ? 'border-[#C8102E] text-[#111111]'
              : 'border-transparent text-[#6B6B6B] hover:text-[#111111]'
          }`}
        >
          Organization & Teams ({teams.length})
        </button>
        <button
          onClick={() => handleTabChange('content')}
          className={`py-2.5 px-4 font-semibold border-b-2 transition-colors ${
            activeTab === 'content'
              ? 'border-[#C8102E] text-[#111111]'
              : 'border-transparent text-[#6B6B6B] hover:text-[#111111]'
          }`}
        >
          Content & Resources
        </button>
      </div>

      {/* TAB 1: DASHBOARD */}
      {activeTab === 'dashboard' && (
        <div className="space-y-6">
          {/* Quick Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-white border border-[#E3E3E3] rounded-md p-4">
              <div className="text-xs text-[#6B6B6B] mb-1">Total Teams</div>
              <div className="text-2xl font-bold font-mono text-[#111111]">{teams.length}</div>
              <div className="text-[11px] text-[#8F0B20] mt-1">2 Sub-Departments (BTS &amp; BO)</div>
            </div>
            <div className="bg-white border border-[#E3E3E3] rounded-md p-4">
              <div className="text-xs text-[#6B6B6B] mb-1">Active Staff</div>
              <div className="text-2xl font-bold font-mono text-[#111111]">{employees.length}</div>
              <div className="text-[11px] text-[#6B6B6B] mt-1">GBS directory synced</div>
            </div>
            <div className="bg-white border border-[#E3E3E3] rounded-md p-4">
              <div className="text-xs text-[#6B6B6B] mb-1">Published Bulletins</div>
              <div className="text-2xl font-bold font-mono text-[#111111]">{announcements.length}</div>
              <div className="text-[11px] text-emerald-700 mt-1">100% broadcast SLA</div>
            </div>
            <div className="bg-white border border-[#E3E3E3] rounded-md p-4">
              <div className="text-xs text-[#6B6B6B] mb-1">Cataloged Resources</div>
              <div className="text-2xl font-bold font-mono text-[#111111]">{resources.length + quickLinks.length}</div>
              <div className="text-[11px] text-[#6B6B6B] mt-1">SOPs & Quick Links</div>
            </div>
          </div>

          {/* Quick CMS Action Buttons */}
          <div className="bg-white border border-[#E3E3E3] rounded-md p-6">
            <h3 className="text-base font-bold text-[#111111] mb-2">Fast Actions</h3>
            <p className="text-xs text-[#6B6B6B] mb-4">
              Test creating and modifying items to see them immediately reflected across the intranet portal.
            </p>

            <div className="flex flex-wrap items-center gap-3">
              <Button size="sm" onClick={() => setIsAddTeamModalOpen(true)}>
                <Plus className="w-3.5 h-3.5 mr-1" />
                <span>Add GBS Team</span>
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setIsCreateAnnouncementModalOpen(true)}
              >
                <Plus className="w-3.5 h-3.5 mr-1" />
                <span>Publish Announcement</span>
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setIsAddQuickLinkModalOpen(true)}
              >
                <Plus className="w-3.5 h-3.5 mr-1" />
                <span>Add Quick Link</span>
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setIsAddResourceModalOpen(true)}
              >
                <Plus className="w-3.5 h-3.5 mr-1" />
                <span>Add Resource / SOP</span>
              </Button>
            </div>
          </div>

          {/* Architecture Roadmap for Leadership */}
          <div className="bg-white border border-[#E3E3E3] rounded-md p-6">
            <div className="flex items-center gap-2 text-xs font-semibold text-[#8F0B20] uppercase tracking-wider mb-2">
              <Sparkles className="w-4 h-4 text-[#C8102E]" />
              <span>CMS Architecture Roadmap</span>
            </div>
            <h3 className="text-base font-bold text-[#111111] mb-2">
              How the Production CMS & API Layer Connects
            </h3>
            <p className="text-xs text-[#6B6B6B] leading-relaxed mb-4 max-w-3xl">
              This POC demonstrates the user journey and navigation contracts. In the production phase, the service layer (<code className="bg-[#F6F6F6] px-1 py-0.5 rounded border border-[#E3E3E3]">src/services/intranetService.ts</code>) connects directly to the enterprise backend service (e.g., GraphQL or REST microservice) backed by Microsoft Entra ID role-based access control (RBAC).
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
              <div className="p-3 bg-[#F6F6F6] border border-[#E3E3E3] rounded">
                <div className="font-semibold text-[#111111] mb-1">1. Frontend Service Layer</div>
                <div className="text-[#6B6B6B]">React 19 hooks and service client consume typed contracts. Complete today.</div>
              </div>
              <div className="p-3 bg-[#F6F6F6] border border-[#E3E3E3] rounded">
                <div className="font-semibold text-[#111111] mb-1">2. Identity & RBAC</div>
                <div className="text-[#6B6B6B]">Microsoft Entra ID token claims dictate CMS editor roles. Mapped in AuthContext.</div>
              </div>
              <div className="p-3 bg-[#F6F6F6] border border-[#E3E3E3] rounded">
                <div className="font-semibold text-[#111111] mb-1">3. Future Backend API</div>
                <div className="text-[#6B6B6B]">PostgreSQL or headless CMS endpoint feeds the identical JSON contracts.</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: ORGANIZATION MANAGEMENT */}
      {activeTab === 'organization' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-[#111111]">
                GBS Teams & Reporting Lines
              </h3>
              <p className="text-xs text-[#6B6B6B]">
                Manage teams, assign team managers, and maintain sub-department linkages.
              </p>
            </div>
            <Button size="sm" onClick={() => setIsAddTeamModalOpen(true)}>
              <Plus className="w-3.5 h-3.5 mr-1" />
              <span>Add New Team</span>
            </Button>
          </div>

          <div className="bg-white border border-[#E3E3E3] rounded-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-[#F6F6F6] text-[#6B6B6B] border-b border-[#E3E3E3]">
                  <tr>
                    <th className="py-3 px-4 font-semibold">Team Code</th>
                    <th className="py-3 px-4 font-semibold">Team Name</th>
                    <th className="py-3 px-4 font-semibold">Sub-Department</th>
                    <th className="py-3 px-4 font-semibold">Manager</th>
                    <th className="py-3 px-4 font-semibold">Members</th>
                    <th className="py-3 px-4 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E3E3E3]">
                  {teams.map((team) => {
                    const sd = subDepartments.find((s) => s.id === team.subDepartmentId);
                    const mgr = employees.find((e) => e.id === team.managerId);

                    return (
                      <tr key={team.id} className="hover:bg-[#F6F6F6]/60">
                        <td className="py-3 px-4 font-mono font-bold text-[#8F0B20]">
                          {team.code}
                        </td>
                        <td className="py-3 px-4 font-bold text-[#111111]">
                          <a
                            href={`/organization/${team.subDepartmentId}/teams/${team.id}`}
                            className="hover:text-[#C8102E] hover:underline"
                          >
                            {team.name}
                          </a>
                        </td>
                        <td className="py-3 px-4 text-[#6B6B6B]">{sd?.name}</td>
                        <td className="py-3 px-4 font-medium text-[#111111]">
                          {mgr ? mgr.name : 'Unassigned'}
                        </td>
                        <td className="py-3 px-4 font-mono">{team.memberIds.length} members</td>
                        <td className="py-3 px-4 text-right">
                          <button
                            onClick={() => {
                              setTeamToEdit(team);
                              setIsEditTeamModalOpen(true);
                            }}
                            className="inline-flex items-center gap-1 text-xs font-semibold text-[#C8102E] hover:text-[#8F0B20] mr-2"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                            <span>Edit</span>
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: CONTENT MANAGEMENT */}
      {activeTab === 'content' && (
        <div className="space-y-6">
          {/* Sub-tab pills */}
          <div className="flex items-center gap-1 p-1 bg-white border border-[#E3E3E3] rounded w-fit">
            <button
              onClick={() => setContentSubTab('announcements')}
              className={`px-3 py-1.5 text-xs font-medium rounded transition-colors ${
                contentSubTab === 'announcements'
                  ? 'bg-[#111111] text-white'
                  : 'text-[#6B6B6B] hover:text-[#111111]'
              }`}
            >
              Announcements ({announcements.length})
            </button>
            <button
              onClick={() => setContentSubTab('resources')}
              className={`px-3 py-1.5 text-xs font-medium rounded transition-colors ${
                contentSubTab === 'resources'
                  ? 'bg-[#111111] text-white'
                  : 'text-[#6B6B6B] hover:text-[#111111]'
              }`}
            >
              Resources ({resources.length})
            </button>
            <button
              onClick={() => setContentSubTab('quickLinks')}
              className={`px-3 py-1.5 text-xs font-medium rounded transition-colors ${
                contentSubTab === 'quickLinks'
                  ? 'bg-[#111111] text-white'
                  : 'text-[#6B6B6B] hover:text-[#111111]'
              }`}
            >
              Quick Links ({quickLinks.length})
            </button>
            <button
              onClick={() => setContentSubTab('documents')}
              className={`px-3 py-1.5 text-xs font-medium rounded transition-colors ${
                contentSubTab === 'documents'
                  ? 'bg-[#111111] text-white'
                  : 'text-[#6B6B6B] hover:text-[#111111]'
              }`}
            >
              Documents ({documents.length})
            </button>
          </div>

          {/* Announcements sub-tab */}
          {contentSubTab === 'announcements' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-[#111111]">Published Announcements</h3>
                  <p className="text-xs text-[#6B6B6B]">Audience-targeted department bulletins</p>
                </div>
                <Button size="sm" onClick={() => setIsCreateAnnouncementModalOpen(true)}>
                  <Plus className="w-3.5 h-3.5 mr-1" />
                  <span>Create Announcement</span>
                </Button>
              </div>

              <div className="bg-white border border-[#E3E3E3] rounded-md divide-y divide-[#E3E3E3]">
                {announcements.map((a) => (
                  <div key={a.id} className="p-4 flex items-center justify-between gap-4">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 text-xs text-[#6B6B6B] mb-1">
                        <span className="font-semibold text-[#111111]">{a.category}</span>
                        <span>·</span>
                        <span>Target: {a.audience}</span>
                        <span>·</span>
                        <span>{a.publishedDate}</span>
                      </div>
                      <h4 className="text-sm font-bold text-[#111111] truncate">{a.title}</h4>
                      <p className="text-xs text-[#6B6B6B] line-clamp-1 mt-0.5">{a.summary}</p>
                    </div>
                    <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      {a.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Resources sub-tab */}
          {contentSubTab === 'resources' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-[#111111]">Employee Resources & SOPs</h3>
                  <p className="text-xs text-[#6B6B6B]">Policy guides and onboarding documentation</p>
                </div>
                <Button size="sm" onClick={() => setIsAddResourceModalOpen(true)}>
                  <Plus className="w-3.5 h-3.5 mr-1" />
                  <span>Add Resource</span>
                </Button>
              </div>

              <div className="bg-white border border-[#E3E3E3] rounded-md divide-y divide-[#E3E3E3]">
                {resources.map((r) => (
                  <div key={r.id} className="p-4 flex items-center justify-between gap-4">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 text-xs text-[#6B6B6B] mb-1">
                        <span className="font-semibold text-[#111111]">{r.category}</span>
                        <span>·</span>
                        <span>Applicable: {r.applicableTo}</span>
                        <span>·</span>
                        <span>Updated {r.lastUpdated}</span>
                      </div>
                      <h4 className="text-sm font-bold text-[#111111]">{r.title}</h4>
                      <p className="text-xs text-[#6B6B6B] line-clamp-1 mt-0.5">{r.description}</p>
                    </div>
                    <span className="text-xs font-mono text-[#6B6B6B]">{r.format}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Quick Links sub-tab */}
          {contentSubTab === 'quickLinks' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-[#111111]">Quick Links Directory</h3>
                  <p className="text-xs text-[#6B6B6B]">Federated SSO app links and consoles</p>
                </div>
                <Button size="sm" onClick={() => setIsAddQuickLinkModalOpen(true)}>
                  <Plus className="w-3.5 h-3.5 mr-1" />
                  <span>Add Quick Link</span>
                </Button>
              </div>

              <div className="bg-white border border-[#E3E3E3] rounded-md divide-y divide-[#E3E3E3]">
                {quickLinks.map((q) => (
                  <div key={q.id} className="p-4 flex items-center justify-between gap-4">
                    <div>
                      <div className="text-xs text-[#6B6B6B] mb-0.5">
                        {q.category} · Scope: {q.scope}
                      </div>
                      <h4 className="text-sm font-bold text-[#111111]">{q.title}</h4>
                      <p className="text-xs text-[#6B6B6B]">{q.description}</p>
                    </div>
                    <span className="font-mono text-xs text-[#C8102E] truncate max-w-xs">{q.url}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Documents sub-tab */}
          {contentSubTab === 'documents' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-[#111111]">Document Specifications</h3>
                  <p className="text-xs text-[#6B6B6B]">Managed documents and architecture charters</p>
                </div>
              </div>

              <div className="bg-white border border-[#E3E3E3] rounded-md divide-y divide-[#E3E3E3]">
                {documents.map((d) => (
                  <div key={d.id} className="p-4 flex items-center justify-between gap-4">
                    <div>
                      <div className="text-xs text-[#6B6B6B] mb-0.5">
                        {d.type} · {d.category} · {d.version}
                      </div>
                      <h4 className="text-sm font-bold text-[#111111]">{d.title}</h4>
                      <p className="text-xs text-[#6B6B6B]">Owner: {d.owner} · Updated {d.lastUpdated}</p>
                    </div>
                    <span className="font-mono text-xs text-[#111111]">{d.fileSize}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* MODAL 1: ADD TEAM */}
      <Modal
        isOpen={isAddTeamModalOpen}
        onClose={() => setIsAddTeamModalOpen(false)}
        title="Add New Engineering Team"
        subtitle="Create a squad in the organization tree and assign an engineering manager."
      >
        <form onSubmit={handleCreateTeam} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-[#111111] mb-1">Team Name</label>
            <input
              type="text"
              required
              value={newTeam.name}
              onChange={(e) => setNewTeam({ ...newTeam, name: e.target.value })}
              placeholder="e.g. Identity & Security Engineering"
              className="w-full p-2 bg-[#F6F6F6] border border-[#E3E3E3] rounded text-xs text-[#111111] outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-[#111111] mb-1">Code</label>
              <input
                type="text"
                value={newTeam.code}
                onChange={(e) => setNewTeam({ ...newTeam, code: e.target.value })}
                placeholder="e.g. SEC-ENG"
                className="w-full p-2 bg-[#F6F6F6] border border-[#E3E3E3] rounded text-xs text-[#111111] outline-none font-mono"
              />
            </div>
            <div>
              <label className="block font-semibold text-[#111111] mb-1">Sub-Department</label>
              <select
                value={newTeam.subDepartmentId}
                onChange={(e) => setNewTeam({ ...newTeam, subDepartmentId: e.target.value })}
                className="w-full p-2 bg-[#F6F6F6] border border-[#E3E3E3] rounded text-xs text-[#111111] outline-none"
              >
                {subDepartments.map((sd) => (
                  <option key={sd.id} value={sd.id}>
                    {sd.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-[#111111] mb-1">Assign Manager</label>
            <select
              value={newTeam.managerId}
              onChange={(e) => setNewTeam({ ...newTeam, managerId: e.target.value })}
              className="w-full p-2 bg-[#F6F6F6] border border-[#E3E3E3] rounded text-xs text-[#111111] outline-none"
            >
              {employees
                .filter(
                  (e) =>
                    e.role === 'Team Manager' ||
                    e.role === 'Operations Manager' ||
                    e.role === 'GBS Vice President' ||
                    e.role === 'Sub-Department Director'
                )
                .map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name} ({m.title})
                  </option>
                ))}
            </select>
          </div>

          <div>
            <label className="block font-semibold text-[#111111] mb-1">Description</label>
            <textarea
              rows={2}
              required
              value={newTeam.description}
              onChange={(e) => setNewTeam({ ...newTeam, description: e.target.value })}
              placeholder="What does this team do?"
              className="w-full p-2 bg-[#F6F6F6] border border-[#E3E3E3] rounded text-xs text-[#111111] outline-none"
            />
          </div>

          <div>
            <label className="block font-semibold text-[#111111] mb-1">
              Responsibilities (one per line)
            </label>
            <textarea
              rows={3}
              value={newTeam.responsibilities}
              onChange={(e) => setNewTeam({ ...newTeam, responsibilities: e.target.value })}
              placeholder="Operate zero-trust IAM proxies&#10;Audit corporate key management"
              className="w-full p-2 bg-[#F6F6F6] border border-[#E3E3E3] rounded text-xs text-[#111111] outline-none font-mono"
            />
          </div>

          <div className="pt-3 border-t border-[#E3E3E3] flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsAddTeamModalOpen(false)}
              className="px-3 py-1.5 bg-[#F6F6F6] border border-[#E3E3E3] rounded text-xs text-[#111111]"
            >
              Cancel
            </button>
            <Button type="submit" size="sm">
              Create Team in Org Tree
            </Button>
          </div>
        </form>
      </Modal>

      {/* MODAL 2: EDIT TEAM */}
      {teamToEdit && (
        <Modal
          isOpen={isEditTeamModalOpen}
          onClose={() => setIsEditTeamModalOpen(false)}
          title={`Edit Team: ${teamToEdit.name}`}
          subtitle="Modify team title, parent sub-department, or assign a new manager."
        >
          <form onSubmit={handleUpdateTeam} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-[#111111] mb-1">Team Name</label>
              <input
                type="text"
                required
                value={teamToEdit.name}
                onChange={(e) => setTeamToEdit({ ...teamToEdit, name: e.target.value })}
                className="w-full p-2 bg-[#F6F6F6] border border-[#E3E3E3] rounded text-xs text-[#111111] outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-[#111111] mb-1">Sub-Department</label>
              <select
                value={teamToEdit.subDepartmentId}
                onChange={(e) => setTeamToEdit({ ...teamToEdit, subDepartmentId: e.target.value })}
                className="w-full p-2 bg-[#F6F6F6] border border-[#E3E3E3] rounded text-xs text-[#111111] outline-none"
              >
                {subDepartments.map((sd) => (
                  <option key={sd.id} value={sd.id}>
                    {sd.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-[#111111] mb-1">Assigned Manager</label>
              <select
                value={teamToEdit.managerId}
                onChange={(e) => setTeamToEdit({ ...teamToEdit, managerId: e.target.value })}
                className="w-full p-2 bg-[#F6F6F6] border border-[#E3E3E3] rounded text-xs text-[#111111] outline-none"
              >
                {employees
                  .filter(
                    (e) =>
                      e.role === 'Team Manager' ||
                      e.role === 'Operations Manager' ||
                      e.role === 'GBS Vice President' ||
                      e.role === 'Sub-Department Director'
                  )
                  .map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name} ({m.title})
                    </option>
                  ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-[#111111] mb-1">Description</label>
              <textarea
                rows={3}
                required
                value={teamToEdit.description}
                onChange={(e) => setTeamToEdit({ ...teamToEdit, description: e.target.value })}
                className="w-full p-2 bg-[#F6F6F6] border border-[#E3E3E3] rounded text-xs text-[#111111] outline-none"
              />
            </div>

            <div className="pt-3 border-t border-[#E3E3E3] flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsEditTeamModalOpen(false)}
                className="px-3 py-1.5 bg-[#F6F6F6] border border-[#E3E3E3] rounded text-xs text-[#111111]"
              >
                Cancel
              </button>
              <Button type="submit" size="sm">
                Save Team Changes
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* MODAL 3: CREATE ANNOUNCEMENT */}
      <Modal
        isOpen={isCreateAnnouncementModalOpen}
        onClose={() => setIsCreateAnnouncementModalOpen(false)}
        title="Create & Broadcast Announcement"
        subtitle="Publish a department or sub-department targeted bulletin."
      >
        <form onSubmit={handleCreateAnnouncement} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-[#111111] mb-1">Title</label>
            <input
              type="text"
              required
              value={newAnnouncement.title}
              onChange={(e) => setNewAnnouncement({ ...newAnnouncement, title: e.target.value })}
              placeholder="e.g. Migration to Unified Logging Standard"
              className="w-full p-2 bg-[#F6F6F6] border border-[#E3E3E3] rounded text-xs text-[#111111] outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-[#111111] mb-1">Category</label>
              <select
                value={newAnnouncement.category}
                onChange={(e) =>
                  setNewAnnouncement({
                    ...newAnnouncement,
                    category: e.target.value as Announcement['category'],
                  })
                }
                className="w-full p-2 bg-[#F6F6F6] border border-[#E3E3E3] rounded text-xs text-[#111111] outline-none"
              >
                <option value="Strategic">Strategic</option>
                <option value="Transformation">Transformation</option>
                <option value="Operations">Operations</option>
                <option value="Process Excellence">Process Excellence</option>
                <option value="Systems & Tools">Systems & Tools</option>
                <option value="People & Culture">People & Culture</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-[#111111] mb-1">Target Audience</label>
              <select
                value={newAnnouncement.audience}
                onChange={(e) =>
                  setNewAnnouncement({
                    ...newAnnouncement,
                    audience: e.target.value as Announcement['audience'],
                  })
                }
                className="w-full p-2 bg-[#F6F6F6] border border-[#E3E3E3] rounded text-xs text-[#111111] outline-none"
              >
                <option value="Entire GBS">Entire GBS</option>
                <option value="GBS-BTS">GBS-BTS</option>
                <option value="GPS-BO">GPS-BO</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-[#111111] mb-1">Summary (1-2 sentences)</label>
            <input
              type="text"
              required
              value={newAnnouncement.summary}
              onChange={(e) => setNewAnnouncement({ ...newAnnouncement, summary: e.target.value })}
              placeholder="Brief summary appearing on homepage and lists"
              className="w-full p-2 bg-[#F6F6F6] border border-[#E3E3E3] rounded text-xs text-[#111111] outline-none"
            />
          </div>

          <div>
            <label className="block font-semibold text-[#111111] mb-1">Full Bulletin Content</label>
            <textarea
              rows={4}
              required
              value={newAnnouncement.content}
              onChange={(e) => setNewAnnouncement({ ...newAnnouncement, content: e.target.value })}
              placeholder="Detailed instructions, timeline, and link to documentation"
              className="w-full p-2 bg-[#F6F6F6] border border-[#E3E3E3] rounded text-xs text-[#111111] outline-none"
            />
          </div>

          <div className="pt-3 border-t border-[#E3E3E3] flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsCreateAnnouncementModalOpen(false)}
              className="px-3 py-1.5 bg-[#F6F6F6] border border-[#E3E3E3] rounded text-xs text-[#111111]"
            >
              Cancel
            </button>
            <Button type="submit" size="sm">
              Publish Announcement
            </Button>
          </div>
        </form>
      </Modal>

      {/* MODAL 4: ADD QUICK LINK */}
      <Modal
        isOpen={isAddQuickLinkModalOpen}
        onClose={() => setIsAddQuickLinkModalOpen(false)}
        title="Add Enterprise Quick Link"
        subtitle="Provide a single-click access point for an internal tool or portal."
      >
        <form onSubmit={handleAddQuickLink} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-[#111111] mb-1">Title</label>
            <input
              type="text"
              required
              value={newQuickLink.title}
              onChange={(e) => setNewQuickLink({ ...newQuickLink, title: e.target.value })}
              placeholder="e.g. Grafana Dashboards"
              className="w-full p-2 bg-[#F6F6F6] border border-[#E3E3E3] rounded text-xs text-[#111111] outline-none"
            />
          </div>

          <div>
            <label className="block font-semibold text-[#111111] mb-1">URL</label>
            <input
              type="url"
              required
              value={newQuickLink.url}
              onChange={(e) => setNewQuickLink({ ...newQuickLink, url: e.target.value })}
              className="w-full p-2 bg-[#F6F6F6] border border-[#E3E3E3] rounded text-xs text-[#111111] outline-none font-mono"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-[#111111] mb-1">Category</label>
              <select
                value={newQuickLink.category}
                onChange={(e) =>
                  setNewQuickLink({
                    ...newQuickLink,
                    category: e.target.value as QuickLink['category'],
                  })
                }
                className="w-full p-2 bg-[#F6F6F6] border border-[#E3E3E3] rounded text-xs text-[#111111] outline-none"
              >
                <option value="Enterprise Suite">Enterprise Suite</option>
                <option value="Business Operations">Business Operations</option>
                <option value="Transformation Tools">Transformation Tools</option>
                <option value="Productivity">Productivity</option>
                <option value="Support">Support</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-[#111111] mb-1">Scope</label>
              <select
                value={newQuickLink.scope}
                onChange={(e) =>
                  setNewQuickLink({
                    ...newQuickLink,
                    scope: e.target.value as QuickLink['scope'],
                  })
                }
                className="w-full p-2 bg-[#F6F6F6] border border-[#E3E3E3] rounded text-xs text-[#111111] outline-none"
              >
                <option value="Entire GBS">Entire GBS</option>
                <option value="GBS-BTS">GBS-BTS</option>
                <option value="GPS-BO">GPS-BO</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-[#111111] mb-1">Description</label>
            <input
              type="text"
              required
              value={newQuickLink.description}
              onChange={(e) => setNewQuickLink({ ...newQuickLink, description: e.target.value })}
              placeholder="Short description of what users can do here"
              className="w-full p-2 bg-[#F6F6F6] border border-[#E3E3E3] rounded text-xs text-[#111111] outline-none"
            />
          </div>

          <div className="pt-3 border-t border-[#E3E3E3] flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsAddQuickLinkModalOpen(false)}
              className="px-3 py-1.5 bg-[#F6F6F6] border border-[#E3E3E3] rounded text-xs text-[#111111]"
            >
              Cancel
            </button>
            <Button type="submit" size="sm">
              Add Link
            </Button>
          </div>
        </form>
      </Modal>

      {/* MODAL 5: ADD RESOURCE */}
      <Modal
        isOpen={isAddResourceModalOpen}
        onClose={() => setIsAddResourceModalOpen(false)}
        title="Add Employee Resource / SOP"
        subtitle="Register a certified process or policy guide."
      >
        <form onSubmit={handleAddResource} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-[#111111] mb-1">Title</label>
            <input
              type="text"
              required
              value={newResource.title}
              onChange={(e) => setNewResource({ ...newResource, title: e.target.value })}
              placeholder="e.g. Incident Post-Mortem Process"
              className="w-full p-2 bg-[#F6F6F6] border border-[#E3E3E3] rounded text-xs text-[#111111] outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-[#111111] mb-1">Category</label>
              <select
                value={newResource.category}
                onChange={(e) =>
                  setNewResource({
                    ...newResource,
                    category: e.target.value as ResourceItem['category'],
                  })
                }
                className="w-full p-2 bg-[#F6F6F6] border border-[#E3E3E3] rounded text-xs text-[#111111] outline-none"
              >
                <option value="IT">IT</option>
                <option value="HR">HR</option>
                <option value="Policies">Policies</option>
                <option value="Training">Training</option>
                <option value="Processes">Processes</option>
                <option value="Internal Tools">Internal Tools</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-[#111111] mb-1">Format</label>
              <select
                value={newResource.format}
                onChange={(e) =>
                  setNewResource({
                    ...newResource,
                    format: e.target.value as ResourceItem['format'],
                  })
                }
                className="w-full p-2 bg-[#F6F6F6] border border-[#E3E3E3] rounded text-xs text-[#111111] outline-none"
              >
                <option value="Guide">Guide</option>
                <option value="Doc">Doc</option>
                <option value="Policy">Policy</option>
                <option value="Portal">Portal</option>
                <option value="PDF">PDF</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-[#111111] mb-1">Description</label>
            <textarea
              rows={2}
              required
              value={newResource.description}
              onChange={(e) => setNewResource({ ...newResource, description: e.target.value })}
              placeholder="Summary of this resource"
              className="w-full p-2 bg-[#F6F6F6] border border-[#E3E3E3] rounded text-xs text-[#111111] outline-none"
            />
          </div>

          <div className="pt-3 border-t border-[#E3E3E3] flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsAddResourceModalOpen(false)}
              className="px-3 py-1.5 bg-[#F6F6F6] border border-[#E3E3E3] rounded text-xs text-[#111111]"
            >
              Cancel
            </button>
            <Button type="submit" size="sm">
              Save Resource
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
