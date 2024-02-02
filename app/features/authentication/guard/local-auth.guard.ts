import { ExecutionContext, Injectable } from '@nestjs/common'
import { GqlExecutionContext } from '@nestjs/graphql'
import { AuthGuard } from '@nestjs/passport'

@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {
  getRequest(context: ExecutionContext) {
    const ctx = GqlExecutionContext.create(context)
    const graphqlRequest = ctx.getContext().req

    if (graphqlRequest) {
      const { input } = ctx.getArgs()
      graphqlRequest.body = input
      return graphqlRequest
    }

    return context.switchToHttp().getRequest()
  }
}
