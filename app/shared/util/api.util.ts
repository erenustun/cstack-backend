import { ExecutionContext } from '@nestjs/common'
import { GqlExecutionContext } from '@nestjs/graphql'

import { filterArrayByString } from '@shared/util/array.util'

export const getUserFromHeader = (context: ExecutionContext) => {
  const ctx = GqlExecutionContext.create(context)
  const header = ctx.getContext().req?.raw?.rawHeaders

  const authorization = filterArrayByString(header, 'Bearer *')[0] as string
  const bearerToken = authorization.split(' ')[1] // remove "bearer " from string to obtain JWT

  // decode JWT as a base64 string
  const base64Payload = bearerToken.split('.')[1]
  const user = JSON.parse(Buffer.from(base64Payload, 'base64').toString())

  // rename key sub to id
  user['id'] = user.sub
  delete user['sub']

  return user
}
