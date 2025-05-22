export interface AiProjectMetrics {
  id?: number;
  project_id: string;
  risk_score?: number;
  risk_level?: 'low' | 'medium' | 'high';
  delayed_tasks_count?: number;
  total_tasks_count?: number;
  completion_percentage?: number;
  created_at?: Date;
  updated_at?: Date;
}