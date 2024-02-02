import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm'
import { DataSource, Repository } from 'typeorm'
import { brandMock } from '@feature/product/features/brand/brand.mock'
import { ProductBrand } from '@shared/model/product/brand.model'
import {
  IDeleteResponse,
  IUpdateResponse,
} from '@shared/dto/typeorm-result.dto'
import { RECORD_NOT_FOUND } from '@shared/constant/error.constant'

@Injectable()
export class BrandService {
  constructor(
    @InjectRepository(ProductBrand)
    private readonly brandRepo: Repository<ProductBrand>,
    @InjectDataSource()
    private dataSource: DataSource
  ) {}

  /**
   * Fetches all brand records
   */
  async fetch(): Promise<any> {
    try {
      return this.brandRepo.find()
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  /**
   * Saves a record
   * @param name Brand name
   */
  async save(name: string): Promise<ProductBrand> {
    try {
      const brand = await this.brandRepo.save({
        name,
      })

      return (await this.brandRepo.findOne({
        where: { id: brand.id },
      })) as ProductBrand
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  /**
   * Updates record by identifier
   * @param id  Record identifier to be updated
   * @param name Brand name
   */
  async update(id: string, name: string): Promise<IUpdateResponse> {
    try {
      const foundBrand = await this.brandRepo.findOne({
        where: { id },
      })
      if (!foundBrand)
        throw new HttpException(RECORD_NOT_FOUND, HttpStatus.NOT_FOUND)

      return await this.brandRepo.update({ id }, { name })
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
      const brand = await this.brandRepo.findOne({ where: { id } })
      if (!brand)
        throw new HttpException(RECORD_NOT_FOUND, HttpStatus.NOT_FOUND)

      return await this.brandRepo.softDelete(id)
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
      const brand = await this.brandRepo.restore(id)
      if (!brand)
        throw new HttpException(RECORD_NOT_FOUND, HttpStatus.NOT_FOUND)

      return brand
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  /**
   * Inserts data into `brand` table from `brand.mock.ts`
   * Only inserts data upon empty table
   */
  async mockBrands(): Promise<any> {
    try {
      const brands = await this.brandRepo.find()
      if (brands.length === 0) {
        return await this.dataSource
          .createQueryBuilder()
          .insert()
          .into(ProductBrand)
          .values(brandMock)
          .execute()
      }
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }
}
