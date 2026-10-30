import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType('Projects')
export class ProjectsModel {
  @Field(() => Int) id: number;
  @Field() name: string;
  @Field() description: string;
  @Field() link: string;
}
