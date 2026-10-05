import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  Home,
  Building2,
  Network,
  ChevronDown,
  ChevronRight,
  FolderOpen,
  Link2,
  FileText,
  Bell,
  Calendar,
  PhoneCall,
  LayoutDashboard,
  Settings,
  X,
  Layers,
} from 'lucide-react';
import { intranetService } from '../../services/intranetService';
import { SubDepartment, Team } from '../../types';
import { useAuth } from '../../context/AuthContext';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const [subDepartments, setSubDepartments] = useState<SubDepartment[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [expandedSubDepts, setExpandedSubDepts] = useState<Record<string, boolean>>({
    'gbs-bts': true,
    'gps-bo': true,
  });
  const { user } = useAuth();
  const location = useLocation();

  // Load org hierarchy dynamically from mock service
  useEffect(() => {
    const loadData = async () => {
      const [sds, tms] = await Promise.all([
        intranetService.getSubDepartments(),
        intranetService.getTeams(),
      ]);
      setSubDepartments(sds);
      setTeams(tms);
    };
    loadData();
    const unsubscribe = intranetService.subscribe(loadData);
    return () => unsubscribe();
  }, []);

  // Close drawer on route change on mobile
  useEffect(() => {
    onClose();
  }, [location.pathname]);

  const toggleSubDept = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setExpandedSubDepts((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-2.5 px-3 py-2 text-xs font-medium rounded transition-colors ${
      isActive
        ? 'bg-red-50 text-[#8F0B20] font-semibold border-l-2 border-[#C8102E]'
        : 'text-[#111111] hover:bg-[#F6F6F6] hover:text-[#C8102E]'
    }`;

  const subNavLinkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-2 pl-7 pr-3 py-1.5 text-xs rounded transition-colors ${
      isActive
        ? 'text-[#8F0B20] font-semibold bg-red-50/70'
        : 'text-[#6B6B6B] hover:text-[#111111] hover:bg-[#F6F6F6]'
    }`;

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-64 bg-white border-r border-[#E3E3E3] flex flex-col transition-transform duration-200 ease-in-out lg:translate-x-0 lg:sticky lg:top-16 lg:bottom-auto lg:h-[calc(100vh-4rem)] lg:shrink-0 lg:self-start lg:z-20 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Mobile Header in Drawer */}
        <div className="flex items-center justify-between p-4 border-b border-[#E3E3E3] lg:hidden">
          <div className="flex items-center gap-2">
            <div className="w-2 h-5 bg-[#C8102E] rounded-xs" />
            <span className="text-sm font-bold text-[#111111]">GBS Navigation</span>
          </div>
          <button
            onClick={onClose}
            aria-label="Close navigation"
            className="p-1 rounded text-[#6B6B6B] hover:text-[#111111] hover:bg-[#F6F6F6]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Navigation Area */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6 text-xs">
          {/* SECTION: GBS Overview */}
          <div>
            <div className="px-3 pb-1 text-[11px] font-semibold text-[#6B6B6B] uppercase tracking-wider">
              GBS Overview
            </div>
            <nav className="space-y-0.5">
              <NavLink to="/" end className={navLinkClass}>
                <Home className="w-4 h-4 shrink-0 text-[#6B6B6B]" />
                <span>GBS Home</span>
              </NavLink>
              <NavLink to="/overview" className={navLinkClass}>
                <Building2 className="w-4 h-4 shrink-0 text-[#6B6B6B]" />
                <span>GBS Department Charter</span>
              </NavLink>
              <NavLink to="/organization" className={navLinkClass}>
                <Network className="w-4 h-4 shrink-0 text-[#6B6B6B]" />
                <span>GBS Hierarchy Tree</span>
              </NavLink>
            </nav>
          </div>

          {/* SECTION: GBS Structure (GBS-BTS & GPS-BO with Expandable Teams) */}
          <div>
            <div className="flex items-center justify-between px-3 pb-1 text-[11px] font-semibold text-[#6B6B6B] uppercase tracking-wider">
              <span>GBS Structure</span>
              <NavLink
                to="/organization"
                className="text-[10px] text-[#C8102E] hover:underline normal-case font-normal"
              >
                View tree
              </NavLink>
            </div>
            <div className="space-y-1">
              {subDepartments.map((subDept) => {
                const subTeams = teams.filter((t) => t.subDepartmentId === subDept.id);
                const isExpanded = expandedSubDepts[subDept.id] ?? true;

                return (
                  <div key={subDept.id} className="space-y-0.5">
                    {/* Sub-Department Header Item */}
                    <div className="flex items-center justify-between group rounded hover:bg-[#F6F6F6]">
                      <NavLink
                        to={`/organization/${subDept.id}`}
                        className="flex-1 flex items-center gap-2 px-3 py-1.5 text-xs font-bold text-[#111111] group-hover:text-[#C8102E] truncate"
                      >
                        <Layers className="w-3.5 h-3.5 text-[#C8102E] shrink-0" />
                        <span className="truncate">{subDept.name}</span>
                      </NavLink>
                      <button
                        onClick={(e) => toggleSubDept(subDept.id, e)}
                        aria-label={`Toggle ${subDept.name} teams`}
                        className="p-1.5 text-[#6B6B6B] hover:text-[#111111] transition-colors rounded mr-1"
                      >
                        {isExpanded ? (
                          <ChevronDown className="w-3.5 h-3.5" />
                        ) : (
                          <ChevronRight className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>

                    {/* Expandable Teams List */}
                    {isExpanded && (
                      <div className="space-y-0.5 border-l border-[#E3E3E3] ml-4 my-0.5">
                        {subTeams.map((team) => (
                          <NavLink
                            key={team.id}
                            to={`/organization/${subDept.id}/teams/${team.id}`}
                            className={subNavLinkClass}
                          >
                            <span className="truncate">{team.name}</span>
                          </NavLink>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* SECTION: Resources */}
          <div>
            <div className="px-3 pb-1 text-[11px] font-semibold text-[#6B6B6B] uppercase tracking-wider">
              GBS Resources
            </div>
            <nav className="space-y-0.5">
              <NavLink to="/resources" className={navLinkClass}>
                <FolderOpen className="w-4 h-4 shrink-0 text-[#6B6B6B]" />
                <span>GBS Resources & Guides</span>
              </NavLink>
              <NavLink to="/quick-links" className={navLinkClass}>
                <Link2 className="w-4 h-4 shrink-0 text-[#6B6B6B]" />
                <span>GBS Quick Links</span>
              </NavLink>
              <NavLink to="/documents" className={navLinkClass}>
                <FileText className="w-4 h-4 shrink-0 text-[#6B6B6B]" />
                <span>GBS Documents & SOPs</span>
              </NavLink>
            </nav>
          </div>

          {/* SECTION: Communication */}
          <div>
            <div className="px-3 pb-1 text-[11px] font-semibold text-[#6B6B6B] uppercase tracking-wider">
              GBS Communication
            </div>
            <nav className="space-y-0.5">
              <NavLink to="/announcements" className={navLinkClass}>
                <Bell className="w-4 h-4 shrink-0 text-[#6B6B6B]" />
                <span>GBS Announcements</span>
              </NavLink>
              <NavLink to="/events" className={navLinkClass}>
                <Calendar className="w-4 h-4 shrink-0 text-[#6B6B6B]" />
                <span>GBS Events & Town Halls</span>
              </NavLink>
              <NavLink to="/contact" className={navLinkClass}>
                <PhoneCall className="w-4 h-4 shrink-0 text-[#6B6B6B]" />
                <span>GBS Contacts & Escalations</span>
              </NavLink>
            </nav>
          </div>

          {/* SECTION: Administration (CMS POC) */}
          <div>
            <div className="flex items-center justify-between px-3 pb-1 text-[11px] font-semibold text-[#6B6B6B] uppercase tracking-wider">
              <span>Administration</span>
              <span className="text-[10px] text-[#8F0B20] font-semibold">GBS CMS</span>
            </div>
            <nav className="space-y-0.5">
              <NavLink to="/admin" end className={navLinkClass}>
                <LayoutDashboard className="w-4 h-4 shrink-0 text-[#6B6B6B]" />
                <span>Admin Dashboard</span>
              </NavLink>
              <NavLink to="/admin/content" className={navLinkClass}>
                <Settings className="w-4 h-4 shrink-0 text-[#6B6B6B]" />
                <span>Manage GBS Content</span>
              </NavLink>
              <NavLink to="/admin/organization" className={navLinkClass}>
                <Network className="w-4 h-4 shrink-0 text-[#6B6B6B]" />
                <span>Manage GBS Structure</span>
              </NavLink>
            </nav>
          </div>
        </div>

        {/* Sidebar Footer: Authenticated User Persona Card */}
        <div className="p-3 border-t border-[#E3E3E3] bg-[#F6F6F6]/60 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded bg-[#111111] text-white flex items-center justify-center text-xs font-semibold shrink-0">
              {user.initials}
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-xs font-semibold text-[#111111] truncate">{user.name}</div>
              <div className="text-[10px] text-[#6B6B6B] truncate">{user.role} · GBS</div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
