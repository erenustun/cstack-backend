import { ObjectType } from '@nestjs/graphql'

@ObjectType()
export class AuthRegisterResponse {
  success: boolean
}
