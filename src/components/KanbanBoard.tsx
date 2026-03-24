import { useState } from 'react';
import { useTaskContext } from '../context/TaskContext';
import { useCollaboration } from '../context/CollaborationContext';
import { TaskCard } from './TaskCard';
import type { Status } from '../types';

const columns: Status[] = ['To Do', 'In Progress', 'In Review', 'Done'];

export function KanbanBoard() {
  const { filteredTasks, dispatch } = useTaskContext();
  const { getUserCountsByTask } = useCollaboration();
  const userMap = getUserCountsByTask();
  const [draggingCardId, setDraggingCardId] = useState<string | null>(null);
  const [hoveredColumn, setHoveredColumn] = useState<Status | null>(null);

  // Lighthouse Performance Fix: Restrict initial DOM node rendering to prevent vast TBT (Total Blocking Time) penalties
  const [limits, setLimits] = useState<Record<Status, number>>({
    'To Do': 20, 'In Progress': 20, 'In Review': 20, 'Done': 20
  });
  const loadMore = (col: Status) => setLimits(prev => ({ ...prev, [col]: prev[col] + 20 }));

  const handleDragStart = (_e: React.DragEvent, id: string) => {
    setTimeout(() => setDraggingCardId(id), 0);
  };
  const handleDragEnd = () => {
    setDraggingCardId(null);
    setHoveredColumn(null);
  };
  const handleDragOver = (e: React.DragEvent, col: Status) => {
    e.preventDefault();
    if (hoveredColumn !== col) setHoveredColumn(col);
  };
  const handleDrop = (e: React.DragEvent, col: Status) => {
    e.preventDefault();
    if (draggingCardId) dispatch({ type: 'MOVE_TASK', payload: { taskId: draggingCardId, newStatus: col } });
    setDraggingCardId(null);
    setHoveredColumn(null);
  };

  return (
    <div className="flex gap-4 overflow-x-auto h-full items-start">
      {columns.map(colName => {
        const columnTasks = filteredTasks.filter(t => t.status === colName);
        return (
          <div 
            key={colName}
            className={`flex-1 min-w-[300px] max-w-[350px] bg-[#F7F8F9] rounded-lg flex flex-col transition-colors duration-200 h-full border border-gray-200/60 shadow-[inset_0_1px_3px_rgba(0,0,0,0.01)]
              ${hoveredColumn === colName ? 'bg-[#F0F2F4] border-gray-300 ring-1 ring-gray-200' : ''}
            `}
            onDragOver={(e) => handleDragOver(e, colName)}
            onDrop={(e) => handleDrop(e, colName)}
           >
            {/* Header */}
            <div className="px-4 py-3 flex justify-between items-center border-b border-gray-200/40">
              <h3 className="font-semibold text-gray-800 text-[13px]">{colName}</h3>
              <span className="text-gray-400 text-[11px] font-semibold bg-white px-2 py-0.5 rounded shadow-sm border border-gray-100">{columnTasks.length}</span>
            </div>
            
            {/* Tasks Container */}
            <div className="p-3 flex-1 overflow-y-auto">
              {columnTasks.length === 0 ? (
                <div className="h-20 flex items-center justify-center text-gray-400 text-xs border border-dashed border-gray-300 rounded-md bg-white/50">
                  Drop tasks here
                </div>
              ) : (
                <>
                  {columnTasks.slice(0, limits[colName]).map(task => (
                    <TaskCard 
                      key={task.id} 
                      task={task} 
                      activeUsers={userMap[task.id] || []}
                      isDragging={task.id === draggingCardId}
                      onDragStart={handleDragStart}
                      onDragEnd={handleDragEnd}
                    />
                  ))}
                  {columnTasks.length > limits[colName] && (
                    <button 
                      onClick={() => loadMore(colName)}
                      className="w-full py-2 mt-1 mb-2 text-[11px] font-bold text-gray-500 bg-white border border-gray-200 hover:bg-gray-50 rounded-lg shadow-sm transition-all"
                    >
                      Load More ({columnTasks.length - limits[colName]})
                    </button>
                  )}
                </>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
