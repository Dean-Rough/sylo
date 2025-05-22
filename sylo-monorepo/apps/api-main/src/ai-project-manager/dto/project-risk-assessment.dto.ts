import { IsNumber, IsString, IsEnum, IsOptional } from 'class-validator';

export enum RiskLevel {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high'
}

export class ProjectRiskAssessmentDto {
  @IsNumber()
  projectId: number;

  @IsEnum(RiskLevel)
  overallRiskLevel: RiskLevel;

  @IsNumber()
  @IsOptional()
  riskScore?: number;

  @IsNumber()
  @IsOptional()
  delayedTaskCount?: number;

  @IsNumber()
  @IsOptional()
  totalTaskCount?: number;
}