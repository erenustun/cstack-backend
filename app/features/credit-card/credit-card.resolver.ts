import { UseGuards } from '@nestjs/common'
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'
import { CurrentUser } from '@shared/decorator/current-user.decorator'
import { HasRoles } from '@shared/decorator/role.decorator'
import { IDeleteResponse } from '@shared/dto/typeorm-result.dto'
import { JwtAuthGuard } from '@feature/authentication/guard/jwt-auth.guard'
import { RoleGuard } from '@feature/authentication/guard/role.guard'
import { Role } from '@shared/enum/user/role.enum'
import { CreditCardService } from '@shared/service/credit-card.service'
import { Card } from '@shared/model/credit-card.model'
import { User } from '@shared/model/user.model'
import { CreateCreditCardInput } from '@shared/dto/credit-card/create-credit-card.input'

@Resolver(() => Card)
export class CreditCardResolver {
  constructor(private readonly creditCardService: CreditCardService) {}

  @Query(() => [Card])
  @UseGuards(JwtAuthGuard, RoleGuard)
  @HasRoles(Role.CUSTOMER)
  async creditCards(@CurrentUser() user: User): Promise<Card[]> {
    return await this.creditCardService.fetch({
      user: { id: user.id },
    })
  }

  @Mutation(() => Card)
  @UseGuards(JwtAuthGuard, RoleGuard)
  @HasRoles(Role.CUSTOMER)
  async createCreditCard(
    @CurrentUser() user: User,
    @Args('data') creditCard: CreateCreditCardInput
  ): Promise<Card> {
    return await this.creditCardService.save(creditCard, user.id as string)
  }

  /*@Mutation(() => UpdateResult)
  @UseGuards(JwtAuthGuard, RoleGuard)
  @HasRoles(Role.CUSTOMER)
  async swapPrimaryCard(
    @CurrentUser() user: User,
    @Args('cardId') cardId: string,
  ): Promise<UpdateResult> {
    return await this.creditCardService.swapMainCard(
      cardId,
      user.id as string,
    )
  }*/

  @Mutation(() => IDeleteResponse)
  @UseGuards(JwtAuthGuard, RoleGuard)
  @HasRoles(Role.CUSTOMER)
  async deleteCreditCard(
    @Args('id', { type: () => String }) id: string
  ): Promise<IDeleteResponse> {
    return await this.creditCardService.delete(id)
  }
}
