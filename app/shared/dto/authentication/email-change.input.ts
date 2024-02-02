import { InputType } from '@nestjs/graphql'

@InputType()
export class EmailChangeInput {
  email: string
  token: string
}
