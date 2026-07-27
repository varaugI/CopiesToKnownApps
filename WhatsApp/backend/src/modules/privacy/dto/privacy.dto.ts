import { IsString, IsOptional, IsBoolean, IsIn, IsNotEmpty } from "class-validator";

export class UpdatePrivacyDto {
  @IsString()
  @IsOptional()
  @IsIn(["everyone", "contacts", "nobody"])
  lastSeenVisibility?: string;

  @IsString()
  @IsOptional()
  @IsIn(["everyone", "contacts", "nobody"])
  profilePhoto?: string;

  @IsString()
  @IsOptional()
  @IsIn(["everyone", "contacts", "nobody"])
  aboutVisibility?: string;

  @IsString()
  @IsOptional()
  @IsIn(["everyone", "contacts", "nobody"])
  statusVisibility?: string;

  @IsBoolean()
  @IsOptional()
  readReceipts?: boolean;
}

export class BlockUserDto {
  @IsString()
  @IsNotEmpty()
  targetId!: string;
}
