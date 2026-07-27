import { IsString, IsNotEmpty, IsOptional, IsBoolean, IsArray, IsInt, Min, Max } from "class-validator";
import { Type } from "class-transformer";

export class CreateConversationDto {
  @IsBoolean()
  @IsOptional()
  isGroup?: boolean;

  @IsString()
  @IsOptional()
  title?: string;

  @IsArray()
  @IsString({ each: true })
  recipientIds!: string[];
}

export class SendMessageDto {
  @IsString()
  @IsNotEmpty()
  clientMessageId!: string;

  @IsString()
  @IsNotEmpty()
  text!: string;

  @IsString()
  @IsOptional()
  type?: "TEXT" | "IMAGE" | "VIDEO" | "AUDIO" | "DOCUMENT";
}

export class GetMessagesQueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 50;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  beforeSequence?: number;
}
