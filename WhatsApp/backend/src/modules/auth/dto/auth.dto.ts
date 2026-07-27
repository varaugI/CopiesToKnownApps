import { IsString, IsNotEmpty, IsOptional, Length } from "class-validator";

export class RequestOtpDto {
  @IsString()
  @IsNotEmpty()
  target!: string; // Phone number or email address
}

export class VerifyOtpDto {
  @IsString()
  @IsNotEmpty()
  target!: string;

  @IsString()
  @Length(6, 6)
  code!: string;

  @IsString()
  @IsNotEmpty()
  deviceName!: string;

  @IsString()
  @IsOptional()
  displayName?: string;
}

export class RefreshTokenDto {
  @IsString()
  @IsNotEmpty()
  refreshToken!: string;
}
