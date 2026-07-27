import { Controller, Get, Delete, Param, UseGuards, Req, Inject } from "@nestjs/common";
import { DevicesService } from "./devices.service";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";

@Controller("devices")
@UseGuards(JwtAuthGuard)
export class DevicesController {
  constructor(@Inject(DevicesService) private readonly devicesService: DevicesService) {}

  @Get()
  async getDevices(@Req() req: any) {
    return await this.devicesService.getAccountDevices(req.user.sub, req.user.deviceId);
  }

  @Delete(":deviceId")
  async revokeDevice(@Req() req: any, @Param("deviceId") deviceId: string) {
    return await this.devicesService.revokeDevice(req.user.sub, deviceId);
  }
}
