import { Args, Query, Resolver } from '@nestjs/graphql'
import { ProductService } from '@shared/service/product/product.service'
import {
  SORT_DIR,
  SORT_OPTION,
} from '@shared/constant/product/sort-options.constant'
import {
  GroupedBrandResponse,
  GroupedRamResponse,
  GroupedStorageResponse,
  Product,
  ProductsFetchResponse,
} from '@shared/model/product/product.model'
import { PaginationArgs } from '@/app/shared/dto/product/pagination.args'
import { SortArgs } from '@/app/shared/dto/product/sort.args'
import { FilterArgs } from '@/app/shared/dto/product/filter.args'

@Resolver(() => Product)
export class ProductResolver {
  constructor(private readonly productService: ProductService) {}

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  @Query(() => ProductsFetchResponse)
  async products(
    @Args('paginationArgs', { nullable: true }) paginationArgs?: PaginationArgs,
    @Args('sortArgs', { nullable: true }) sortArgs?: SortArgs,
    @Args('filterArgs', { nullable: true }) filterArgs?: FilterArgs
  ): Promise<ProductsFetchResponse> {
    return await this.productService.fetch(
      paginationArgs ? paginationArgs : { take: 12 },
      sortArgs
        ? sortArgs
        : { sortBy: SORT_OPTION.PRICE, sortDir: SORT_DIR.DESC },
      filterArgs
    )
  }

  @Query(() => Product)
  async product(@Args('id') id: string): Promise<Product> {
    return await this.productService.fetchOne(id)
  }

  @Query(() => [GroupedRamResponse])
  async groupedRam(): Promise<GroupedRamResponse[]> {
    return await this.productService.fetchRamOptions()
  }

  @Query(() => [GroupedStorageResponse])
  async groupedStorage(): Promise<GroupedStorageResponse[]> {
    return await this.productService.fetchStorageOptions()
  }

  @Query(() => [GroupedBrandResponse])
  async groupedBrand(): Promise<GroupedBrandResponse[]> {
    return await this.productService.fetchBrandOptions()
  }
}
