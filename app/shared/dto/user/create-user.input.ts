import { InputType } from '@nestjs/graphql'
import { User } from '@shared/model/user.model'

@InputType()
export class CreateUserInput extends User {}
