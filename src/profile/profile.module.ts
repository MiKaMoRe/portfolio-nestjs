import { Module } from '@nestjs/common';
import { ProfileService } from './profile.service.js';
import { ProfileResolver } from './profile.resolver.js';
import { SkillsService } from './skills/skills.service.js';
import { ProjectsService } from './projects/projects.service.js';
import { ExperienceService } from './experience/experience.service.js';

@Module({
  imports: [],
  providers: [
    ProfileService,
    ProfileResolver,
    SkillsService,
    ProjectsService,
    ExperienceService,
  ],
})
export class ProfileModule { }
