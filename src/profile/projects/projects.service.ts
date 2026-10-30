import { OneToManySource } from '../../common/loaders/loaders.types.js';
import { PrismaService } from '../../prisma/prisma.service.js';
import { Injectable, Logger } from '@nestjs/common';
import { ProjectsRecord } from './projects.types.js';

@Injectable()
export class ProjectsService {
  constructor(private readonly prisma: PrismaService) { }

  private readonly logger = new Logger(ProjectsService.name);

  readonly byProfile: OneToManySource<number, ProjectsRecord> = {
    findByParentIds: (ids) => this.findByProfileIds(ids),
    getParentId: (project) => project.profileId,
  };

  findByProfileIds(ids: readonly number[]) {
    const resp = this.prisma.projects.findMany({
      where: { profileId: { in: [...ids] } },
    });
    this.logger.debug('findByProfileIds called', { ids });
    return resp;
  }
}
