import { Controller, Get, Post, Delete, Body, Param, UseGuards, Req, Inject } from "@nestjs/common";
import { ContactsService } from "./contacts.service";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { AddContactDto } from "./dto/contact.dto";

@Controller("contacts")
@UseGuards(JwtAuthGuard)
export class ContactsController {
  constructor(@Inject(ContactsService) private readonly contactsService: ContactsService) {}

  @Get()
  async getContacts(@Req() req: any) {
    return await this.contactsService.getContacts(req.user.sub);
  }

  @Post()
  async addContact(@Req() req: any, @Body() dto: AddContactDto) {
    return await this.contactsService.addContact(req.user.sub, dto);
  }

  @Delete(":contactId")
  async removeContact(@Req() req: any, @Param("contactId") contactId: string) {
    return await this.contactsService.removeContact(req.user.sub, contactId);
  }
}
