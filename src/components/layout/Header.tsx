import React, { useState, useEffect } from 'react';
import {
  Menu,
  Search,
  Bell,
  ChevronDown,
  Shield,
  KeyRound,
  ExternalLink,
  LogOut,
  User,
  Check,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';

interface HeaderProps {
  onToggleSidebar: () => void;
  onOpenSearch: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onToggleSidebar, onOpenSearch }) => {
  const { user, activeRole, switchRole, tokenClaims, signOut, isAuthenticated, signIn } = useAuth();
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [claimsModalOpen, setClaimsModalOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  // Keyboard shortcut for Cmd+K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        onOpenSearch();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onOpenSearch]);

  const roles: ('Department Admin' | 'Team Manager' | 'Team Member')[] = [
    'Department Admin',
    'Team Manager',
    'Team Member',
  ];

  return (
    <>
      <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-4 md:px-6 bg-white border-b border-[#E3E3E3]">
        {/* Left Zone: Mobile toggle & Department Brand */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleSidebar}
            aria-label="Toggle navigation menu"
            className="p-2 -ml-1 rounded text-[#111111] hover:bg-[#F6F6F6] lg:hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C8102E]"
          >
            <Menu className="w-5 h-5" />
          </button>

          <a href="/" className="flex items-center gap-2 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C8102E]">
            <div className="w-2.5 h-6 bg-[#C8102E] rounded-xs" aria-hidden="true" />
            <div className="leading-tight">
              <span className="text-base font-bold tracking-tight text-[#111111] group-hover:text-[#C8102E] transition-colors">
                GBS Intranet
              </span>
              <span className="hidden sm:block text-[11px] font-medium text-[#6B6B6B]">
                Global Business Services
              </span>
            </div>
          </a>
        </div>

        {/* Center Zone: Quick Search trigger */}
        <div className="flex-1 max-w-md mx-4 hidden md:block">
          <button
            onClick={onOpenSearch}
            className="w-full flex items-center justify-between px-3 py-1.5 text-xs text-[#6B6B6B] bg-[#F6F6F6] hover:bg-neutral-200/70 border border-[#E3E3E3] rounded transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C8102E]"
          >
            <span className="flex items-center gap-2">
              <Search className="w-4 h-4 text-[#6B6B6B]" />
              <span>Search GBS teams, SOPs, bots, tools, contacts...</span>
            </span>
            <kbd className="font-mono text-[10px] bg-white border border-[#E3E3E3] px-1.5 py-0.5 rounded text-[#6B6B6B]">
              ⌘K
            </kbd>
          </button>
        </div>

        {/* Right Zone: Search (mobile), Notifications & User Identity */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={onOpenSearch}
            aria-label="Open search"
            className="p-2 rounded text-[#6B6B6B] hover:text-[#111111] hover:bg-[#F6F6F6] md:hidden"
          >
            <Search className="w-5 h-5" />
          </button>

          {/* Department Notifications */}
          <div className="relative">
            <button
              onClick={() => setNotificationsOpen(!notificationsOpen)}
              aria-label="Department alerts"
              className="relative p-2 rounded text-[#6B6B6B] hover:text-[#111111] hover:bg-[#F6F6F6] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C8102E]"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#C8102E] rounded-full" />
            </button>

            {notificationsOpen && (
              <div className="absolute right-0 mt-2 w-80 bg-white border border-[#E3E3E3] rounded-md shadow-lg p-3 z-50 animate-in fade-in zoom-in-95">
                <div className="flex items-center justify-between pb-2 border-b border-[#E3E3E3]">
                  <span className="text-xs font-semibold text-[#111111]">Department Bulletins</span>
                  <span className="text-[11px] text-[#6B6B6B]">2 new</span>
                </div>
                <div className="divide-y divide-[#E3E3E3] text-xs">
                  <div className="py-2">
                    <p className="font-medium text-[#111111]">ServiceNow GBS Portal Upgrade Window</p>
                    <p className="text-[#6B6B6B] text-[11px] mt-0.5">Saturday 22:00 UTC · Zero downtime failover</p>
                  </div>
                  <div className="py-2">
                    <p className="font-medium text-[#111111]">GBS Global All-Hands Town Hall</p>
                    <p className="text-[#6B6B6B] text-[11px] mt-0.5">Wednesday 10:00 AM EST · Teams Broadcast</p>
                  </div>
                </div>
                <div className="pt-2 text-center border-t border-[#E3E3E3]">
                  <a href="/announcements" className="text-xs text-[#C8102E] hover:underline font-medium">
                    View all announcements
                  </a>
                </div>
              </div>
            )}
          </div>

          <div className="h-6 w-[1px] bg-[#E3E3E3] mx-1" aria-hidden="true" />

          {/* Microsoft Entra ID User Profile & Persona Switcher */}
          {isAuthenticated ? (
            <div className="relative">
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center gap-2 p-1.5 rounded hover:bg-[#F6F6F6] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C8102E]"
              >
                <div className="w-8 h-8 rounded bg-[#111111] text-white flex items-center justify-center text-xs font-semibold">
                  {user.initials}
                </div>
                <div className="text-left hidden sm:block">
                  <div className="text-xs font-medium text-[#111111] flex items-center gap-1.5 leading-tight">
                    {user.name}
                    <ChevronDown className="w-3 h-3 text-[#6B6B6B]" />
                  </div>
                  <div className="text-[10px] text-[#6B6B6B] leading-tight">
                    {activeRole}
                  </div>
                </div>
              </button>

              {profileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-72 bg-white border border-[#E3E3E3] rounded-md shadow-xl p-3 z-50">
                  <div className="pb-3 border-b border-[#E3E3E3]">
                    <div className="text-sm font-semibold text-[#111111]">{user.name}</div>
                    <div className="text-xs text-[#6B6B6B]">{user.email}</div>
                    <div className="text-xs text-[#6B6B6B] mt-1">
                      {user.title} · {user.team}
                    </div>
                  </div>

                  {/* Entra ID Role Switcher for POC Stakeholders */}
                  <div className="py-2.5 border-b border-[#E3E3E3]">
                    <div className="text-[11px] font-semibold text-[#6B6B6B] uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                      <Shield className="w-3 h-3 text-[#C8102E]" />
                      <span>Switch Demo Persona</span>
                    </div>
                    <div className="space-y-1">
                      {roles.map((r) => (
                        <button
                          key={r}
                          onClick={() => {
                            switchRole(r);
                            setProfileDropdownOpen(false);
                          }}
                          className={`w-full flex items-center justify-between px-2 py-1.5 rounded text-xs text-left transition-colors ${
                            activeRole === r
                              ? 'bg-red-50 text-[#8F0B20] font-medium'
                              : 'text-[#111111] hover:bg-[#F6F6F6]'
                          }`}
                        >
                          <span>{r}</span>
                          {activeRole === r && <Check className="w-3.5 h-3.5 text-[#C8102E]" />}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Entra ID Token Claims Architecture Link */}
                  <div className="py-2 border-b border-[#E3E3E3] space-y-1">
                    <button
                      onClick={() => {
                        setClaimsModalOpen(true);
                        setProfileDropdownOpen(false);
                      }}
                      className="w-full flex items-center gap-2 px-2 py-1.5 text-xs text-[#111111] hover:bg-[#F6F6F6] rounded text-left"
                    >
                      <KeyRound className="w-3.5 h-3.5 text-[#6B6B6B]" />
                      <span>Inspect Entra ID Token Claims</span>
                    </button>
                    <a
                      href={`/organization/gbs-bts/teams/team-bts-auto?emp=${user.id}`}
                      onClick={() => setProfileDropdownOpen(false)}
                      className="w-full flex items-center gap-2 px-2 py-1.5 text-xs text-[#111111] hover:bg-[#F6F6F6] rounded text-left"
                    >
                      <User className="w-3.5 h-3.5 text-[#6B6B6B]" />
                      <span>My Employee Profile</span>
                    </a>
                  </div>

                  {/* Sign Out */}
                  <div className="pt-2">
                    <button
                      onClick={() => {
                        signOut();
                        setProfileDropdownOpen(false);
                      }}
                      className="w-full flex items-center gap-2 px-2 py-1.5 text-xs text-red-700 hover:bg-red-50 rounded text-left"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sign Out (MSAL Simulator)</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Button size="sm" onClick={signIn}>
              Sign In (Entra ID)
            </Button>
          )}
        </div>
      </header>

      {/* Entra ID Claims Modal */}
      <Modal
        isOpen={claimsModalOpen}
        onClose={() => setClaimsModalOpen(false)}
        title="Microsoft Entra ID (MSAL) Claims Inspector"
        subtitle="Live authentication abstraction mapped to Microsoft Graph & Entra ID token payload."
        maxWidth="xl"
      >
        <div className="space-y-4 text-xs">
          <p className="text-[#6B6B6B]">
            This POC uses an authentication boundary configured to drop directly into Microsoft Entra ID (Azure AD MSAL) using authorization code flow with PKCE.
          </p>

          <div className="bg-[#111111] text-neutral-100 p-4 rounded font-mono text-[11px] overflow-x-auto leading-relaxed">
            <pre>{JSON.stringify(tokenClaims, null, 2)}</pre>
          </div>

          <div className="p-3 bg-[#F6F6F6] border border-[#E3E3E3] rounded text-xs space-y-1">
            <div className="font-semibold text-[#111111]">Production Integration Pathway:</div>
            <p className="text-[#6B6B6B]">
              1. Register client ID in Azure Portal App Registrations with scopes <code className="bg-white px-1 py-0.5 border border-[#E3E3E3]">User.Read</code>, <code className="bg-white px-1 py-0.5 border border-[#E3E3E3]">Directory.Read.All</code>.
            </p>
            <p className="text-[#6B6B6B]">
              2. Inject <code className="bg-white px-1 py-0.5 border border-[#E3E3E3]">@azure/msal-react</code> Provider into <code className="bg-white px-1 py-0.5 border border-[#E3E3E3]">src/context/AuthContext.tsx</code>. No UI changes required.
            </p>
          </div>

          <div className="flex justify-end pt-2">
            <Button variant="secondary" size="sm" onClick={() => setClaimsModalOpen(false)}>
              Close Inspector
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};
