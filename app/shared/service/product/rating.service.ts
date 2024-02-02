import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm'
import { DataSource, Repository } from 'typeorm'
import { ratingMock } from '@feature/product/features/rating/rating.mock'
import { RATING_RELATIONS } from '@feature/product/features/rating/constant'
import { ProductRating } from '@shared/model/product/rating.model'
import { CreateRatingInput } from '@shared/dto/product/create-rating.input'

@Injectable()
export class RatingService {
  constructor(
    @InjectRepository(ProductRating)
    private readonly ratingRepo: Repository<ProductRating>,
    @InjectDataSource()
    private dataSource: DataSource
  ) {}

  /**
   * Fetches all rating records
   * @param where If included, used sql where statement (javascript object syntax)
   */
  async fetch(where?: object): Promise<ProductRating[]> {
    try {
      return await this.ratingRepo.find({
        ...(where && { where }),
        relations: RATING_RELATIONS,
      })
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  /**
   * Saves a rating record
   * @param ratingInput DTO
   * @param userId Owner of record
   */
  async save(
    ratingInput: CreateRatingInput,
    userId: string
  ): Promise<ProductRating> {
    try {
      const { productId, ...rest } = ratingInput

      const rating = await this.ratingRepo.save({
        ...rest,
        user: { id: userId },
        product: { id: productId },
      })

      return (await this.ratingRepo.findOne({
        where: { id: rating.id },
        relations: RATING_RELATIONS,
      })) as ProductRating
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  /**
   * Inserts data into `rating` table from `rating.mock.ts`
   * Only inserts data upon empty table
   */
  async mockRatings(): Promise<any> {
    try {
      const ratings = await this.ratingRepo.find()
      if (ratings.length <= 0) {
        return await this.dataSource
          .createQueryBuilder()
          .insert()
          .into(ProductRating)
          .values(ratingMock)
          .execute()
      }
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }
}
