import React from 'react';
import { ExternalLink, FileText, ArrowRight } from 'lucide-react';
import { ResourceItem } from '../../types';

interface ResourceCardProps {
  resource: ResourceItem;
  onOpen?: (resource: ResourceItem) => void;
}

export const ResourceCard: React.FC<ResourceCardProps> = ({ resource, onOpen }) => {
  return (
    <div className="bg-white border border-[#E3E3E3] rounded-md p-5 flex flex-col justify-between hover:border-[#111111] transition-all">
      <div>
        {/* Unboxed clean metadata line */}
        <div className="flex items-center gap-2 text-xs text-[#6B6B6B] mb-2 flex-wrap">
          <span className="font-semibold text-[#111111]">{resource.category}</span>
          <span aria-hidden="true">·</span>
          <span>Applicable: {resource.applicableTo}</span>
          <span aria-hidden="true">·</span>
          <span>Updated {resource.lastUpdated}</span>
        </div>

        {/* Title */}
        <h4 className="text-base font-bold text-[#111111] mb-2 leading-snug">
          {resource.title}
        </h4>

        {/* Description */}
        <p className="text-xs text-[#6B6B6B] leading-relaxed mb-4">
          {resource.description}
        </p>
      </div>

      {/* Footer action */}
      <div className="pt-3 border-t border-[#E3E3E3] flex items-center justify-between">
        <span className="text-xs text-[#6B6B6B] font-mono">
          Format: {resource.format}
        </span>
        <button
          onClick={() => (onOpen ? onOpen(resource) : null)}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#C8102E] hover:text-[#8F0B20] transition-colors focus-visible:outline-none focus-visible:underline cursor-pointer"
        >
          <span>Open Resource</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
