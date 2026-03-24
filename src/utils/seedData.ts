import type { Task, Priority, Status } from '../types';

const assignees = ['JD', 'AS', 'MR', 'SK', 'PL', 'EW'];
const priorities: Priority[] = ['Low', 'Medium', 'High', 'Critical'];
const statuses: Status[] = ['To Do', 'In Progress', 'In Review', 'Done'];

const randomItem = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

export const generateSeedData = (count: number = 500): Task[] => {
  const tasks: Task[] = [];
  const today = new Date();

  for (let i = 0; i < count; i++) {
    // Random dueDate between -10 days (overdue) to +20 days
    const daysOffsetDue = Math.floor(Math.random() * 30) - 10; 
    const dueDate = new Date(today);
    dueDate.setDate(today.getDate() + daysOffsetDue);
    
    // We want 10% chance to have NO start date (as per edge case in instructions)
    let startDate: string | null = null;
    if (Math.random() > 0.1) {
      // Start date is anytime from 1 to 5 days before the due date
      const startOffset = Math.floor(Math.random() * 5) + 1;
      const start = new Date(dueDate);
      start.setDate(dueDate.getDate() - startOffset);
      startDate = start.toISOString().split('T')[0];
    }

    tasks.push({
      id: `task-${i + 1}`,
      title: `Project Task ${i + 1}`,
      assignee: randomItem(assignees),
      priority: randomItem(priorities),
      status: randomItem(statuses),
      startDate,
      dueDate: dueDate.toISOString().split('T')[0]
    });
  }
  return tasks;
};
