import { IsString, IsNotEmpty, IsUrl } from 'class-validator';

export class ExchangeCodeDto {
  @IsString()
  @IsNotEmpty()
  code: string;

  @IsString()
  @IsNotEmpty()
  @IsUrl()
  redirectUri: string;
}