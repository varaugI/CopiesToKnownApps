import {
  Controller,
  Post,
  Patch,
  Body,
  Param,
  UseGuards,
  Req,
  HttpCode,
  HttpStatus,
  Inject
} from "@nestjs/common";
import { ReceiptsService } from "./receipts.service";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { UpdateReceiptDto } from "./dto/receipt.dto";

@Controller("conversations")
@UseGuards(JwtAuthGuard)
export class ReceiptsController {
  constructor(@Inject(ReceiptsService) private readonly receiptsService: ReceiptsService) {}

  @Post(":id/receipts")
  @HttpCode(HttpStatus.OK)
  async updateReceipts(
    @Req() req: any,
    @Param("id") conversationId: string,
    @Body() dto: UpdateReceiptDto
  ) {
    return await this.receiptsService.updateReceipts(
      conversationId,
      req.user.sub,
      req.user.deviceId || "dev_1",
      dto
    );
  }

  @Patch(":id/read")
  @HttpCode(HttpStatus.OK)
  async markAsRead(@Req() req: any, @Param("id") conversationId: string) {
    return await this.receiptsService.markConversationAsRead(conversationId, req.user.sub);
  }
}
