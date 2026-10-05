import React, { useState, useEffect } from 'react';
import { Link2, Search, ExternalLink } from 'lucide-react';
import { intranetService } from '../services/intranetService';
import { QuickLink } from '../types';
import { Breadcrumbs } from '../components/ui/Breadcrumbs';
import { QuickLinkCard } from '../components/content/QuickLinkCard';
import { Modal } from '../components/ui/Modal';
import { Button } from '../components/ui/Button';

export const QuickLinksPage: React.FC = () => {
  const [quickLinks, setQuickLinks] = useState<QuickLink[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [activeModalLink, setActiveModalLink] = useState<QuickLink | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const qls = await intranetService.getQuickLinks();
      setQuickLinks(qls);
    };
    fetchData();
    const unsubscribe = intranetService.subscribe(fetchData);
    return () => unsubscribe();
  }, []);

  const categories = [
    'All',
    'Enterprise Suite',
    'Business Operations',
    'Transformation Tools',
    'Productivity',
    'Support',
  ];

  const filteredLinks = quickLinks.filter((ql) => {
    const matchesCategory =
      selectedCategory === 'All' || ql.category === selectedCategory;
    const matchesSearch =
      !searchQuery ||
      ql.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ql.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <Breadcrumbs items={[{ label: 'GBS Quick Links' }]} />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#8F0B20] uppercase tracking-wider mb-1">
            <Link2 className="w-4 h-4 text-[#C8102E]" />
            <span>GBS Core Systems</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#111111] tracking-tight">
            GBS Quick Links & Shared Service Consoles
          </h1>
          <p className="text-sm text-[#6B6B6B] mt-1">
            Instant single sign-on access to ServiceNow, SAP S/4HANA, Coupa, Celonis, UiPath Orchestrator, BlackLine, and PowerBI.
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-[#6B6B6B]" />
          <input
            type="text"
            placeholder="Search links..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs text-[#111111] bg-white border border-[#E3E3E3] rounded focus-visible:outline-none focus-visible:border-[#C8102E]"
          />
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap items-center gap-1.5">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 text-xs font-medium rounded transition-colors ${
              selectedCategory === cat
                ? 'bg-[#111111] text-white'
                : 'bg-white border border-[#E3E3E3] text-[#6B6B6B] hover:text-[#111111] hover:bg-[#F6F6F6]'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid */}
      {filteredLinks.length === 0 ? (
        <div className="bg-white border border-[#E3E3E3] rounded-md p-12 text-center text-sm text-[#6B6B6B]">
          No quick links found matching your filters.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredLinks.map((ql) => (
            <QuickLinkCard
              key={ql.id}
              quickLink={ql}
              onLaunch={(link) => setActiveModalLink(link)}
            />
          ))}
        </div>
      )}

      {/* Launch Confirmation / Info Modal */}
      {activeModalLink && (
        <Modal
          isOpen={!!activeModalLink}
          onClose={() => setActiveModalLink(null)}
          title={`Launch ${activeModalLink.title}`}
          subtitle={`Scope: ${activeModalLink.scope} · Category: ${activeModalLink.category}`}
          maxWidth="md"
        >
          <div className="space-y-4 text-xs">
            <p className="text-sm text-[#111111] leading-relaxed">
              {activeModalLink.description}
            </p>
            <div className="p-3 bg-[#F6F6F6] border border-[#E3E3E3] rounded text-xs space-y-1">
              <div>Target URL: <span className="font-mono text-[#111111]">{activeModalLink.url}</span></div>
              <div>Single Sign-On: <span className="text-emerald-700 font-semibold">Entra ID SAML / OIDC federated</span></div>
            </div>
            <div className="pt-3 border-t border-[#E3E3E3] flex justify-end gap-2">
              <button
                onClick={() => setActiveModalLink(null)}
                className="px-3 py-1.5 text-xs font-medium text-[#111111] bg-[#F6F6F6] border border-[#E3E3E3] rounded hover:bg-neutral-200"
              >
                Cancel
              </button>
              <a
                href={activeModalLink.url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setActiveModalLink(null)}
                className="px-3.5 py-1.5 text-xs font-semibold text-white bg-[#C8102E] hover:bg-[#8F0B20] rounded inline-flex items-center gap-1.5"
              >
                <span>Proceed to Application</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
