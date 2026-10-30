import { OneToManySource } from '../../common/loaders/loaders.types.js';
import { PrismaService } from '../../prisma/prisma.service.js';
import { Injectable, Logger } from '@nestjs/common';
import { ExperienceRecord } from './experience.types.js';

@Injectable()
export class ExperienceService {
  constructor(private readonly prisma: PrismaService) { }

  private readonly logger = new Logger(ExperienceService.name);

  readonly byProfile: OneToManySource<number, ExperienceRecord> = {
    findByParentIds: (ids) => this.findByProfileIds(ids),
    getParentId: (experience) => experience.profileId,
  };

  findByProfileIds(ids: readonly number[]) {
    const resp = this.prisma.experience.findMany({
      where: { profileId: { in: [...ids] } },
    });
    this.logger.debug('findByProfileIds called', { ids });
    return resp;
  }
}
