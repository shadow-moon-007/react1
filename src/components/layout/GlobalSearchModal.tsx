import React, { useState, useEffect } from 'react';
import { Search, X, Users, Layers, FileText, Bell, ExternalLink, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { intranetService } from '../../services/intranetService';
import { Team, Employee, ResourceItem, Announcement, DocumentItem } from '../../types';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<{
    teams: Team[];
    employees: Employee[];
    resources: ResourceItem[];
    announcements: Announcement[];
    documents: DocumentItem[];
  }>({
    teams: [],
    employees: [],
    resources: [],
    announcements: [],
    documents: [],
  });

  const navigate = useNavigate();

  useEffect(() => {
    if (!isOpen) {
      setQuery('');
      setResults({ teams: [], employees: [], resources: [], announcements: [], documents: [] });
    }
  }, [isOpen]);

  useEffect(() => {
    let active = true;
    const fetchResults = async () => {
      if (!query.trim()) {
        setResults({ teams: [], employees: [], resources: [], announcements: [], documents: [] });
        return;
      }
      const res = await intranetService.globalSearch(query);
      if (active) {
        setResults(res);
      }
    };
    fetchResults();
    return () => {
      active = false;
    };
  }, [query]);

  if (!isOpen) return null;

  const totalResults =
    results.teams.length +
    results.employees.length +
    results.resources.length +
    results.announcements.length +
    results.documents.length;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-16 sm:pt-24 bg-black/60 backdrop-blur-xs"
    >
      <div className="fixed inset-0" onClick={onClose} aria-hidden="true" />
      <div className="relative w-full max-w-2xl bg-white border border-[#E3E3E3] rounded-md shadow-2xl overflow-hidden flex flex-col z-10 max-h-[80vh]">
        <div className="flex items-center px-4 py-3 border-b border-[#E3E3E3] gap-3">
          <Search className="w-5 h-5 text-[#6B6B6B] shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search teams, people, documents, resources, announcements..."
            className="w-full text-sm text-[#111111] placeholder-[#6B6B6B] bg-transparent outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-[#6B6B6B] hover:text-[#111111] p-1 rounded"
              aria-label="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="hidden sm:inline-block text-[11px] text-[#6B6B6B] bg-[#F6F6F6] border border-[#E3E3E3] px-1.5 py-0.5 rounded font-mono">
            ESC
          </kbd>
        </div>

        <div className="p-4 overflow-y-auto divide-y divide-[#E3E3E3]">
          {!query && (
            <div className="py-8 text-center text-sm text-[#6B6B6B]">
              <p>Type to search across the Global Business Services (GBS) department.</p>
              <div className="mt-4 flex flex-wrap justify-center gap-2 text-xs">
                <span className="text-[#6B6B6B]">GBS Suggestions:</span>
                <button
                  onClick={() => setQuery('GBS-BTS')}
                  className="text-[#C8102E] hover:underline"
                >
                  GBS-BTS
                </button>
                <span>·</span>
                <button
                  onClick={() => setQuery('GPS-BO')}
                  className="text-[#C8102E] hover:underline"
                >
                  GPS-BO
                </button>
                <span>·</span>
                <button
                  onClick={() => setQuery('Order-to-Cash')}
                  className="text-[#C8102E] hover:underline"
                >
                  Order-to-Cash
                </button>
                <span>·</span>
                <button
                  onClick={() => setQuery('Automation')}
                  className="text-[#C8102E] hover:underline"
                >
                  Automation
                </button>
                <span>·</span>
                <button
                  onClick={() => setQuery('Alex Morgan')}
                  className="text-[#C8102E] hover:underline"
                >
                  Alex Morgan
                </button>
              </div>
            </div>
          )}

          {query && totalResults === 0 && (
            <div className="py-8 text-center text-sm text-[#6B6B6B]">
              No GBS department matches found for <span className="font-semibold text-[#111111]">"{query}"</span>.
            </div>
          )}

          {results.teams.length > 0 && (
            <div className="py-3">
              <div className="flex items-center gap-2 text-xs font-semibold text-[#6B6B6B] uppercase tracking-wider mb-2">
                <Layers className="w-3.5 h-3.5 text-[#C8102E]" />
                <span>Teams ({results.teams.length})</span>
              </div>
              <div className="space-y-1">
                {results.teams.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => {
                      onClose();
                      navigate(`/organization/${t.subDepartmentId}/teams/${t.id}`);
                    }}
                    className="w-full text-left p-2 rounded hover:bg-[#F6F6F6] transition-colors flex items-center justify-between group"
                  >
                    <div>
                      <div className="text-sm font-medium text-[#111111] group-hover:text-[#C8102E]">
                        {t.name}
                      </div>
                      <div className="text-xs text-[#6B6B6B] line-clamp-1">
                        {t.description}
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-[#6B6B6B] opacity-0 group-hover:opacity-100 transition-opacity shrink-0 ml-2" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {results.employees.length > 0 && (
            <div className="py-3">
              <div className="flex items-center gap-2 text-xs font-semibold text-[#6B6B6B] uppercase tracking-wider mb-2">
                <Users className="w-3.5 h-3.5 text-[#C8102E]" />
                <span>People & Leadership ({results.employees.length})</span>
              </div>
              <div className="space-y-1">
                {results.employees.map((e) => (
                  <button
                    key={e.id}
                    onClick={() => {
                      onClose();
                      if (e.teamId) {
                        navigate(`/organization/${e.subDepartmentId}/teams/${e.teamId}?emp=${e.id}`);
                      } else {
                        navigate(`/organization/${e.subDepartmentId}`);
                      }
                    }}
                    className="w-full text-left p-2 rounded hover:bg-[#F6F6F6] transition-colors flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-sm bg-[#111111] text-white flex items-center justify-center text-xs font-medium shrink-0">
                        {e.initials}
                      </div>
                      <div>
                        <div className="text-sm font-medium text-[#111111] group-hover:text-[#C8102E]">
                          {e.name}
                        </div>
                        <div className="text-xs text-[#6B6B6B]">
                          {e.title} · {e.location}
                        </div>
                      </div>
                    </div>
                    <span className="text-xs text-[#6B6B6B] hidden sm:inline">{e.email}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {results.announcements.length > 0 && (
            <div className="py-3">
              <div className="flex items-center gap-2 text-xs font-semibold text-[#6B6B6B] uppercase tracking-wider mb-2">
                <Bell className="w-3.5 h-3.5 text-[#C8102E]" />
                <span>Announcements ({results.announcements.length})</span>
              </div>
              <div className="space-y-1">
                {results.announcements.map((a) => (
                  <button
                    key={a.id}
                    onClick={() => {
                      onClose();
                      navigate(`/announcements/${a.id}`);
                    }}
                    className="w-full text-left p-2 rounded hover:bg-[#F6F6F6] transition-colors flex items-center justify-between group"
                  >
                    <div>
                      <div className="text-sm font-medium text-[#111111] group-hover:text-[#C8102E]">
                        {a.title}
                      </div>
                      <div className="text-xs text-[#6B6B6B]">
                        {a.publishedDate} · {a.category} · Audience: {a.audience}
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-[#6B6B6B] opacity-0 group-hover:opacity-100 transition-opacity shrink-0 ml-2" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {results.resources.length > 0 && (
            <div className="py-3">
              <div className="flex items-center gap-2 text-xs font-semibold text-[#6B6B6B] uppercase tracking-wider mb-2">
                <FileText className="w-3.5 h-3.5 text-[#C8102E]" />
                <span>Employee Resources ({results.resources.length})</span>
              </div>
              <div className="space-y-1">
                {results.resources.map((r) => (
                  <button
                    key={r.id}
                    onClick={() => {
                      onClose();
                      navigate(`/resources?category=${encodeURIComponent(r.category)}`);
                    }}
                    className="w-full text-left p-2 rounded hover:bg-[#F6F6F6] transition-colors flex items-center justify-between group"
                  >
                    <div>
                      <div className="text-sm font-medium text-[#111111] group-hover:text-[#C8102E]">
                        {r.title}
                      </div>
                      <div className="text-xs text-[#6B6B6B]">
                        {r.category} · Updated {r.lastUpdated}
                      </div>
                    </div>
                    <ExternalLink className="w-3.5 h-3.5 text-[#6B6B6B]" />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
