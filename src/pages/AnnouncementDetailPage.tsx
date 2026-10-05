import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Bell,
  ArrowLeft,
  Calendar,
  User,
  ShieldAlert,
  Share2,
  Clock,
} from 'lucide-react';
import { intranetService } from '../services/intranetService';
import { Announcement } from '../types';
import { Breadcrumbs } from '../components/ui/Breadcrumbs';

export const AnnouncementDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [announcement, setAnnouncement] = useState<Announcement | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      const ann = await intranetService.getAnnouncement(id);
      setAnnouncement(ann || null);
    };
    fetchData();
  }, [id]);

  if (!announcement) {
    return (
      <div className="py-12 text-center text-sm text-[#6B6B6B]">
        Announcement not found.{' '}
        <Link to="/announcements" className="text-[#C8102E] underline">
          Back to Announcements
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <Breadcrumbs
        items={[
          { label: 'GBS Announcements', to: '/announcements' },
          { label: announcement.title },
        ]}
      />

      <article className="bg-white border border-[#E3E3E3] rounded-md p-6 sm:p-8">
        {/* Back Link */}
        <Link
          to="/announcements"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#6B6B6B] hover:text-[#111111] mb-6 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to All Announcements</span>
        </Link>

        {/* Clean unboxed metadata header */}
        <div className="flex items-center gap-2 text-xs text-[#6B6B6B] mb-3 flex-wrap">
          {announcement.priority === 'High' && (
            <span className="font-semibold text-[#8F0B20]">High Priority Alert</span>
          )}
          {announcement.priority === 'High' && <span aria-hidden="true">·</span>}
          <span className="font-semibold text-[#111111]">{announcement.category}</span>
          <span aria-hidden="true">·</span>
          <span>Target Audience: <strong className="text-[#111111] font-medium">{announcement.audience}</strong></span>
          <span aria-hidden="true">·</span>
          <span>Published {announcement.publishedDate}</span>
          <span aria-hidden="true">·</span>
          <span>{announcement.readTime}</span>
        </div>

        {/* Title */}
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#111111] tracking-tight leading-snug mb-4">
          {announcement.title}
        </h1>

        {/* Author Card Header */}
        <div className="p-4 bg-[#F6F6F6] border border-[#E3E3E3] rounded-md flex items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-sm bg-[#111111] text-white flex items-center justify-center font-bold text-xs">
              {announcement.author.avatarInitials}
            </div>
            <div>
              <div className="text-sm font-bold text-[#111111]">
                {announcement.author.name}
              </div>
              <div className="text-xs text-[#6B6B6B]">{announcement.author.title}</div>
            </div>
          </div>
          <span className="text-xs text-[#6B6B6B] hidden sm:inline">
            Status: <span className="font-semibold text-[#111111]">{announcement.status}</span>
          </span>
        </div>

        {/* Summary Callout */}
        <div className="p-4 bg-red-50/50 border-l-4 border-[#C8102E] rounded-r mb-8 text-sm text-[#111111] leading-relaxed">
          <span className="font-semibold text-[#8F0B20] block mb-1">Executive Summary</span>
          {announcement.summary}
        </div>

        {/* Full Content */}
        <div className="prose prose-sm max-w-none text-[#111111] leading-relaxed space-y-4 text-sm border-t border-[#E3E3E3] pt-6">
          <p>{announcement.content}</p>
          <p className="text-[#6B6B6B]">
            For questions or further operational clarification regarding this announcement, please contact the author directly or post in the corresponding Teams channel.
          </p>
        </div>

        {/* Footer info */}
        <div className="mt-8 pt-6 border-t border-[#E3E3E3] flex flex-col sm:flex-row sm:items-center justify-between text-xs text-[#6B6B6B] gap-2">
          <div>
            Department Reference ID: <span className="font-mono text-[#111111]">{announcement.id}</span>
          </div>
          <div className="text-[#6B6B6B]">
            Official corporate communication for Engineering & Technology
          </div>
        </div>
      </article>
    </div>
  );
};
