import { IsString, IsOptional, MaxLength } from "class-validator";

export class UpdateProfileDto {
  @IsString()
  @IsOptional()
  @MaxLength(50)
  displayName?: string;

  @IsString()
  @IsOptional()
  @MaxLength(140)
  about?: string;

  @IsString()
  @IsOptional()
  avatarUrl?: string;
}
