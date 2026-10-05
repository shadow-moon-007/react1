import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

export interface BreadcrumbItem {
  label: string;
  to?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items }) => {
  return (
    <nav aria-label="Breadcrumb" className="flex items-center text-xs text-[#6B6B6B] mb-4 overflow-x-auto whitespace-nowrap py-1">
      <Link
        to="/"
        className="flex items-center gap-1 hover:text-[#111111] transition-colors focus-visible:outline-none focus-visible:underline"
      >
        <Home className="w-3.5 h-3.5" />
        <span>Intranet</span>
      </Link>
      {items.map((item, idx) => {
        const isLast = idx === items.length - 1;
        return (
          <React.Fragment key={idx}>
            <ChevronRight className="w-3 h-3 mx-2 text-[#6B6B6B] shrink-0" aria-hidden="true" />
            {isLast || !item.to ? (
              <span className="font-semibold text-[#111111] truncate" aria-current={isLast ? 'page' : undefined}>
                {item.label}
              </span>
            ) : (
              <Link
                to={item.to}
                className="hover:text-[#111111] transition-colors focus-visible:outline-none focus-visible:underline truncate max-w-[200px]"
              >
                {item.label}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};
