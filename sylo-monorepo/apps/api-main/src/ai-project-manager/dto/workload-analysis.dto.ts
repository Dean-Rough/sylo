import { IsNumber, IsOptional } from 'class-validator';

export class WorkloadAnalysisDto {
  @IsNumber()
  teamId: number;

  @IsNumber()
  @IsOptional()
  totalProjects?: number;

  @IsNumber()
  @IsOptional()
  activeProjects?: number;

  @IsNumber()
  @IsOptional()
  totalTasks?: number;

  @IsNumber()
  @IsOptional()
  completedTasks?: number;

  @IsNumber()
  @IsOptional()
  workloadPercentage?: number;
}