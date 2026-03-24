import { useState, useMemo, useRef, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useTaskContext } from '../context/TaskContext';
import type { Status } from '../types';
import { formatDueDate, isOverdue } from '../utils/dateUtils';

type SortCol = 'title' | 'priority' | 'dueDate' | null;

export function ListView() {
  const { filteredTasks, dispatch } = useTaskContext();
  const [, setSearchParams] = useSearchParams();
  const [sortCol, setSortCol] = useState<SortCol>(null);
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  
  const [scrollTop, setScrollTop] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerHeight, setContainerHeight] = useState(600);

  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver(entries => {
      for (let entry of entries) {
        setContainerHeight(entry.contentRect.height);
      }
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  const sortedTasks = useMemo(() => {
    const sorted = [...filteredTasks];
    if (!sortCol) return sorted;
    sorted.sort((a, b) => {
      let valA: any = a[sortCol];
      let valB: any = b[sortCol];
      if (sortCol === 'priority') {
        const pValues = { Critical: 4, High: 3, Medium: 2, Low: 1 };
        valA = pValues[a.priority as keyof typeof pValues];
        valB = pValues[b.priority as keyof typeof pValues];
      } else if (sortCol === 'dueDate') {
        valA = new Date(a.dueDate).getTime();
        valB = new Date(b.dueDate).getTime();
      }
      if (valA < valB) return sortDir === 'asc' ? -1 : 1;
      if (valA > valB) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });
    return sorted;
  }, [filteredTasks, sortCol, sortDir]);

  const rowHeight = 49; 
  const visibleRowCount = Math.ceil(containerHeight / rowHeight); 
  const startIndex = Math.max(0, Math.floor(scrollTop / rowHeight) - 5); 
  const endIndex = Math.min(sortedTasks.length - 1, Math.floor(scrollTop / rowHeight) + visibleRowCount + 5);
  
  const visibleTasks = sortedTasks.slice(startIndex, endIndex + 1);
  const paddingTop = startIndex * rowHeight;
  const totalHeight = sortedTasks.length * rowHeight;

  if (filteredTasks.length === 0) {
    return (
      <div className="h-full w-full bg-white flex flex-col items-center justify-center border border-gray-200 rounded-lg">
        <svg className="w-12 h-12 text-gray-300 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
        <h3 className="text-[15px] font-medium text-gray-900 mb-1">No tasks matching filters</h3>
        <p className="text-gray-500 text-sm mb-4">Try adjusting your active filters.</p>
        <button onClick={() => setSearchParams(new URLSearchParams())} className="text-xs bg-gray-900 text-white px-4 py-2 rounded-md font-medium hover:bg-gray-800 transition">
          Clear all filters
        </button>
      </div>
    );
  }

  const getPriorityStyle = (priority: string) => {
    switch(priority) {
      case 'Critical': return 'bg-red-50 text-red-700 border-red-100';
      case 'High': return 'bg-orange-50 text-orange-700 border-orange-100';
      case 'Medium': return 'bg-amber-50 text-amber-700 border-amber-100';
      default: return 'bg-emerald-50 text-emerald-700 border-emerald-100';
    }
  };

  return (
    <div 
      ref={containerRef} 
      onScroll={(e) => setScrollTop(e.currentTarget.scrollTop)} 
      className="overflow-y-auto h-full w-full border border-gray-200 rounded-lg bg-white relative"
    >
      <div className="sticky top-0 z-20 flex w-full bg-slate-50 border-b border-gray-200 shadow-sm text-xs font-semibold text-gray-500 uppercase tracking-wider min-w-[700px]">
         <div className="w-[30%] p-3 cursor-pointer hover:bg-gray-100 flex items-center shrink-0" onClick={() => { setSortCol('title'); setSortDir(sortDir==='asc' ? 'desc' : 'asc'); }}>
           Title {sortCol === 'title' && (sortDir === 'asc' ? '↑' : '↓')}
         </div>
         <div className="w-[15%] p-3 text-center flex items-center justify-center shrink-0">Assignee</div>
         <div className="w-[15%] p-3 cursor-pointer hover:bg-gray-100 flex items-center justify-center shrink-0" onClick={() => { setSortCol('priority'); setSortDir(sortDir==='asc' ? 'desc' : 'asc'); }}>
           Priority {sortCol === 'priority' && (sortDir === 'asc' ? '↑' : '↓')}
         </div>
         <div className="w-[20%] p-3 text-center flex items-center justify-center shrink-0">Status</div>
         <div className="w-[20%] p-3 cursor-pointer hover:bg-gray-100 flex items-center justify-end text-right shrink-0" onClick={() => { setSortCol('dueDate'); setSortDir(sortDir==='asc' ? 'desc' : 'asc'); }}>
           Due Date {sortCol === 'dueDate' && (sortDir === 'asc' ? '↑' : '↓')}
         </div>
      </div>

      <div style={{ height: `${totalHeight}px`, position: 'relative', minWidth: '700px' }}>
         <div style={{ position: 'absolute', top: `${paddingTop}px`, left: 0, right: 0 }}>
            {visibleTasks.map(task => (
               <div key={task.id} className="flex border-b border-gray-100 hover:bg-gray-50/50 bg-white group items-center" style={{ height: `${rowHeight}px` }}>
                  <div className="w-[30%] p-3 font-medium text-gray-900 text-[13px] truncate shrink-0">{task.title}</div>
                  <div className="w-[15%] p-3 flex items-center justify-center shrink-0">
                     <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-gray-100 border border-gray-200 text-gray-600 text-[10px] font-semibold">{task.assignee}</span>
                  </div>
                  <div className="w-[15%] p-3 flex items-center justify-center shrink-0">
                     <span className={`px-2 py-0.5 rounded text-[11px] font-medium border ${getPriorityStyle(task.priority)}`}>{task.priority}</span>
                  </div>
                  <div className="w-[20%] p-3 flex items-center justify-center shrink-0">
                     <select 
                        value={task.status}
                        aria-label="Change task status"
                        onChange={(e) => dispatch({ type: 'MOVE_TASK', payload: { taskId: task.id, newStatus: e.target.value as Status } })}
                        className="bg-transparent font-medium border border-transparent hover:border-gray-200 hover:bg-white text-gray-700 text-[13px] rounded focus:ring-2 focus:ring-gray-800 outline-none cursor-pointer px-2 py-1 transition-all"
                     >
                        <option value="To Do">To Do</option>
                        <option value="In Progress">In Progress</option>
                        <option value="In Review">In Review</option>
                        <option value="Done">Done</option>
                     </select>
                  </div>
                  <div className={`w-[20%] p-3 text-right text-[13px] shrink-0 justify-end flex items-center ${isOverdue(task.dueDate) ? 'text-red-500 font-medium' : 'text-gray-500'}`}>
                     {formatDueDate(task.dueDate)}
                  </div>
               </div>
            ))}
         </div>
      </div>
    </div>
  );
}
