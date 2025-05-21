import { IsString, IsNotEmpty, IsEmail, IsEnum } from 'class-validator';

export class ShareFileDto {
  @IsEmail()
  @IsNotEmpty()
  emailAddress: string;

  @IsEnum(['reader', 'commenter', 'writer', 'fileOrganizer', 'organizer', 'owner'], {
    message: 'Role must be one of: reader, commenter, writer, fileOrganizer, organizer, owner',
  })
  @IsNotEmpty()
  role: 'reader' | 'commenter' | 'writer' | 'fileOrganizer' | 'organizer' | 'owner';
}