import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { BrandService } from '@shared/service/product/brand.service'
import { BrandResolver } from '@feature/product/features/brand/brand.resolver'
import { BrandAdminResolver } from '@feature/product/features/brand/brand.resolver.admin'
import { ProductBrand } from '@shared/model/product/brand.model'

@Module({
  imports: [TypeOrmModule.forFeature([ProductBrand])],
  providers: [BrandService, BrandResolver, BrandAdminResolver],
  exports: [BrandService],
})
export class BrandModule {}
