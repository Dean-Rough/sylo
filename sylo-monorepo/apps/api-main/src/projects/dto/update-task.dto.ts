import { IsOptional, IsString, IsEnum, IsUUID, IsDateString } from 'class-validator';

export class UpdateTaskDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsEnum(['todo', 'in_progress', 'review', 'completed'], {
    message: 'Status must be one of: todo, in_progress, review, completed',
  })
  status?: 'todo' | 'in_progress' | 'review' | 'completed';

  @IsOptional()
  @IsEnum(['low', 'medium', 'high', 'urgent'], {
    message: 'Priority must be one of: low, medium, high, urgent',
  })
  priority?: 'low' | 'medium' | 'high' | 'urgent';

  @IsOptional()
  @IsUUID()
  assigned_to?: string;

  @IsOptional()
  @IsDateString()
  deadline?: string;
}