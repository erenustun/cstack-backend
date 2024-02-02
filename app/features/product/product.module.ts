import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ProductService } from '@shared/service/product/product.service'
import { ProductResolver } from './product.resolver'
import { BrandModule } from '@feature/product/features/brand/brand.module'
import { CategoryModule } from '@feature/product/features/category/category.module'
import { RatingModule } from '@feature/product/features/rating/rating.module'
import { ProductAdminResolver } from '@feature/product/product.resolver.admin'
import { Product } from '@shared/model/product/product.model'
import { ProductImage } from '@shared/model/product/image.model'
import { ProductSpecification } from '@shared/model/product/specification.model'

@Module({
  imports: [
    BrandModule,
    CategoryModule,
    TypeOrmModule.forFeature([Product, ProductImage, ProductSpecification]),
    RatingModule,
  ],
  providers: [ProductService, ProductResolver, ProductAdminResolver],
  exports: [ProductService],
})
export class ProductModule {}
