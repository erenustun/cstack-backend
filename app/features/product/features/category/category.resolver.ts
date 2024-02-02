import { Query, Resolver } from '@nestjs/graphql'
import { CategoryService } from '@shared/service/product/category.service'
import { ProductCategory } from '@shared/model/product/category.model'

@Resolver(() => ProductCategory)
export class CategoryResolver {
  constructor(private readonly categoryService: CategoryService) {}
  @Query(() => [ProductCategory])
  async categories(): Promise<ProductCategory[]> {
    return await this.categoryService.fetch()
  }
}
