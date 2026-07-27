import { Injectable, NotFoundException, BadRequestException, Inject } from "@nestjs/common";
import { PrismaService } from "../database/prisma.service";
import { AddContactDto } from "./dto/contact.dto";

@Injectable()
export class ContactsService {
  constructor(@Inject(PrismaService) private readonly prisma: PrismaService) {}

  async getContacts(ownerId: string) {
    const contacts = await this.prisma.contact.findMany({
      where: { ownerId },
      include: { contactUser: true }
    });

    return contacts.map((c) => ({
      id: c.id,
      contactId: c.contactId,
      name: c.aliasName || c.contactUser.displayName,
      phone: c.contactUser.phoneNumber,
      email: c.contactUser.email,
      avatarUrl: c.contactUser.avatarUrl,
      about: c.contactUser.about
    }));
  }

  async addContact(ownerId: string, dto: AddContactDto) {
    const targetUser = await this.prisma.account.findFirst({
      where: { OR: [{ phoneNumber: dto.target }, { email: dto.target }] }
    });

    if (!targetUser) {
      throw new NotFoundException("Target user account not found");
    }

    if (targetUser.id === ownerId) {
      throw new BadRequestException("Cannot add yourself as a contact");
    }

    const contact = await this.prisma.contact.upsert({
      where: {
        ownerId_contactId: {
          ownerId,
          contactId: targetUser.id
        }
      },
      update: {
        aliasName: dto.aliasName || targetUser.displayName
      },
      create: {
        ownerId,
        contactId: targetUser.id,
        aliasName: dto.aliasName || targetUser.displayName
      },
      include: { contactUser: true }
    });

    return {
      id: contact.id,
      contactId: contact.contactId,
      name: contact.aliasName || contact.contactUser.displayName,
      phone: contact.contactUser.phoneNumber
    };
  }

  async removeContact(ownerId: string, contactId: string) {
    await this.prisma.contact.deleteMany({
      where: { ownerId, contactId }
    });

    return { success: true, message: "Contact removed" };
  }
}
