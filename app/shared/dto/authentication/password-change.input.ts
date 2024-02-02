import { InputType } from '@nestjs/graphql'

@InputType()
export class PasswordChangeInput {
  password: string
  token: string
}
