import { IsOptional, IsString, IsEnum } from 'class-validator';

export class UpdateProjectDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsEnum(['active', 'completed', 'archived'], {
    message: 'Status must be one of: active, completed, archived',
  })
  status?: 'active' | 'completed' | 'archived';
}