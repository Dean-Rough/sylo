export interface Project {
  id: string; // uuid
  user_id: string; // uuid
  title: string;
  description: string;
  status: 'active' | 'completed' | 'archived';
  created_at: Date;
  updated_at: Date;
}