export interface TeamWorkload {
  id?: number;
  team_id: string;
  total_projects?: number;
  active_projects?: number;
  total_tasks?: number;
  completed_tasks?: number;
  workload_percentage?: number;
  created_at?: Date;
  updated_at?: Date;
}