import React, { useState, useEffect, useMemo } from 'react';
import {
  CalendarSystemKey,
  MainViewType,
  UnifiedDayInfo,
  UserCustomEvent,
} from './types/calendar';
import {
  getSixWeekMonthGrid,
  getWeekGrid,
  getUnifiedDayInfo,
} from './services/calendarEngine';
import {
  getSavedFirebaseConfig,
  loadUserCustomEvents,
  saveUserEvent,
  deleteUserEvent,
} from './services/firebase';
import { Header } from './components/Header';
import { FilterBar } from './components/FilterBar';
import { GregorianMonthView } from './components/GregorianMonthView';
import { WeekView } from './components/WeekView';
import { YearView } from './components/YearView';
import { EsseneCalendarView } from './components/EsseneCalendarView';
import { MayaHaabView } from './components/MayaHaabView';
import { CelticCalendarView } from './components/CelticCalendarView';
import { AstroCalendarView } from './components/AstroCalendarView';
import { DayDetailModal } from './components/DayDetailModal';
import { FirebaseSyncModal } from './components/FirebaseSyncModal';
import { CalendarGuideModal } from './components/CalendarGuideModal';

export const App: React.FC = () => {
  // Current active date (starts today: Oct 12, 2026)
  const [currentDate, setCurrentDate] = useState<Date>(() => new Date(2026, 9, 12));

  // Active view
  const [activeView, setActiveView] = useState<MainViewType>('month');

  // Filter states for all 6 calendar systems
  const [activeFilters, setActiveFilters] = useState<Record<CalendarSystemKey, boolean>>({
    gregorian: true,
    essene: true,
    maya_tzolkin: true,
    haab: true,
    celtic: true,
    astronomical: true,
  });

  // User notes & custom events
  const [userEvents, setUserEvents] = useState<UserCustomEvent[]>([]);

  // Selected day for the detailed modal
  const [selectedDay, setSelectedDay] = useState<UnifiedDayInfo | null>(null);

  // Modals visibility
  const [isFirebaseModalOpen, setIsFirebaseModalOpen] = useState(false);
  const [isGuideModalOpen, setIsGuideModalOpen] = useState(false);

  // Firebase status
  const [isFirebaseConfigured, setIsFirebaseConfigured] = useState(false);

  // Load custom events & check Firebase config on mount
  useEffect(() => {
    const config = getSavedFirebaseConfig();
    setIsFirebaseConfigured(!!(config && config.apiKey && config.projectId));

    loadUserCustomEvents().then((events) => {
      setUserEvents(events);
    });
  }, []);

  const handleConfigChanged = () => {
    const config = getSavedFirebaseConfig();
    setIsFirebaseConfigured(!!(config && config.apiKey && config.projectId));
    loadUserCustomEvents().then((events) => {
      setUserEvents(events);
    });
  };

  // Filter actions
  const handleToggleFilter = (key: CalendarSystemKey) => {
    setActiveFilters((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleSelectAll = () => {
    setActiveFilters({
      gregorian: true,
      essene: true,
      maya_tzolkin: true,
      haab: true,
      celtic: true,
      astronomical: true,
    });
  };

  const handleClearAll = () => {
    setActiveFilters({
      gregorian: false,
      essene: false,
      maya_tzolkin: false,
      haab: false,
      celtic: false,
      astronomical: false,
    });
  };

  // User event handlers
  const handleAddUserEvent = async (event: UserCustomEvent) => {
    await saveUserEvent(event);
    setUserEvents((prev) => [...prev, event]);
  };

  const handleDeleteUserEvent = async (id: string) => {
    await deleteUserEvent(id);
    setUserEvents((prev) => prev.filter((e) => e.id !== id));
  };

  // 6-week month days calculation (42 cells: 7 columns x 6 rows)
  const monthDays = useMemo(() => {
    return getSixWeekMonthGrid(currentDate.getFullYear(), currentDate.getMonth());
  }, [currentDate]);

  // Week days calculation (7 days)
  const weekDays = useMemo(() => {
    return getWeekGrid(currentDate);
  }, [currentDate]);

  // Compute event counts for filter chips in the current month
  const eventCounts = useMemo(() => {
    const counts: Record<CalendarSystemKey, number> = {
      gregorian: 0,
      essene: 0,
      maya_tzolkin: 0,
      haab: 0,
      celtic: 0,
      astronomical: 0,
    };

    monthDays.forEach((day) => {
      day.events.forEach((ev) => {
        counts[ev.calendar] = (counts[ev.calendar] || 0) + 1;
      });
    });

    return counts;
  }, [monthDays]);

  return (
    <div className="min-h-screen bg-[#070913] text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* Global Navigation Header */}
      <Header
        currentDate={currentDate}
        onChangeDate={setCurrentDate}
        activeView={activeView}
        onChangeView={setActiveView}
        onOpenFirebaseSync={() => setIsFirebaseModalOpen(true)}
        onOpenGuide={() => setIsGuideModalOpen(true)}
        isFirebaseConfigured={isFirebaseConfigured}
      />

      {/* Filter Bar for Calendar Systems */}
      <FilterBar
        activeFilters={activeFilters}
        onToggleFilter={handleToggleFilter}
        onSelectAll={handleSelectAll}
        onClearAll={handleClearAll}
        eventCounts={eventCounts}
      />

      {/* Main Content Workspace depending on Active View */}
      <main className="flex-1 py-4">
        {activeView === 'month' && (
          <GregorianMonthView
            days={monthDays}
            activeFilters={activeFilters}
            userEvents={userEvents}
            onSelectDay={setSelectedDay}
          />
        )}

        {activeView === 'week' && (
          <WeekView
            days={weekDays}
            activeFilters={activeFilters}
            userEvents={userEvents}
            onSelectDay={setSelectedDay}
          />
        )}

        {activeView === 'year' && (
          <YearView
            currentYear={currentDate.getFullYear()}
            onSelectMonth={(monthIdx) => {
              setCurrentDate(new Date(currentDate.getFullYear(), monthIdx, 1));
              setActiveView('month');
            }}
            onSelectDate={(d) => {
              setCurrentDate(d);
              setSelectedDay(getUnifiedDayInfo(d));
            }}
            activeFilters={activeFilters}
          />
        )}

        {activeView === 'essene' && (
          <EsseneCalendarView
            currentDate={currentDate}
            onSelectDay={setSelectedDay}
          />
        )}

        {activeView === 'maya' && (
          <MayaHaabView
            currentDate={currentDate}
            onSelectDay={setSelectedDay}
          />
        )}

        {activeView === 'celtic' && (
          <CelticCalendarView
            currentDate={currentDate}
            onSelectDay={setSelectedDay}
          />
        )}

        {activeView === 'astronomical' && (
          <AstroCalendarView
            currentDate={currentDate}
            onSelectDay={setSelectedDay}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/80 px-4 py-4 text-center text-xs text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>
            Universele Kalender • 100 jaar verleden & 30 jaar toekomst (1926 — 2056)
          </span>
          <span className="text-slate-400">
            Gregoriaans • Essenen (364d) • Maya Tzolk'in • Haab' • Keltisch Jaarwiel • Astronomische Lunaties
          </span>
        </div>
      </footer>

      {/* Day Detail Modal */}
      <DayDetailModal
        dayInfo={selectedDay}
        onClose={() => setSelectedDay(null)}
        userEvents={userEvents}
        onAddUserEvent={handleAddUserEvent}
        onDeleteUserEvent={handleDeleteUserEvent}
      />

      {/* Firebase Sync & Configuration Modal */}
      <FirebaseSyncModal
        isOpen={isFirebaseModalOpen}
        onClose={() => setIsFirebaseModalOpen(false)}
        onConfigChanged={handleConfigChanged}
      />

      {/* Calendar Guide & Knowledge Modal */}
      <CalendarGuideModal
        isOpen={isGuideModalOpen}
        onClose={() => setIsGuideModalOpen(false)}
      />
    </div>
  );
};

export default App;
