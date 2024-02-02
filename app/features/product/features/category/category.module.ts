import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { CategoryService } from '@shared/service/product/category.service'
import { CategoryResolver } from '@feature/product/features/category/category.resolver'
import { CategoryAdminResolver } from '@feature/product/features/category/category.resolver.admin'
import { ProductCategory } from '@shared/model/product/category.model'

@Module({
  imports: [TypeOrmModule.forFeature([ProductCategory])],
  providers: [CategoryService, CategoryResolver, CategoryAdminResolver],
  exports: [CategoryService],
})
export class CategoryModule {}
