import {
  HttpException,
  HttpStatus,
  Injectable,
  OnModuleInit,
} from '@nestjs/common'
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm'
import { DataSource, Repository } from 'typeorm'
import {
  DEFAULT_MAX_PRICE,
  DEFAULT_MIN_PRICE,
} from '@shared/constant/product/filter.constant'
import {
  SORT_DIR,
  SORT_OPTION,
} from '@shared/constant/product/sort-options.constant'
import { withRating, withRatingArray } from '@shared/util/rating-average.util'
import { productMock } from '@feature/product/mock/product.mock'
import { RECORD_NOT_FOUND } from '@shared/constant/error.constant'
import {
  IDeleteResponse,
  IUpdateResponse,
} from '@shared/dto/typeorm-result.dto'
import { PRODUCT_RELATIONS } from '@shared/constant/product/entity-relation.constant'
import { BrandService } from '@shared/service/product/brand.service'
import { CategoryService } from '@shared/service/product/category.service'
import { RatingService } from '@shared/service/product/rating.service'
import { removeRedundantFromArray } from '@shared/util/array.util'
import { specificationMock } from '@feature/product/mock/specification.mock'
import { ProductImage } from '@shared/model/product/image.model'
import { ProductSpecification } from '@shared/model/product/specification.model'
import {
  GroupedBrandResponse,
  GroupedRamResponse,
  GroupedStorageResponse,
  Product,
} from '@shared/model/product/product.model'
import { PaginationArgs } from '@shared/dto/product/pagination.args'
import { SortArgs } from '@shared/dto/product/sort.args'
import { FilterArgs } from '@shared/dto/product/filter.args'
import { CreateProductInput } from '@shared/dto/product/create-product.input'
import { UpdateProductInput } from '@shared/dto/product/update-product.input'

@Injectable()
export class ProductService implements OnModuleInit {
  constructor(
    private brandService: BrandService,
    private categoryService: CategoryService,
    private ratingService: RatingService,
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,
    @InjectRepository(ProductImage)
    private readonly imageRepo: Repository<ProductImage>,
    @InjectDataSource()
    private dataSource: DataSource
  ) {}

  async onModuleInit(): Promise<void> {
    await this.brandService.mockBrands()
    await this.categoryService.mockCategories()
    await this.mockSpecifications()
    await this.mockProducts()
    await this.ratingService.mockRatings()
  }

