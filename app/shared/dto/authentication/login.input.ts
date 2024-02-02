import { InputType } from '@nestjs/graphql'

@InputType()
export class LoginInput {
  email: string
  password: string
}
