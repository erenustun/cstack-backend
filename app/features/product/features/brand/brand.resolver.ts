import { Query, Resolver } from '@nestjs/graphql'
import { BrandService } from '@shared/service/product/brand.service'
import { ProductBrand } from '@shared/model/product/brand.model'

@Resolver(() => ProductBrand)
export class BrandResolver {
  constructor(private readonly brandService: BrandService) {}
  @Query(() => [ProductBrand])
  async brands(): Promise<ProductBrand[]> {
    return await this.brandService.fetch()
  }
}
