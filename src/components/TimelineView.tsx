import { useMemo } from 'react';
import { useTaskContext } from '../context/TaskContext';

export function TimelineView() {
  const { filteredTasks } = useTaskContext();
  const today = new Date();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const currentDay = today.getDate(); 

  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const dayWidth = 50; 
  const rowHeight = 36; 
  const headerHeight = 44;

  const timelineTasks = useMemo(() => {
    return filteredTasks.filter(task => {
      const taskStart = new Date(task.startDate || task.dueDate);
      const taskEnd = new Date(task.dueDate);
      const monthStart = new Date(currentYear, currentMonth, 1);
      const monthEnd = new Date(currentYear, currentMonth, daysInMonth, 23, 59, 59);
      return taskStart <= monthEnd && taskEnd >= monthStart;
    });
  }, [filteredTasks, currentMonth, currentYear, daysInMonth]);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Critical': return 'bg-red-500';
      case 'High': return 'bg-orange-500';
      case 'Medium': return 'bg-amber-400 text-amber-900 border-amber-300';
      default: return 'bg-emerald-500';
    }
  };

  return (
    <div className="w-full h-full overflow-auto border border-gray-200 rounded-lg bg-[#FAFAFA] relative shadow-[inset_0_1px_3px_rgba(0,0,0,0.01)]">
      <div style={{ width: `${daysInMonth * dayWidth}px`, height: `${headerHeight + timelineTasks.length * rowHeight + 20}px` }} className="relative bg-white">
        
        {days.map(day => (
          <div key={day} className={`absolute top-0 bottom-0 border-r border-gray-100 ${day === currentDay ? 'bg-indigo-50/20' : ''}`} style={{ left: `${(day - 1) * dayWidth}px`, width: `${dayWidth}px` }}>
            <div className={`h-[44px] border-b ${day === currentDay ? 'border-indigo-200 bg-indigo-50/50' : 'border-gray-200 bg-white/80'} backdrop-blur-md flex flex-col items-center justify-center text-gray-500 z-10 sticky top-0`}>
               <span className="text-[9px] uppercase font-semibold text-gray-400">{new Date(currentYear, currentMonth, day).toLocaleDateString('en-US', { weekday: 'short' })}</span>
               <span className={`text-[12px] ${day === currentDay ? 'text-indigo-600 font-bold' : 'text-gray-700 font-semibold'}`}>{day}</span>
            </div>
          </div>
        ))}

        <div className="absolute top-[44px] bottom-0 w-px bg-indigo-300/60 z-10" style={{ left: `${(currentDay - 1) * dayWidth + (dayWidth / 2)}px` }} />

        <div className="absolute left-0 right-0" style={{ top: `${headerHeight + 6}px` }}>
          {timelineTasks.map((task, index) => {
            const tStart = new Date(task.startDate || task.dueDate);
            const tEnd = new Date(task.dueDate);
            const monthStart = new Date(currentYear, currentMonth, 1).getTime();
            const monthEnd = new Date(currentYear, currentMonth, daysInMonth, 23, 59, 59).getTime();
            const startMs = Math.max(monthStart, tStart.getTime());
            const endMs = Math.min(monthEnd, tEnd.getTime());
            const startDayFraction = (startMs - monthStart) / (1000 * 60 * 60 * 24);
            const durationDays = Math.max(0.6, (endMs - startMs) / (1000 * 60 * 60 * 24) + 1);

            return (
              <div 
                key={task.id}
                className={`absolute h-[24px] rounded-[4px] shadow-sm text-white transition-all hover:brightness-110 cursor-pointer z-20 border border-white/20 ${getPriorityColor(task.priority)}`}
                style={{ top: `${index * rowHeight}px`, left: `${startDayFraction * dayWidth + 2}px`, width: `${durationDays * dayWidth - 4}px` }}
              >
                <div className="flex items-center h-full px-1.5 text-[10px] font-medium whitespace-nowrap w-max drop-shadow-sm">
                  {!task.startDate && <span className="mr-1 text-[9px] opacity-90 drop-shadow-none">📍</span>}
                  <span>{task.title}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
