import React, { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, User, Check, Plus } from 'lucide-react';
import { intranetService } from '../services/intranetService';
import { DepartmentEvent } from '../types';
import { Breadcrumbs } from '../components/ui/Breadcrumbs';
import { Button } from '../components/ui/Button';

export const EventsPage: React.FC = () => {
  const [events, setEvents] = useState<DepartmentEvent[]>([]);
  const [addedEvents, setAddedEvents] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const fetchData = async () => {
      const evts = await intranetService.getEvents();
      setEvents(evts);
    };
    fetchData();
  }, []);

  const handleAddToCalendar = (id: string) => {
    setAddedEvents((prev) => ({ ...prev, [id]: true }));
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <Breadcrumbs items={[{ label: 'GBS Events & Town Halls' }]} />

      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-semibold text-[#8F0B20] uppercase tracking-wider mb-1">
          <Calendar className="w-4 h-4 text-[#C8102E]" />
          <span>GBS Department Calendar</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#111111] tracking-tight">
          GBS Events, Town Halls &amp; Learning Sessions
        </h1>
        <p className="text-sm text-[#6B6B6B] mt-1">
          Global town halls, automation showcase demos, Lean Six Sigma Kaizen spotlight sessions, and GBS Academy project kickoffs.
        </p>
      </div>

      {/* Event list */}
      <div className="space-y-4">
        {events.map((evt) => {
          const isAdded = !!addedEvents[evt.id];

          return (
            <div
              key={evt.id}
              className="bg-white border border-[#E3E3E3] rounded-md p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-[#111111] transition-all"
            >
              <div className="space-y-2 max-w-2xl">
                <div className="flex items-center gap-2 text-xs text-[#6B6B6B]">
                  <span className="font-semibold text-[#8F0B20]">{evt.type}</span>
                  <span aria-hidden="true">·</span>
                  <span>Organized by {evt.organizer}</span>
                </div>

                <h3 className="text-lg font-bold text-[#111111]">{evt.title}</h3>

                <p className="text-xs text-[#6B6B6B] leading-relaxed">
                  {evt.description}
                </p>

                <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-xs text-[#111111] pt-1">
                  <div className="flex items-center gap-1.5 font-medium">
                    <Calendar className="w-3.5 h-3.5 text-[#C8102E]" />
                    <span>{evt.date}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[#6B6B6B]">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{evt.time}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[#6B6B6B]">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>{evt.location}</span>
                  </div>
                </div>
              </div>

              <div className="shrink-0 flex sm:flex-col items-center sm:items-end justify-between gap-2">
                <Button
                  size="sm"
                  variant={isAdded ? 'outline' : 'primary'}
                  onClick={() => handleAddToCalendar(evt.id)}
                  disabled={isAdded}
                >
                  {isAdded ? (
                    <>
                      <Check className="w-3.5 h-3.5 mr-1 text-emerald-600" />
                      <span>Added to Outlook</span>
                    </>
                  ) : (
                    <>
                      <Plus className="w-3.5 h-3.5 mr-1" />
                      <span>Add to Calendar</span>
                    </>
                  )}
                </Button>
                <span className="text-[11px] text-[#6B6B6B]">Teams broadcast link</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
