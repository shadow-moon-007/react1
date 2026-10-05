import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, AlertCircle } from 'lucide-react';
import { Announcement } from '../../types';

interface AnnouncementCardProps {
  announcement: Announcement;
  featured?: boolean;
}

export const AnnouncementCard: React.FC<AnnouncementCardProps> = ({
  announcement,
  featured = false,
}) => {
  return (
    <article
      className={`bg-white border rounded-md p-5 transition-all flex flex-col justify-between ${
        featured
          ? 'border-[#111111] shadow-xs'
          : 'border-[#E3E3E3] hover:border-neutral-400'
      }`}
    >
      <div>
        {/* Unboxed metadata line with typographic separators */}
        <div className="flex items-center gap-2 text-xs text-[#6B6B6B] mb-2 flex-wrap">
          {announcement.priority === 'High' && (
            <span className="flex items-center gap-1 font-semibold text-[#8F0B20]">
              <AlertCircle className="w-3.5 h-3.5 text-[#C8102E]" />
              High Priority
            </span>
          )}
          {announcement.priority === 'High' && <span aria-hidden="true">·</span>}
          <span className="font-medium text-[#111111]">{announcement.category}</span>
          <span aria-hidden="true">·</span>
          <span>Audience: {announcement.audience}</span>
          <span aria-hidden="true">·</span>
          <time dateTime={announcement.publishedDate}>{announcement.publishedDate}</time>
        </div>

        {/* Title */}
        <h4 className="text-base font-bold text-[#111111] hover:text-[#C8102E] transition-colors mb-2">
          <Link to={`/announcements/${announcement.id}`} className="focus-visible:outline-none focus-visible:underline">
            {announcement.title}
          </Link>
        </h4>

        {/* Summary */}
        <p className="text-xs text-[#6B6B6B] leading-relaxed line-clamp-2 mb-4">
          {announcement.summary}
        </p>
      </div>

      {/* Author and Read More */}
      <div className="pt-3 border-t border-[#E3E3E3] flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-sm bg-[#111111] text-white flex items-center justify-center text-[10px] font-semibold">
            {announcement.author.avatarInitials}
          </div>
          <span className="text-[#111111] font-medium">{announcement.author.name}</span>
          <span className="text-[#6B6B6B] hidden sm:inline">· {announcement.readTime}</span>
        </div>

        <Link
          to={`/announcements/${announcement.id}`}
          className="inline-flex items-center gap-1 font-semibold text-[#C8102E] hover:text-[#8F0B20] transition-colors"
        >
          <span>Read Bulletin</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </article>
  );
};
