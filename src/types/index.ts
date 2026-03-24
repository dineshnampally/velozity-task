export type Priority = 'Low' | 'Medium' | 'High' | 'Critical';
export type Status = 'To Do' | 'In Progress' | 'In Review' | 'Done';

export interface Task {
  id: string;
  title: string;
  assignee: string; // Using simple initials like 'JD', 'AS'
  priority: Priority;
  status: Status;
  startDate: string | null; // null for the edge case where start date is missing
  dueDate: string;
}
