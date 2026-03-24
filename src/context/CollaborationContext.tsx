import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { useTaskContext } from './TaskContext';

type CollabUser = {
  id: string;
  name: string;
  color: string;
  taskId: string | null;
};

// Creating exactly 3 fake active users!
const MOCK_USERS: CollabUser[] = [
  { id: 'u1', name: 'Alex', color: 'bg-red-500' },
  { id: 'u2', name: 'Sam', color: 'bg-blue-500' },
  { id: 'u3', name: 'Taylor', color: 'bg-emerald-500' },
].map(u => ({ ...u, taskId: null as string | null }));

interface CollaborationState {
  users: CollabUser[];
  getUserCountsByTask: () => Record<string, CollabUser[]>;
}

const CollaborationContext = createContext<CollaborationState | undefined>(undefined);

export const CollaborationProvider = ({ children }: { children: ReactNode }) => {
  const { filteredTasks } = useTaskContext();
  const [users, setUsers] = useState<CollabUser[]>(MOCK_USERS);

  // Set users purely ONCE natively so the main thread isn't jittering rapidly! 
  useEffect(() => {
    if (filteredTasks.length === 0) return;

    setUsers(prevUsers => {
      return prevUsers.map(u => ({
        ...u,
        taskId: filteredTasks[Math.floor(Math.random() * filteredTasks.length)].id
      }));
    }); // Done! Extremely fast!
  }, []); // Run solely on load

  // A helper function so cards can instantly check "is anyone viewing me?"
  const getUserCountsByTask = () => {
    const map: Record<string, CollabUser[]> = {};
    users.forEach(u => {
      if (u.taskId) {
        if (!map[u.taskId]) map[u.taskId] = [];
        map[u.taskId].push(u);
      }
    });
    return map;
  };

  return (
    <CollaborationContext.Provider value={{ users, getUserCountsByTask }}>
      {children}
    </CollaborationContext.Provider>
  );
};

export const useCollaboration = () => {
  const context = useContext(CollaborationContext);
  if (!context) throw new Error("useCollaboration must be used within a CollaborationProvider");
  return context;
};
