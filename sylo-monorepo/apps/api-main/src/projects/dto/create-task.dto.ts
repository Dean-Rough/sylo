import { 
  IsNotEmpty, 
  IsString, 
  IsOptional, 
  IsEnum, 
  IsUUID, 
  IsDateString,
  IsNumber,
  Min,
  Max
} from 'class-validator';

export class CreateTaskDto {
  @IsNotEmpty()
  @IsUUID()
  project_id: string;

  @IsNotEmpty()
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsEnum(['todo', 'in_progress', 'review', 'completed', 'blocked'], {
    message: 'Status must be one of: todo, in_progress, review, completed, blocked',
  })
  status?: 'todo' | 'in_progress' | 'review' | 'completed' | 'blocked' = 'todo';

  @IsOptional()
  @IsEnum(['low', 'medium', 'high', 'urgent'], {
    message: 'Priority must be one of: low, medium, high, urgent',
  })
  priority?: 'low' | 'medium' | 'high' | 'urgent' = 'medium';

  @IsOptional()
  @IsUUID()
  assigned_to?: string;

  @IsOptional()
  @IsDateString()
  deadline?: string;

  // New AI Task Manager specific fields
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  ai_risk_score?: number;

  @IsOptional()
  @IsNumber()
  ai_priority_boost?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  ai_estimated_completion_time?: number;

  @IsOptional()
  @IsString()
  ai_scheduling_notes?: string;
}