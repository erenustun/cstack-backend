import { ObjectType } from '@nestjs/graphql'
import { User } from '@shared/model/user.model'

@ObjectType()
export class AuthLoginResponse {
  user: User
  token: string
}
