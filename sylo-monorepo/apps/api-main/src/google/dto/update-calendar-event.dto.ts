import { IsString, IsNotEmpty, IsOptional, IsArray, ValidateNested, IsBoolean, IsEmail } from 'class-validator';
import { Type } from 'class-transformer';

class EventDateTime {
  @IsString()
  @IsNotEmpty()
  dateTime: string;

  @IsString()
  @IsOptional()
  timeZone?: string;
}

class EventAttendee {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsOptional()
  displayName?: string;

  @IsBoolean()
  @IsOptional()
  optional?: boolean;
}

class EventReminder {
  @IsString()
  @IsNotEmpty()
  method: string; // "email" or "popup"

  @IsNotEmpty()
  minutes: number; // Minutes before the event
}

export class UpdateCalendarEventDto {
  @IsString()
  @IsOptional()
  summary?: string;

  @IsString()
  @IsOptional()
  location?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  colorId?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => EventDateTime)
  start?: EventDateTime;

  @IsOptional()
  @ValidateNested()
  @Type(() => EventDateTime)
  end?: EventDateTime;

  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => EventAttendee)
  attendees?: EventAttendee[];

  @IsString()
  @IsOptional()
  sendUpdates?: string; // "all", "externalOnly", "none"

  @IsString()
  @IsOptional()
  visibility?: string; // "default", "public", "private", "confidential"

  @IsBoolean()
  @IsOptional()
  guestsCanModify?: boolean;

  @IsBoolean()
  @IsOptional()
  guestsCanInviteOthers?: boolean;

  @IsBoolean()
  @IsOptional()
  guestsCanSeeOtherGuests?: boolean;

  @IsOptional()
  reminders?: {
    useDefault: boolean;
    overrides?: EventReminder[];
  };
}