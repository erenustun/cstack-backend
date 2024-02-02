import { InputType } from '@nestjs/graphql'

@InputType()
export class TokenVerifyInput {
  token: string
  tokenOption: string
}
