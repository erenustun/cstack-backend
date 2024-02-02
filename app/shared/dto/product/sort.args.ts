import { Field, InputType, ObjectType } from '@nestjs/graphql'
import {
  SortDir,
  SortOption,
} from '@shared/constant/product/sort-options.constant'

@ObjectType()
@InputType('SortArgsInput')
export class SortArgs {
  @Field(() => String)
  sortBy: SortOption

  @Field(() => String)
  sortDir: SortDir
}
