import { Injectable, NotFoundException, Inject } from "@nestjs/common";
import { PrismaService } from "../database/prisma.service";

@Injectable()
export class DevicesService {
  constructor(@Inject(PrismaService) private readonly prisma: PrismaService) {}

  async getAccountDevices(accountId: string, currentDeviceId?: string) {
    const devices = await this.prisma.device.findMany({
      where: { accountId },
      orderBy: { lastActive: "desc" }
    });

    return devices.map((d) => ({
      id: d.id,
      deviceName: d.deviceName,
      lastActive: d.lastActive,
      createdAt: d.createdAt,
      isCurrent: d.id === currentDeviceId
    }));
  }

  async revokeDevice(accountId: string, deviceId: string) {
    const device = await this.prisma.device.findFirst({
      where: { id: deviceId, accountId }
    });

    if (!device) {
      throw new NotFoundException("Device not found or unauthorized");
    }

    // Revoke all refresh sessions for target device
    await this.prisma.refreshSession.updateMany({
      where: { deviceId },
      data: { isRevoked: true }
    });

    return { success: true, message: `Device ${deviceId} session revoked` };
  }
}
