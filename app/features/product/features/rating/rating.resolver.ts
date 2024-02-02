import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'
import { RatingService } from '@shared/service/product/rating.service'
import { UseGuards } from '@nestjs/common'
import { JwtAuthGuard } from '@feature/authentication/guard/jwt-auth.guard'
import { RoleGuard } from '@feature/authentication/guard/role.guard'
import { HasRoles } from '@shared/decorator/role.decorator'
import { Role } from '@shared/enum/user/role.enum'
import { CurrentUser } from '@shared/decorator/current-user.decorator'
import { ProductRating } from '@shared/model/product/rating.model'
import { CreateRatingInput } from '@shared/dto/product/create-rating.input'
import { User } from '@shared/model/user.model'

@Resolver(() => ProductRating)
export class RatingResolver {
  constructor(private readonly ratingService: RatingService) {}

  @Query(() => [ProductRating])
  async ratings(
    @Args('productId') productId: string
  ): Promise<ProductRating[]> {
    return await this.ratingService.fetch({ product: { id: productId } })
  }

  @Mutation(() => ProductRating)
  @UseGuards(JwtAuthGuard, RoleGuard)
  @HasRoles(Role.CUSTOMER)
  async createRating(
    @Args('data') rating: CreateRatingInput,
    @CurrentUser() user: User
  ): Promise<ProductRating> {
    return this.ratingService.save(rating, user.id as string)
  }
}
