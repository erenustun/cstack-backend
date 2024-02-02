import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm'
import { DataSource, Repository } from 'typeorm'
import { ProductCategory } from '@shared/model/product/category.model'
import { categoryMock } from '@feature/product/features/category/category.mock'
import { RECORD_NOT_FOUND } from '@shared/constant/error.constant'
import {
  IDeleteResponse,
  IUpdateResponse,
} from '@shared/dto/typeorm-result.dto'

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(ProductCategory)
    private readonly categoryRepo: Repository<ProductCategory>,
    @InjectDataSource()
    private dataSource: DataSource
  ) {}

  /**
   * Fetches all category records
   */
  async fetch(): Promise<any> {
    try {
      return this.categoryRepo.find()
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  /**
   * Saves a record
   * @param name Category name
   */
  async save(name: string): Promise<ProductCategory> {
    try {
      const category = await this.categoryRepo.save({
        name,
      })

      return (await this.categoryRepo.findOne({
        where: { id: category.id },
      })) as ProductCategory
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  /**
   * Updates record by identifier
   * @param id  Record identifier to be updated
   * @param name Category name
   */
  async update(id: string, name: string): Promise<IUpdateResponse> {
    try {
      const foundCategory = await this.categoryRepo.findOne({
        where: { id },
      })
      if (!foundCategory)
        throw new HttpException(RECORD_NOT_FOUND, HttpStatus.NOT_FOUND)

      return await this.categoryRepo.update({ id }, { name })
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  /**
   * Deletes a record by identifier
   * @param id Record identifier
   */
  async delete(id: string): Promise<IDeleteResponse> {
    try {
      const category = await this.categoryRepo.findOne({ where: { id } })
      if (!category)
        throw new HttpException(RECORD_NOT_FOUND, HttpStatus.NOT_FOUND)

      return await this.categoryRepo.softDelete(id)
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  /**
   * Restores a record by identifier
   * @param id Record identifier to be restored
   */
  async restore(id: string): Promise<IUpdateResponse> {
    try {
      const category = await this.categoryRepo.restore(id)
      if (!category)
        throw new HttpException(RECORD_NOT_FOUND, HttpStatus.NOT_FOUND)

      return category
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  /**
   * Inserts data into `category` table from `category.mock.ts`
   * Only inserts data upon empty table
   */
  async mockCategories(): Promise<any> {
    try {
      const categories = await this.categoryRepo.find()
      if (categories.length === 0) {
        return await this.dataSource
          .createQueryBuilder()
          .insert()
          .into(ProductCategory)
          .values(categoryMock)
          .execute()
      }
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }
}
