import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { RatingService } from '@shared/service/product/rating.service'
import { RatingResolver } from '@feature/product/features/rating/rating.resolver'
import { ProductRating } from '@shared/model/product/rating.model'

@Module({
  imports: [TypeOrmModule.forFeature([ProductRating])],
  providers: [RatingService, RatingResolver],
  exports: [RatingService],
})
export class RatingModule {}
