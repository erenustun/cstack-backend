import { Field, InputType } from '@nestjs/graphql'
import { User } from '@shared/model/user.model'

@InputType()
export class RegisterInput extends User {
  @Field(() => String)
  password: string
}
