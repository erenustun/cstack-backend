import { Field, Int, ObjectType } from '@nestjs/graphql'
import { ObjectLiteral } from 'typeorm'

@ObjectType()
export class IDeleteResponse {
  @Field(() => [String])
  raw: any

  @Field(() => Int)
  affected?: number | null
}

@ObjectType()
export class IUpdateResponse {
  @Field(() => [String])
  raw: any

  @Field(() => Int)
  affected?: number | null

  @Field(() => [String])
  generatedMaps: ObjectLiteral[]
}
