import { Resolver, Query, ResolveField, Parent } from '@nestjs/graphql';
import { Loader } from '../common/loaders/loaders.decorator.js';
import { LoaderRegistry } from '../common/loaders/loaders.js';
import { ProfileModel } from './profile.model.js';
import { ProfileService } from './profile.service.js';
import { SkillsModel } from './skills/skills.model.js';
import { SkillsService } from './skills/skills.service.js';
import { ProjectsModel } from './projects/projects.model.js';
import { ProjectsService } from './projects/projects.service.js';
import { ExperienceService } from './experience/experience.service.js';
import { ExperienceModel } from './experience/experience.model.js';

@Resolver(() => ProfileModel)
export class ProfileResolver {
  constructor(
    private readonly authorsService: ProfileService,
    private readonly skillsService: SkillsService,
    private readonly projectsService: ProjectsService,
    private readonly experienceService: ExperienceService,
  ) { }

  @Query(() => ProfileModel, { name: 'profile', nullable: true })
  async findFirst() {
    return this.authorsService.find();
  }

  @ResolveField(() => [SkillsModel])
  async skills(
    @Parent() profile: ProfileModel,
    @Loader() loader: LoaderRegistry,
  ) {
    return loader.oneToMany(this.skillsService.byProfile).load(profile.id);
  }

  @ResolveField(() => [ProjectsModel])
  async projects(
    @Parent() profile: ProfileModel,
    @Loader() loader: LoaderRegistry,
  ) {
    return loader
      .oneToMany(this.projectsService.byProfile)
      .load(profile.id);
  }

  @ResolveField(() => [ExperienceModel])
  async experience(
    @Parent() profile: ProfileModel,
    @Loader() loader: LoaderRegistry,
  ) {
    return loader
      .oneToMany(this.experienceService.byProfile)
      .load(profile.id);
  }
}
