import { IsString, IsNotEmpty, IsIn, IsArray } from "class-validator";

export class UpdateReceiptDto {
  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  messageIds!: string[];

  @IsString()
  @IsIn(["DELIVERED", "READ"])
  state!: "DELIVERED" | "READ";
}
