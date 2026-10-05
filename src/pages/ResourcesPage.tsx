import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  FolderOpen,
  Search,
  Filter,
  ExternalLink,
  FileText,
  CheckCircle,
} from 'lucide-react';
import { intranetService } from '../services/intranetService';
import { ResourceItem, SubDepartment, ResourceCategory } from '../types';
import { Breadcrumbs } from '../components/ui/Breadcrumbs';
import { ResourceCard } from '../components/content/ResourceCard';
import { Modal } from '../components/ui/Modal';
import { Button } from '../components/ui/Button';

const categories: ('All' | ResourceCategory)[] = [
  'All',
  'HR',
  'IT',
  'Policies',
  'Training',
  'Benefits',
  'Forms',
  'Processes',
  'Internal Tools',
];

export const ResourcesPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [resources, setResources] = useState<ResourceItem[]>([]);
  const [subDepartments, setSubDepartments] = useState<SubDepartment[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>(
    searchParams.get('category') || 'All'
  );
  const [activeSubDept, setActiveSubDept] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedResource, setSelectedResource] = useState<ResourceItem | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const [res, sds] = await Promise.all([
        intranetService.getResources(),
        intranetService.getSubDepartments(),
      ]);
      setResources(res);
      setSubDepartments(sds);
    };
    fetchData();
    const unsubscribe = intranetService.subscribe(fetchData);
    return () => unsubscribe();
  }, []);

  // Sync category param with URL if present
  useEffect(() => {
    const paramCat = searchParams.get('category');
    if (paramCat) {
      setActiveCategory(paramCat);
    }
  }, [searchParams]);

  const filteredResources = resources.filter((r) => {
    const matchesCategory =
      activeCategory === 'All' || r.category === activeCategory;
    const matchesSubDept =
      activeSubDept === 'All' ||
      r.applicableTo === 'All Teams' ||
      r.subDepartmentId === activeSubDept;
    const matchesSearch =
      !searchQuery ||
      r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.description.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSubDept && matchesSearch;
  });

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <Breadcrumbs items={[{ label: 'GBS Employee Resources' }]} />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#8F0B20] uppercase tracking-wider mb-1">
            <FolderOpen className="w-4 h-4 text-[#C8102E]" />
            <span>GBS Knowledge & Resource Repository</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#111111] tracking-tight">
            GBS Employee Resources & Operational Guides
          </h1>
          <p className="text-sm text-[#6B6B6B] mt-1">
            Find certified SOPs, IT guidelines, HR policies, onboarding playbooks, and operational templates across GBS-BTS and GPS-BO.
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-[#6B6B6B]" />
          <input
            type="text"
            placeholder="Search resources..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs text-[#111111] bg-white border border-[#E3E3E3] rounded focus-visible:outline-none focus-visible:border-[#C8102E]"
          />
        </div>
      </div>

      {/* Filter Controls */}
      <div className="space-y-3">
        {/* Category Tabs */}
        <div>
          <div className="text-[11px] font-semibold text-[#6B6B6B] uppercase tracking-wider mb-2">
            Filter by Category
          </div>
          <div className="flex flex-wrap items-center gap-1.5">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setActiveCategory(cat);
                  setSearchParams(cat === 'All' ? {} : { category: cat });
                }}
                className={`px-3 py-1.5 text-xs font-medium rounded transition-colors ${
                  activeCategory === cat
                    ? 'bg-[#111111] text-white'
                    : 'bg-white border border-[#E3E3E3] text-[#6B6B6B] hover:text-[#111111] hover:bg-[#F6F6F6]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Sub-Department Selector */}
        <div className="flex items-center gap-2 text-xs text-[#6B6B6B]">
          <span className="font-semibold text-[#111111]">Applicable Sub-Department:</span>
          <select
            value={activeSubDept}
            onChange={(e) => setActiveSubDept(e.target.value)}
            className="text-xs bg-white border border-[#E3E3E3] rounded px-2.5 py-1 text-[#111111] outline-none"
          >
            <option value="All">All Sub-Departments & Enterprise</option>
            {subDepartments.map((sd) => (
              <option key={sd.id} value={sd.id}>
                {sd.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Resources Grid */}
      {filteredResources.length === 0 ? (
        <div className="bg-white border border-[#E3E3E3] rounded-md p-12 text-center text-sm text-[#6B6B6B]">
          No resources matched the selected filters. Try clearing the search or category filter.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredResources.map((res) => (
            <ResourceCard
              key={res.id}
              resource={res}
              onOpen={(r) => setSelectedResource(r)}
            />
          ))}
        </div>
      )}

      {/* Resource Detail Modal */}
      {selectedResource && (
        <Modal
          isOpen={!!selectedResource}
          onClose={() => setSelectedResource(null)}
          title={selectedResource.title}
          subtitle={`Category: ${selectedResource.category} · Updated: ${selectedResource.lastUpdated}`}
        >
          <div className="space-y-4 text-xs">
            <p className="text-sm text-[#111111] leading-relaxed">
              {selectedResource.description}
            </p>

            <div className="p-4 bg-[#F6F6F6] border border-[#E3E3E3] rounded space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[#6B6B6B]">Format:</span>
                <span className="font-semibold text-[#111111]">{selectedResource.format}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#6B6B6B]">Target Audience:</span>
                <span className="font-semibold text-[#111111]">{selectedResource.applicableTo}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#6B6B6B]">Compliance Cycle:</span>
                <span className="text-[#111111]">Annual Corporate Review (Active)</span>
              </div>
            </div>

            <div className="pt-2 text-xs text-[#6B6B6B]">
              This document is hosted in the enterprise knowledge base. In production, this opens the authenticated SharePoint or ServiceNow link.
            </div>

            <div className="pt-4 border-t border-[#E3E3E3] flex justify-end gap-2">
              <button
                onClick={() => setSelectedResource(null)}
                className="px-3 py-1.5 text-xs font-medium text-[#111111] bg-[#F6F6F6] border border-[#E3E3E3] rounded hover:bg-neutral-200"
              >
                Close
              </button>
              <Button size="sm" onClick={() => setSelectedResource(null)}>
                <span>Open in Enterprise Portal</span>
                <ExternalLink className="w-3.5 h-3.5 ml-1" />
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
