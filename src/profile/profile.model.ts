import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType('Profile')
export class ProfileModel {
  @Field(() => Int) id: number;
  @Field() name: string;
  @Field() description: string;
  @Field(() => [String]) links: string[];
}
