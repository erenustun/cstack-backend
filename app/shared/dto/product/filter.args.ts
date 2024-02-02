import { Field, InputType, Int, ObjectType } from '@nestjs/graphql'

@ObjectType()
@InputType('FilterArgsInput')
export class FilterArgs {
  @Field(() => [String], { nullable: 'itemsAndList' })
  brand?: string[]
  @Field(() => [String], { nullable: 'itemsAndList' })
  category?: string[]
  @Field(() => [Int], { nullable: 'itemsAndList' })
  ram?: number[]
  @Field(() => [Int], { nullable: 'itemsAndList' })
  storage?: number[]
  @Field(() => String, { nullable: true })
  search?: string
  priceMin?: number
  priceMax?: number
}
