import React from 'react';
import { FileText, Download, Eye } from 'lucide-react';
import { DocumentItem } from '../../types';

interface DocumentCardProps {
  document: DocumentItem;
  onPreview?: (doc: DocumentItem) => void;
  onDownload?: (doc: DocumentItem) => void;
}

export const DocumentCard: React.FC<DocumentCardProps> = ({
  document,
  onPreview,
  onDownload,
}) => {
  return (
    <div className="bg-white border border-[#E3E3E3] rounded-md p-5 flex flex-col justify-between hover:border-[#111111] transition-all">
      <div>
        <div className="flex items-center justify-between text-xs text-[#6B6B6B] mb-2 flex-wrap gap-1">
          <div className="flex items-center gap-1.5">
            <span className="font-semibold text-[#111111]">{document.type}</span>
            <span aria-hidden="true">·</span>
            <span>{document.category}</span>
          </div>
          <span className="font-mono text-[#6B6B6B] text-[11px]">{document.version}</span>
        </div>

        <h4 className="text-base font-bold text-[#111111] mb-2 leading-snug">
          {document.title}
        </h4>

        <div className="text-xs text-[#6B6B6B] space-y-1 mb-4">
          <div>Owner: <span className="text-[#111111] font-medium">{document.owner}</span></div>
          <div>Scope: <span className="text-[#111111] font-medium">{document.scope}</span></div>
          <div>Last Updated: <span className="text-[#111111]">{document.lastUpdated}</span></div>
          <div>Size: <span className="font-mono">{document.fileSize}</span></div>
        </div>
      </div>

      <div className="pt-3 border-t border-[#E3E3E3] flex items-center justify-between gap-2">
        <button
          onClick={() => (onPreview ? onPreview(document) : null)}
          className="inline-flex items-center gap-1 text-xs font-semibold text-[#111111] hover:text-[#C8102E] transition-colors focus-visible:outline-none focus-visible:underline cursor-pointer"
        >
          <Eye className="w-3.5 h-3.5 text-[#6B6B6B]" />
          <span>Preview Document</span>
        </button>

        <button
          onClick={() => (onDownload ? onDownload(document) : null)}
          className="inline-flex items-center gap-1 text-xs font-semibold text-[#C8102E] hover:text-[#8F0B20] transition-colors focus-visible:outline-none focus-visible:underline cursor-pointer"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Download</span>
        </button>
      </div>
    </div>
  );
};
