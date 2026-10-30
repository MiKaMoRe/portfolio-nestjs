import { PrismaService } from '../prisma/prisma.service.js';
import { Injectable, Logger } from '@nestjs/common';
import { ProfileRecord } from './profile.types.js';

@Injectable()
export class ProfileService {
  constructor(private readonly prisma: PrismaService) { }

  private readonly logger = new Logger(ProfileService.name);

  async find(): Promise<ProfileRecord | null> {
    const resp = await this.prisma.profile.findFirst();
    this.logger.log('find profile called');
    return resp;
  }
}
