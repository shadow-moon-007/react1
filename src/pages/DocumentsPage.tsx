import React, { useState, useEffect } from 'react';
import { FileText, Search, Download, Eye, ExternalLink } from 'lucide-react';
import { intranetService } from '../services/intranetService';
import { DocumentItem, SubDepartment } from '../types';
import { Breadcrumbs } from '../components/ui/Breadcrumbs';
import { DocumentCard } from '../components/content/DocumentCard';
import { Modal } from '../components/ui/Modal';
import { Button } from '../components/ui/Button';

export const DocumentsPage: React.FC = () => {
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [subDepartments, setSubDepartments] = useState<SubDepartment[]>([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [activeScope, setActiveScope] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [previewDoc, setPreviewDoc] = useState<DocumentItem | null>(null);
  const [downloadSuccessDoc, setDownloadSuccessDoc] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const [docs, sds] = await Promise.all([
        intranetService.getDocuments(),
        intranetService.getSubDepartments(),
      ]);
      setDocuments(docs);
      setSubDepartments(sds);
    };
    fetchData();
    const unsubscribe = intranetService.subscribe(fetchData);
    return () => unsubscribe();
  }, []);

  const categories = ['All', 'Governance', 'Operations', 'Transformation', 'Finance', 'Procurement', 'IT & Security'];
  const scopes = ['All', 'Department', 'Sub-Department', 'Team'];

  const filteredDocs = documents.filter((d) => {
    const matchesCategory =
      activeCategory === 'All' || d.category === activeCategory;
    const matchesScope = activeScope === 'All' || d.scope === activeScope;
    const matchesSearch =
      !searchQuery ||
      d.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.owner.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.type.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesScope && matchesSearch;
  });

  const handleDownload = (doc: DocumentItem) => {
    setDownloadSuccessDoc(doc.title);
    setTimeout(() => {
      setDownloadSuccessDoc(null);
    }, 4000);
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <Breadcrumbs items={[{ label: 'Documents & SOPs' }]} />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#8F0B20] uppercase tracking-wider mb-1">
            <FileText className="w-4 h-4 text-[#C8102E]" />
            <span>Document Repository</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#111111] tracking-tight">
            Documents, Standards & SOPs
          </h1>
          <p className="text-sm text-[#6B6B6B] mt-1">
            Official engineering architecture specs, disaster recovery runbooks, and corporate governance records.
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-[#6B6B6B]" />
          <input
            type="text"
            placeholder="Search documents..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs text-[#111111] bg-white border border-[#E3E3E3] rounded focus-visible:outline-none focus-visible:border-[#C8102E]"
          />
        </div>
      </div>

      {/* Download Alert Notification */}
      {downloadSuccessDoc && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded flex items-center justify-between animate-in fade-in">
          <span>
            Simulated download initiated for: <strong className="font-semibold">{downloadSuccessDoc}</strong>
          </span>
          <button
            onClick={() => setDownloadSuccessDoc(null)}
            className="text-emerald-800 font-bold hover:underline"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Filters */}
      <div className="space-y-3">
        {/* Category filter */}
        <div>
          <div className="text-[11px] font-semibold text-[#6B6B6B] uppercase tracking-wider mb-1.5">
            Category
          </div>
          <div className="flex flex-wrap items-center gap-1.5">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setActiveCategory(c)}
                className={`px-3 py-1.5 text-xs font-medium rounded transition-colors ${
                  activeCategory === c
                    ? 'bg-[#111111] text-white'
                    : 'bg-white border border-[#E3E3E3] text-[#6B6B6B] hover:text-[#111111] hover:bg-[#F6F6F6]'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* Scope selector */}
        <div className="flex items-center gap-2 text-xs text-[#6B6B6B]">
          <span className="font-semibold text-[#111111]">Applicable Scope:</span>
          <select
            value={activeScope}
            onChange={(e) => setActiveScope(e.target.value)}
            className="text-xs bg-white border border-[#E3E3E3] rounded px-2.5 py-1 text-[#111111] outline-none"
          >
            {scopes.map((s) => (
              <option key={s} value={s}>
                {s === 'All' ? 'All Scopes' : `${s} Level`}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Grid */}
      {filteredDocs.length === 0 ? (
        <div className="bg-white border border-[#E3E3E3] rounded-md p-12 text-center text-sm text-[#6B6B6B]">
          No documents found matching the filter criteria.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredDocs.map((doc) => (
            <DocumentCard
              key={doc.id}
              document={doc}
              onPreview={(d) => setPreviewDoc(d)}
              onDownload={handleDownload}
            />
          ))}
        </div>
      )}

      {/* Document Preview Modal */}
      {previewDoc && (
        <Modal
          isOpen={!!previewDoc}
          onClose={() => setPreviewDoc(null)}
          title={previewDoc.title}
          subtitle={`${previewDoc.type} · ${previewDoc.version}`}
          maxWidth="lg"
        >
          <div className="space-y-4 text-xs">
            <div className="p-4 bg-[#F6F6F6] border border-[#E3E3E3] rounded space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[#6B6B6B]">Owner:</span>
                <span className="font-semibold text-[#111111]">{previewDoc.owner}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#6B6B6B]">Classification:</span>
                <span className="font-semibold text-[#111111]">Enterprise Confidential · {previewDoc.category}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#6B6B6B]">Version & Date:</span>
                <span className="font-mono text-[#111111]">{previewDoc.version} ({previewDoc.lastUpdated})</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#6B6B6B]">File Size:</span>
                <span className="font-mono text-[#111111]">{previewDoc.fileSize}</span>
              </div>
            </div>

            <div className="p-4 bg-white border border-[#E3E3E3] rounded leading-relaxed text-[#111111] text-xs">
              <h5 className="font-bold text-sm mb-2">Document Abstract</h5>
              <p className="text-[#6B6B6B] mb-3">
                This document defines the formal baseline for {previewDoc.title}. It has undergone departmental Architecture Review Board (ARB) certification and is binding across relevant engineering and infrastructure teams.
              </p>
              <div className="p-2.5 bg-[#F6F6F6] rounded text-[11px] font-mono text-[#6B6B6B]">
                Checksum (SHA-256): 9b43e8a719c2... verified against Enterprise Registry
              </div>
            </div>

            <div className="pt-4 border-t border-[#E3E3E3] flex justify-end gap-2">
              <button
                onClick={() => setPreviewDoc(null)}
                className="px-3 py-1.5 text-xs font-medium text-[#111111] bg-[#F6F6F6] border border-[#E3E3E3] rounded hover:bg-neutral-200"
              >
                Close
              </button>
              <Button
                size="sm"
                onClick={() => {
                  handleDownload(previewDoc);
                  setPreviewDoc(null);
                }}
              >
                <Download className="w-3.5 h-3.5 mr-1" />
                <span>Download {previewDoc.fileSize}</span>
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
