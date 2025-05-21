export interface TaskDependency {
  id: string; // uuid
  task_id: string; // uuid, reference to tasks table
  depends_on_task_id: string; // uuid, reference to tasks table
  created_at: Date;
}