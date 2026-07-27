import { IsString, IsNotEmpty, IsOptional, IsArray } from "class-validator";

export class AddContactDto {
  @IsString()
  @IsNotEmpty()
  target!: string;

  @IsString()
  @IsOptional()
  aliasName?: string;
}

export class SyncContactsDto {
  @IsArray()
  @IsString({ each: true })
  phoneHashes!: string[];
}
