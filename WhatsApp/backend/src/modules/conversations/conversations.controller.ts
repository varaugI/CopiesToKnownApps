import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
  Req,
  HttpCode,
  HttpStatus,
  Inject
} from "@nestjs/common";
import { ConversationsService } from "./conversations.service";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { CreateConversationDto, SendMessageDto, GetMessagesQueryDto } from "./dto/conversation.dto";

@Controller("conversations")
@UseGuards(JwtAuthGuard)
export class ConversationsController {
  constructor(
    @Inject(ConversationsService) private readonly conversationsService: ConversationsService
  ) {}

  @Get()
  async getConversations(@Req() req: any) {
    return await this.conversationsService.getConversations(req.user.sub);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createConversation(@Req() req: any, @Body() dto: CreateConversationDto) {
    return await this.conversationsService.createConversation(req.user.sub, dto);
  }

  @Get(":id/messages")
  async getMessages(
    @Req() req: any,
    @Param("id") conversationId: string,
    @Query() query: GetMessagesQueryDto
  ) {
    return await this.conversationsService.getMessages(conversationId, req.user.sub, query);
  }

  @Post(":id/messages")
  @HttpCode(HttpStatus.CREATED)
  async sendMessage(
    @Req() req: any,
    @Param("id") conversationId: string,
    @Body() dto: SendMessageDto
  ) {
    return await this.conversationsService.sendMessage(conversationId, req.user.sub, dto);
  }
}
