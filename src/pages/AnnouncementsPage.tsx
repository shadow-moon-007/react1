import React, { useState, useEffect } from 'react';
import { Bell, Search, Filter } from 'lucide-react';
import { intranetService } from '../services/intranetService';
import { Announcement } from '../types';
import { Breadcrumbs } from '../components/ui/Breadcrumbs';
import { AnnouncementCard } from '../components/content/AnnouncementCard';

export const AnnouncementsPage: React.FC = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [activeAudience, setActiveAudience] = useState<string>('All');
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      const anns = await intranetService.getAnnouncements();
      setAnnouncements(anns);
    };
    fetchData();
    const unsubscribe = intranetService.subscribe(fetchData);
    return () => unsubscribe();
  }, []);

  const audiences = [
    'All',
    'Entire GBS',
    'GBS-BTS',
    'GPS-BO',
  ];

  const categories = [
    'All',
    'Operations',
    'Transformation',
    'Strategic',
    'Process Excellence',
    'Systems & Tools',
    'People & Culture',
  ];

  const filteredAnnouncements = announcements.filter((a) => {
    const matchesAudience =
      activeAudience === 'All' ||
      a.audience === activeAudience ||
      (activeAudience !== 'Entire GBS' && a.audience === 'Entire GBS');

    const matchesCategory =
      activeCategory === 'All' || a.category === activeCategory;

    const matchesSearch =
      !searchQuery ||
      a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.content.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesAudience && matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <Breadcrumbs items={[{ label: 'GBS Announcements' }]} />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#8F0B20] uppercase tracking-wider mb-1">
            <Bell className="w-4 h-4 text-[#C8102E]" />
            <span>GBS Communications</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#111111] tracking-tight">
            GBS Announcements & Bulletins
          </h1>
          <p className="text-sm text-[#6B6B6B] mt-1">
            Official department notices, global town halls, automation releases, and operational SOP recertification updates.
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-[#6B6B6B]" />
          <input
            type="text"
            placeholder="Search bulletins..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs text-[#111111] bg-white border border-[#E3E3E3] rounded focus-visible:outline-none focus-visible:border-[#C8102E]"
          />
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="space-y-3">
        {/* Audience filter */}
        <div>
          <div className="text-[11px] font-semibold text-[#6B6B6B] uppercase tracking-wider mb-1.5">
            Target Audience
          </div>
          <div className="flex flex-wrap items-center gap-1.5">
            {audiences.map((aud) => (
              <button
                key={aud}
                onClick={() => setActiveAudience(aud)}
                className={`px-3 py-1.5 text-xs font-medium rounded transition-colors ${
                  activeAudience === aud
                    ? 'bg-[#111111] text-white'
                    : 'bg-white border border-[#E3E3E3] text-[#6B6B6B] hover:text-[#111111] hover:bg-[#F6F6F6]'
                }`}
              >
                {aud}
              </button>
            ))}
          </div>
        </div>

        {/* Category filter */}
        <div>
          <div className="text-[11px] font-semibold text-[#6B6B6B] uppercase tracking-wider mb-1.5">
            Category
          </div>
          <div className="flex flex-wrap items-center gap-1.5">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1 text-xs font-medium rounded transition-colors ${
                  activeCategory === cat
                    ? 'bg-[#C8102E] text-white'
                    : 'bg-white border border-[#E3E3E3] text-[#6B6B6B] hover:text-[#111111] hover:bg-[#F6F6F6]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* List */}
      {filteredAnnouncements.length === 0 ? (
        <div className="bg-white border border-[#E3E3E3] rounded-md p-12 text-center text-sm text-[#6B6B6B]">
          No announcements match your selected filters.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredAnnouncements.map((ann, idx) => (
            <AnnouncementCard
              key={ann.id}
              announcement={ann}
              featured={idx === 0 && activeAudience === 'All' && activeCategory === 'All'}
            />
          ))}
        </div>
      )}
    </div>
  );
};
