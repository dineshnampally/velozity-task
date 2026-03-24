export function formatDueDate(dateStr: string): string {
  const d = new Date(dateStr);
  const today = new Date();
  
  // Strip time for perfect strictly-day calculations
  today.setHours(0, 0, 0, 0);
  const dCopy = new Date(dateStr);
  dCopy.setHours(0, 0, 0, 0);

  const diffTime = today.getTime() - dCopy.getTime();
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24)); 

  // Assessment Rules: "Due Today" when current day = due day
  if (diffDays === 0) return 'Due Today';
  
  // Assessment Rules: Tasks overdue by > 7 days must show the number of days!
  if (diffDays > 7) return `${diffDays} days overdue`;
  
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export function isOverdue(dateStr: string): boolean {
  const d = new Date(dateStr);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  d.setHours(0, 0, 0, 0);
  return d.getTime() < today.getTime();
}