  /**
   * Fetches all records
   * @param filter
   * @param pagination
   * @param sort
   */
  async fetch(pagination: PaginationArgs, sort: SortArgs, filter?: FilterArgs) {
    try {
      const { take } = pagination

      if (!sort?.sortDir) sort.sortDir = SORT_DIR.DESC
      if (!sort?.sortBy) sort.sortBy = SORT_OPTION.PRICE
      const { sortBy, sortDir } = sort

      // base query
      const query = this.productRepo.createQueryBuilder('product')
      // relationships
      query.innerJoinAndSelect('product.brand', 'brand')
      query.innerJoinAndSelect('product.category', 'category')
      query.leftJoinAndSelect('product.image', 'image')
      query.leftJoinAndSelect('product.rating', 'rating')
      query.leftJoinAndSelect('product.specification', 'specification')

      // search
      if (filter?.search)
        query.andWhere(
          '(product.name LIKE :search OR product.description LIKE :search OR cpu.name LIKE :search)',
          {
            search: `%${filter.search}%`,
          }
        )

      // filter
      if (filter) {
        if (filter?.brand)
          query.andWhere(filter.brand && 'brand.name IN (:...brand)', {
            brand: filter.brand,
          })
        if (filter?.category)
          query.andWhere(filter.category && 'category.name IN (:...category)', {
            category: filter.category,
          })
        if (filter?.ram)
          query.andWhere(filter.ram && 'specification.dataRam IN (:...ram)', {
            ram: filter.ram,
          })
        if (filter?.storage)
          query.andWhere(
            filter.storage && 'specification.dataStorage && :storage',
            { storage: filter.storage }
          )
        /*if (filter?.storage)
          query.andWhere(
            filter.storage && 'specification.dataStorage IN (:...storage)',
            { storage: filter.storage },
          )*/
        if (filter?.priceMin || filter?.priceMax)
          query.andWhere(
            `\"product\".\"price\" BETWEEN ${Number(
              filter.priceMin ? filter.priceMin : DEFAULT_MIN_PRICE
            )} AND ${Number(
              filter.priceMax ? filter.priceMax : DEFAULT_MAX_PRICE
            )}`
          )
      }

      // pagination
      query.skip(0)
      query.take(take)

      // sort
      query.orderBy(
        sortBy !== SORT_OPTION.RATING ? `product.${sortBy}` : 'rating.star',
        sortDir
      )

      const [products, count] = await Promise.all([
        query.getMany(),
        query.getCount(),
      ])

      // calculate average rating and add to each product into property ratingAverage
      return (
        products &&
        withRatingArray(
          products,
          {
            take,
          },
          count,
          filter
        )
      )
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  /**
   * Fetch record by identifier
   * @param id Record identifier to be fetched
   * @param where If included, used sql where statement (javascript object syntax)
   */
  async fetchOne(id: string, where?: object): Promise<Product> {
    try {
      let product
      if (id)
        product = await this.productRepo.findOne({
          where: { id },
          relations: PRODUCT_RELATIONS,
        })
      if (where)
        product = await this.productRepo.findOne({
          where: where,
          relations: PRODUCT_RELATIONS,
        })
      if (!product)
        throw new HttpException(RECORD_NOT_FOUND, HttpStatus.NOT_FOUND)

      // calculate average rating and add to product.ratingAverage
      if (product.rating && product.rating?.length > 0) {
        return withRating(product)
      }

      return product
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  /**
   * Saves a record
   * @param _product DTO
   */
  async save(_product: CreateProductInput): Promise<Product> {
    try {
      const { brandId, categoryId, imageArray, specificationId, ...rest } =
        _product

      const product = await this.productRepo.save({
        ...(brandId && { brand: { id: brandId } }),
        ...(categoryId && { category: { id: categoryId } }),
        ...(specificationId && {
          specification: { id: specificationId },
        }),
        ...rest,
      })

      if (imageArray && Array.isArray(imageArray)) {
        imageArray.map(async (url) => {
          await this.imageRepo.save({ url, product })
        })
        await this.productRepo.update({ id: product.id }, product)
      }

      return (await this.productRepo.findOne({
        where: { id: product.id },
        relations: PRODUCT_RELATIONS,
      })) as Product
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  /**
   * Updates record by identifier
   * @param id  Record identifier to be updated
   * @param product DTO
   */
  async update(
    id: string,
    product: UpdateProductInput
  ): Promise<IUpdateResponse> {
    try {
      const foundProduct = await this.productRepo.findOne({
        where: { id },
        relations: PRODUCT_RELATIONS,
      })
      if (!foundProduct)
        throw new HttpException(RECORD_NOT_FOUND, HttpStatus.NOT_FOUND)

      const { brandId, categoryId, imageArray, specificationId, ...rest } =
        product

      if (Array.isArray(imageArray)) {
        imageArray.map(async (url) => {
          await this.imageRepo.save({ url, product: { id } })
        })
      }

      return await this.productRepo.update(
        { id },
        {
          ...(brandId && { brand: { id: brandId } }),
          ...(categoryId && { category: { id: categoryId } }),
          ...(specificationId && {
            specification: { id: specificationId },
          }),
          ...rest,
        }
      )
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
      const product = await this.productRepo.findOne({ where: { id } })
      if (!product)
        throw new HttpException(RECORD_NOT_FOUND, HttpStatus.NOT_FOUND)

      return await this.productRepo.softDelete(id)
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
      const product = await this.productRepo.restore(id)
      if (!product)
        throw new HttpException(RECORD_NOT_FOUND, HttpStatus.NOT_FOUND)

      return product
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  /**
   * Inserts data into `specification` table from `specification.mock.ts`
   * Only inserts data upon empty table
   */
  async mockSpecifications(): Promise<any> {
    try {
      const specs = await this.productRepo.find()
      if (specs.length === 0) {
        await this.dataSource
          .createQueryBuilder()
          .insert()
          .into(ProductSpecification)
          .values(specificationMock)
          .execute()
      }
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  /**
   * Inserts data into `product` table from `product.mock.ts`
   * Only inserts data upon empty table
   */
  async mockProducts(): Promise<any> {
    try {
      const products = await this.productRepo.find()
      if (products.length === 0) {
        // insert products
        await this.dataSource
          .createQueryBuilder()
          .insert()
          .into(Product)
          .values(productMock)
          .execute()
        // insert images
        productMock.map((product) => {
          const { id, imageArray } = product

          if (Array.isArray(imageArray)) {
            imageArray.map(async (url) => {
              await this.imageRepo.save({ url, product: { id } })
            })
          }
        })
        return true
      }
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  /**
   * Returns all ram options (grouped)
   */
  async fetchRamOptions(): Promise<GroupedRamResponse[]> {
    try {
      const ramList = await this.dataSource
        .getRepository(Product)
        .createQueryBuilder('product')
        .leftJoinAndSelect('product.specification', 'specification')
        .select('specification.data_ram')
        .groupBy('specification.data_ram')
        .getRawMany()
      return ramList.map((ram) => ({
        label: ram.data_ram + ' GB',
        value: ram.data_ram,
      }))
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  /**
   * Returns all storage options (grouped)
   */
  async fetchStorageOptions(): Promise<GroupedStorageResponse[]> {
    try {
      const storageSizesSorted: number[] = []
      const storageList = await this.dataSource
        .getRepository(Product)
        .createQueryBuilder('product')
        .leftJoinAndSelect('product.specification', 'specification')
        .select('specification.data_storage')
        .groupBy('specification.data_storage')
        .getRawMany()
      storageList.map((storage) => {
        storage.data_storage.map((storageSize: number) =>
          storageSizesSorted.push(storageSize)
        )
      })
      return removeRedundantFromArray(storageSizesSorted).map(
        (storageSize) => ({
          label: `${storageSize}${
            storageSize.toString().length === 1 ? 'TB' : ' GB'
          }`,
          value: storageSize,
        })
      )
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  /**
   * Returns all brand options (grouped)
   */
  async fetchBrandOptions(): Promise<GroupedBrandResponse[]> {
    try {
      const brandList = await this.dataSource
        .getRepository(Product)
        .createQueryBuilder('product')
        .leftJoinAndSelect('product.brand', 'brand')
        .select('brand.name')
        .groupBy('brand.name')
        .orderBy('brand.name', 'ASC')
        .getRawMany()
      return brandList.map((brand) => {
        return {
          label: brand.brand_name,
        }
      })
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }
}
