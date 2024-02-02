import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class AuthEmailResponse {
  @Field(() => Boolean)
  success: boolean

  @Field(() => [String])
  rejected: any
}
