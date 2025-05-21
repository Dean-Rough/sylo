export interface Task {
  id: string; // uuid
  project_id: string; // uuid, reference to projects table
  title: string;
  description: string;
  status: 'todo' | 'in_progress' | 'review' | 'completed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  assigned_to: string | null; // uuid, reference to users table
  deadline: Date | null;
  created_at: Date;
  updated_at: Date;
}