export interface Task {
  id: string; // uuid
  project_id: string; // uuid, reference to projects table
  title: string;
  description: string;
  status: 'todo' | 'in_progress' | 'review' | 'completed' | 'blocked';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  assigned_to: string | null; // uuid, reference to users table
  deadline: Date | null;
  created_at: Date;
  updated_at: Date;
  dependencies: TaskDependency[];

  // New AI Task Manager specific fields
  ai_risk_score?: number; // 0-100 indicating task completion risk
  ai_priority_boost?: number; // Dynamic priority adjustment
  ai_estimated_completion_time?: number; // In hours
  ai_scheduling_notes?: string; // AI-generated scheduling insights
}

export interface TaskDependency {
  id: string;
  type: 'blocker' | 'related' | 'predecessor';
  description?: string;
}