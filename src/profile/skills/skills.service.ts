import { OneToManySource } from '../../common/loaders/loaders.types.js';
import { PrismaService } from '../../prisma/prisma.service.js';
import { Injectable, Logger } from '@nestjs/common';
import { SkillsRecord } from './skills.types.js';

@Injectable()
export class SkillsService {
  constructor(private readonly prisma: PrismaService) { }

  private readonly logger = new Logger(SkillsService.name);

  readonly byProfile: OneToManySource<number, SkillsRecord> = {
    findByParentIds: (ids) => this.findByProfileIds(ids),
    getParentId: (skill) => skill.profileId,
  };

  findByProfileIds(ids: readonly number[]) {
    const resp = this.prisma.skills.findMany({
      where: { profileId: { in: [...ids] } },
    });
    this.logger.debug('findByParentIds called', { ids });
    return resp;
  }
}
