import React from 'react';
import {
  MessageSquare,
  Mail,
  FileText,
  UserCheck,
  Headphones,
  Layers,
  Activity,
  Cloud,
  GitBranch,
  Database,
  CheckSquare,
  BookOpen,
  ExternalLink,
  Link2,
} from 'lucide-react';
import { QuickLink } from '../../types';

const iconMap: Record<string, React.ElementType> = {
  MessageSquare,
  Mail,
  FileText,
  UserCheck,
  Headphones,
  Layers,
  Activity,
  Cloud,
  GitBranch,
  Database,
  CheckSquare,
  BookOpen,
};

interface QuickLinkCardProps {
  quickLink: QuickLink;
  onLaunch?: (quickLink: QuickLink) => void;
}

export const QuickLinkCard: React.FC<QuickLinkCardProps> = ({ quickLink, onLaunch }) => {
  const IconComponent = iconMap[quickLink.iconName] || Link2;

  const handleClick = (e: React.MouseEvent) => {
    if (onLaunch) {
      e.preventDefault();
      onLaunch(quickLink);
    }
  };

  return (
    <a
      href={quickLink.url}
      onClick={handleClick}
      target="_blank"
      rel="noopener noreferrer"
      className="bg-white border border-[#E3E3E3] rounded-md p-4 flex items-start gap-3.5 hover:border-[#111111] hover:shadow-xs transition-all group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C8102E]"
    >
      <div className="w-10 h-10 rounded-sm bg-[#F6F6F6] border border-[#E3E3E3] group-hover:bg-[#111111] group-hover:text-white text-[#111111] flex items-center justify-center shrink-0 transition-colors">
        <IconComponent className="w-5 h-5" />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-1">
          <h4 className="text-sm font-bold text-[#111111] group-hover:text-[#C8102E] transition-colors truncate">
            {quickLink.title}
          </h4>
          <ExternalLink className="w-3.5 h-3.5 text-[#6B6B6B] opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
        </div>
        <p className="text-xs text-[#6B6B6B] mt-0.5 line-clamp-2 leading-relaxed">
          {quickLink.description}
        </p>
        <div className="mt-2 text-[11px] text-[#6B6B6B]">
          <span>Scope: {quickLink.scope}</span>
        </div>
      </div>
    </a>
  );
};
