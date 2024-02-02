import { createParamDecorator, ExecutionContext } from '@nestjs/common'

import { getUserFromHeader } from '@shared/util/api.util'

export const CurrentUser = createParamDecorator(
  (_data: unknown, context: ExecutionContext) => {
    if (context.getType() === 'http') {
      return context.switchToHttp().getRequest().user
    }

    return getUserFromHeader(context)
  }
)
