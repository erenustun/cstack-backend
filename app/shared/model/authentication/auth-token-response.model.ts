import { ObjectType } from '@nestjs/graphql'

@ObjectType()
export class TokenVerificationResponse {
  valid: boolean
}
