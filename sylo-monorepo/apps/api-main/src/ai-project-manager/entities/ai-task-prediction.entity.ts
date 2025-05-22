export interface AiTaskPrediction {
  id?: number;
  task_id: string;
  project_id: string;
  original_estimate?: number;
  predicted_delay?: number;
  complexity_factor?: number;
  risk_score?: number;
  created_at?: Date;
  updated_at?: Date;
}