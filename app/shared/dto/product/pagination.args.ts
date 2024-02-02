import { Field, InputType, Int, ObjectType } from '@nestjs/graphql'

@ObjectType()
@InputType('PaginationArgsInput')
export class PaginationArgs {
  @Field(() => Int)
  take: number
}
