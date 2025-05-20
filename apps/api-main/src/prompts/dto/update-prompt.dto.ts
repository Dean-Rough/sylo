import { IsArray, IsOptional, IsString, ArrayNotEmpty } from 'class-validator';

export class UpdatePromptDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  content?: string;

  @IsOptional()
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  tags?: string[];
}
