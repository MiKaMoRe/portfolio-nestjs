import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType('Skills')
export class SkillsModel {
  @Field(() => Int) id: number;
  @Field() name: string;
}
