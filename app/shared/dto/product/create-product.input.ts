import { Field, InputType, Int } from '@nestjs/graphql'

@InputType()
export class CreateProductInput {
  brandId: string
  categoryId: string
  description?: string
  discount?: number
  imageArray?: string[]
  name: string
  price: number
  @Field(() => Int)
  ram?: number
  specificationId: string
  @Field(() => Int)
  stock: number
  thumbnail?: string
}
