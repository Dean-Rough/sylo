import { IsNumber, IsString, IsOptional } from 'class-validator';

export class TaskPredictionDto {
  @IsNumber()
  taskId: number;

  @IsString()
  taskName: string;

  @IsNumber()
  @IsOptional()
  originalEstimate?: number;

  @IsNumber()
  @IsOptional()
  predictedDelay?: number;
}