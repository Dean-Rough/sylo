import { IsString, IsNotEmpty, IsOptional, IsArray, ValidateNested, IsBoolean, IsEmail, IsDateString } from 'class-validator';
import { Type } from 'class-transformer';

class MeetingAttendee {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsOptional()
  displayName?: string;
}

export class ScheduleMeetingDto {
  @IsString()
  @IsNotEmpty()
  summary: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  location?: string;

  @IsDateString()
  @IsNotEmpty()
  startDateTime: string;

  @IsDateString()
  @IsNotEmpty()
  endDateTime: string;

  @IsArray()
  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => MeetingAttendee)
  attendees: MeetingAttendee[];

  @IsBoolean()
  @IsOptional()
  conferenceData?: boolean;
}