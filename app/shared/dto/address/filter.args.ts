import { Field, InputType, ObjectType } from '@nestjs/graphql'
import { Column } from 'typeorm'

@ObjectType()
@InputType('AddressFilterArgsInput')
export class AddressFilterArgs {
  @Column({ default: false, type: 'boolean' })
  primary?: boolean
  @Field(() => String, { nullable: true })
  type?: string
  @Field(() => String, { nullable: true })
  userId?: string
}
