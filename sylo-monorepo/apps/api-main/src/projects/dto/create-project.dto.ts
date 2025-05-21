import { IsNotEmpty, IsString, IsOptional, IsEnum } from 'class-validator';

export class CreateProjectDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsEnum(['active', 'completed', 'archived'], {
    message: 'Status must be one of: active, completed, archived',
  })
  status?: 'active' | 'completed' | 'archived' = 'active';
}