import { IsNotEmpty, IsUUID } from 'class-validator';

export class CreateTaskDependencyDto {
  @IsNotEmpty()
  @IsUUID()
  task_id: string;

  @IsNotEmpty()
  @IsUUID()
  depends_on_task_id: string;
}