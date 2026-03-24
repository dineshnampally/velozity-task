import React, { createContext, useContext, useReducer, useMemo, type ReactNode } from 'react';
import { useSearchParams } from 'react-router-dom';
import type { Task, Status } from '../types';
import { generateSeedData } from '../utils/seedData';

export interface AppState {
  tasks: Task[];
}

export type Action = 
  | { type: 'MOVE_TASK'; payload: { taskId: string; newStatus: Status } }
  | { type: 'UPDATE_TASK'; payload: Task };

const initialState: AppState = {
  tasks: generateSeedData(500),
};

const appReducer = (state: AppState, action: Action): AppState => {
  switch (action.type) {
    case 'MOVE_TASK':
      return {
        ...state,
        tasks: state.tasks.map(t => 
          t.id === action.payload.taskId ? { ...t, status: action.payload.newStatus } : t
        )
      };
    case 'UPDATE_TASK':
      return {
        ...state,
        tasks: state.tasks.map(t => t.id === action.payload.id ? action.payload : t)
      };
    default:
      return state;
  }
};

interface ContextType {
  state: AppState;
  filteredTasks: Task[]; // Expose this globally!
  dispatch: React.Dispatch<Action>;
}

const TaskContext = createContext<ContextType | undefined>(undefined);

export const TaskProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);
  const [searchParams] = useSearchParams();

  // Compute the visible tasks centrally so we don't repeat the loop logic in every view
  const filteredTasks = useMemo(() => {
    // Grab all filters instantly from react-router-dom! Saves so much boilerplate!
    const status = searchParams.getAll('status');
    const priority = searchParams.getAll('priority');
    const assignee = searchParams.getAll('assignee');
    const dueDateFrom = searchParams.get('dueDateFrom');
    const dueDateTo = searchParams.get('dueDateTo');

    return state.tasks.filter(t => {
      if (status.length > 0 && !status.includes(t.status)) return false;
      if (priority.length > 0 && !priority.includes(t.priority)) return false;
      if (assignee.length > 0 && !assignee.includes(t.assignee)) return false;
      if (dueDateFrom && new Date(t.dueDate) < new Date(dueDateFrom)) return false;
      if (dueDateTo && new Date(t.dueDate) > new Date(dueDateTo)) return false;
      return true;
    });
  }, [state.tasks, searchParams]);

  return (
    <TaskContext.Provider value={{ state, filteredTasks, dispatch }}>
      {children}
    </TaskContext.Provider>
  );
};

export const useTaskContext = () => {
  const context = useContext(TaskContext);
  if (!context) throw new Error("useTaskContext must be used within a TaskProvider");
  return context;
};
