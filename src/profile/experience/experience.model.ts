import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType('Experience')
export class ExperienceModel {
  @Field(() => Int) id: number;
  @Field() company: string;
  @Field() position: string;
  @Field(() => [String]) achievements: string[];
  @Field(() => Date) startDate: string;
  @Field(() => Date) endDate: string;
}
