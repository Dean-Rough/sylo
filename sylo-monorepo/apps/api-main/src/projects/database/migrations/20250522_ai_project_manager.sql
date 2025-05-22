-- AI Project Manager Database Migration
-- Date: 2025-05-22

-- Extend tasks table with AI-related columns
ALTER TABLE tasks 
ADD COLUMN ai_risk_score NUMERIC(5,2),
ADD COLUMN ai_priority_boost NUMERIC(5,2),
ADD COLUMN ai_estimated_completion_time INTERVAL,
ADD COLUMN ai_scheduling_notes TEXT,
ADD COLUMN actual_completion_time TIMESTAMP WITH TIME ZONE,
ADD COLUMN status_history JSONB;

-- Create ai_project_metrics table
CREATE TABLE ai_project_metrics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    overall_health_score NUMERIC(5,2),
    risk_level VARCHAR(50),
    predicted_completion_date DATE,
    delay_probability NUMERIC(5,2),
    critical_path_tasks JSONB,
    bottleneck_resources JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create index for ai_project_metrics
CREATE INDEX idx_ai_project_metrics_project_id ON ai_project_metrics(project_id);
CREATE INDEX idx_ai_project_metrics_created_at ON ai_project_metrics(created_at);

-- Create ai_task_predictions table
CREATE TABLE ai_task_predictions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    task_id UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
    risk_score NUMERIC(5,2),
    predicted_completion_date DATE,
    confidence_level NUMERIC(5,2),
    risk_factors JSONB,
    suggested_actions JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create index for ai_task_predictions
CREATE INDEX idx_ai_task_predictions_task_id ON ai_task_predictions(task_id);
CREATE INDEX idx_ai_task_predictions_created_at ON ai_task_predictions(created_at);

-- Create team_workload table
CREATE TABLE team_workload (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    week_starting DATE NOT NULL,
    allocated_hours NUMERIC(6,2),
    capacity_hours NUMERIC(6,2),
    overallocation_risk NUMERIC(5,2),
    task_distribution JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (user_id, week_starting)
);

-- Create index for team_workload
CREATE INDEX idx_team_workload_user_id ON team_workload(user_id);
CREATE INDEX idx_team_workload_week_starting ON team_workload(week_starting);

-- Trigger to update updated_at timestamps
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_ai_project_metrics_modtime
BEFORE UPDATE ON ai_project_metrics
FOR EACH ROW
EXECUTE FUNCTION update_modified_column();

CREATE TRIGGER update_ai_task_predictions_modtime
BEFORE UPDATE ON ai_task_predictions
FOR EACH ROW
EXECUTE FUNCTION update_modified_column();

CREATE TRIGGER update_team_workload_modtime
BEFORE UPDATE ON team_workload
FOR EACH ROW
EXECUTE FUNCTION update_modified_column();