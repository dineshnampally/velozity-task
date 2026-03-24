import { memo } from 'react';
import type { Task } from '../types';
import { formatDueDate, isOverdue } from '../utils/dateUtils';

interface TaskCardProps {
  task: Task;
  activeUsers: any[];
  isDragging: boolean;
  onDragStart: (e: any, id: string) => void;
  onDragEnd: (e: any) => void;
}

const getPriorityStyles = (priority: string) => {
  switch(priority) {
    case 'Critical': return 'bg-red-50 text-red-700 border-red-100';
    case 'High': return 'bg-orange-50 text-orange-700 border-orange-100';
    case 'Medium': return 'bg-amber-50 text-amber-700 border-amber-100';
    default: return 'bg-emerald-50 text-emerald-700 border-emerald-100';
  }
};

export const TaskCard = memo(function TaskCard({ task, activeUsers, isDragging, onDragStart, onDragEnd }: TaskCardProps) {
  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, task.id)}
      onDragEnd={onDragEnd}
      aria-label={`Task: ${task.title}`}
      className={`bg-white p-3.5 rounded-lg border border-gray-200 cursor-grab active:cursor-grabbing mb-3 group flex flex-col hover:border-gray-300 transition-all
        ${isDragging ? 'opacity-50 !border-dashed !shadow-none' : 'shadow-[0_1px_2px_rgba(0,0,0,0.02)] hover:shadow-sm'}
      `}
    >
      <div className="flex justify-between items-start mb-3 gap-2">
        <h4 className="font-medium text-gray-700 text-[13px] leading-snug tracking-tight">{task.title}</h4>
        
        <div className="flex -space-x-1 shrink-0 mt-0.5">
          {activeUsers && activeUsers.length > 0 ? (
            activeUsers.slice(0, 2).map((u: any, i: number) => (
               <div key={u.id} style={{ zIndex: 10 - i }} className={`w-5 h-5 rounded-full border border-white flex items-center justify-center text-[9px] font-bold text-white shadow-sm animate-pop-in ${u.color}`} title={u.name}>{u.name[0]}</div>
            ))
          ) : (
             <span className="w-5 h-5 rounded-full bg-gray-100 text-gray-500 border border-white ring-1 ring-black/5 flex items-center justify-center text-[9px] font-semibold" title={`Assigned to ${task.assignee}`}>{task.assignee}</span>
          )}
        </div>
      </div>
      
      <div className="flex justify-between items-end mt-auto">
        <span className={`px-2 py-0.5 rounded text-[10px] font-medium border ${getPriorityStyles(task.priority)}`}>
          {task.priority}
        </span>
        
        <span className={`flex items-center gap-1 text-[11px] font-medium ${isOverdue(task.dueDate) ? 'text-red-500' : 'text-gray-400'}`}>
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
          {formatDueDate(task.dueDate)}
        </span>
      </div>
    </div>
  );
});
