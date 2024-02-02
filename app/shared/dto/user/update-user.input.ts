import { InputType, PartialType } from '@nestjs/graphql'
import { CreateUserInput } from '@shared/dto/user/create-user.input'

@InputType()
export class UpdateUserInput extends PartialType(CreateUserInput) {}
