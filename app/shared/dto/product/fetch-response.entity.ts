import { Field, InputType, Int, ObjectType } from '@nestjs/graphql'
import { ClassType } from '@nestjs/graphql/dist/enums/class-type.enum'
import { PaginationArgs } from '@shared/dto/product/pagination.args'
import { FilterArgs } from '@shared/dto/product/filter.args'

// @ts-ignore
export function FetchResponse<T>(cls: ClassType<T>) {
  @ObjectType({ isAbstract: true })
  @InputType('FetchResponseInput')
  abstract class FetchResponse extends PaginationArgs {
    @Field(() => [cls])
    data: T[]

    @Field(() => Int)
    count: number

    @Field(() => FilterArgs, { nullable: true })
    filter?: FilterArgs
  }
  return FetchResponse
}
