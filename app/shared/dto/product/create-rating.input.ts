import { Field, InputType, Int } from '@nestjs/graphql'

@InputType()
export class CreateRatingInput {
  text: string
  productId: string
  @Field(() => Int)
  star: number
}
