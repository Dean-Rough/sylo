import { IsNotEmpty, IsString, IsOptional, IsEnum, IsUUID, IsDateString } from 'class-validator';

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
  @IsEnum(['todo', 'in_progress', 'review', 'completed'], {
    message: 'Status must be one of: todo, in_progress, review, completed',
  })
  status?: 'todo' | 'in_progress' | 'review' | 'completed' = 'todo';

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
}