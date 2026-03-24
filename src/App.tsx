import { useState } from 'react';
import { useCollaboration } from './context/CollaborationContext';
import { KanbanBoard } from './components/KanbanBoard';
import { ListView } from './components/ListView';
import { TimelineView } from './components/TimelineView';
import { FilterBar } from './components/FilterBar';

type ViewMode = 'Kanban' | 'List' | 'Timeline';

export default function App() {
  const { users } = useCollaboration();
  const [activeView, setActiveView] = useState<ViewMode>('Kanban');
  const activeUsers = users.filter(u => u.taskId !== null);

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-gray-900 font-sans flex flex-col">
      {/* Premium Minimal Header */}
      {/* z-50 ensures the header aggressively stays above any tooltips or timeline graph components when the outer container scrolls */}
      <header className="bg-white px-6 py-4 border-b border-gray-200/80 flex flex-col sm:flex-row justify-between items-center gap-4 shrink-0 z-50 sticky top-0 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-gray-800 to-black shadow-[0_2px_4px_rgba(0,0,0,0.1)] flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
          </div>
          <h1 className="text-[17px] font-semibold tracking-tight text-gray-900">
            Velozity Workspace
          </h1>
          
          {activeUsers.length > 0 && (
            <div className="hidden md:flex ml-6 items-center gap-2 border-l border-gray-200 pl-6 animate-pop-in">
              <div className="flex -space-x-1.5">
                {activeUsers.map((u, i) => (
                  <div key={u.id} style={{ zIndex: 10 - i }} className={`w-5 h-5 flex items-center justify-center rounded-full text-[9px] font-bold text-white border-2 border-white ring-1 ring-black/5 ${u.color}`} title={u.name}>
                    {u.name[0]}
                  </div>
                ))}
              </div>
              <span className="text-xs font-medium text-gray-500">
                {activeUsers.length} viewing
              </span>
            </div>
          )}
        </div>

        {/* Segmented Control */}
        <div className="bg-gray-100/80 p-1 rounded-md flex items-center shadow-inner border border-black/5">
          {(['Kanban', 'List', 'Timeline'] as ViewMode[]).map(view => (
             <button
                key={view}
                onClick={() => setActiveView(view)}
                className={`px-4 py-1.5 text-[13px] font-medium rounded transition-all duration-200 ${
                  activeView === view 
                    ? 'bg-white text-gray-900 shadow-[0_1px_3px_rgba(0,0,0,0.1)] ring-1 ring-black/5' 
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200/50'
                }`}
             >
                {view}
             </button>
          ))}
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-[calc(100vh-73px)] w-full">
        <FilterBar />
        <main className="flex-1 overflow-hidden p-6 pt-0 flex flex-col">
          {activeView === 'Kanban' && <KanbanBoard />}
          {activeView === 'List' && <ListView />}
          {activeView === 'Timeline' && <TimelineView />}
        </main>
      </div>
    </div>
  );
}