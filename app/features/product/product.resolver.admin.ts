import { Args, Mutation, Resolver } from '@nestjs/graphql'
import { ProductService } from '@shared/service/product/product.service'
import { RoleGuard } from '@feature/authentication/guard/role.guard'
import { JwtAuthGuard } from '@feature/authentication/guard/jwt-auth.guard'
import { Role } from '@shared/enum/user/role.enum'
import { HasRoles } from '@shared/decorator/role.decorator'
import { UseGuards } from '@nestjs/common'
import {
  IDeleteResponse,
  IUpdateResponse,
} from '@shared/dto/typeorm-result.dto'
import { Product } from '@shared/model/product/product.model'
import { CreateProductInput } from '@shared/dto/product/create-product.input'
import { UpdateProductInput } from '@shared/dto/product/update-product.input'

@Resolver(() => Product)
export class ProductAdminResolver {
  constructor(private readonly productService: ProductService) {}

  @Mutation(() => Product)
  @UseGuards(JwtAuthGuard, RoleGuard)
  @HasRoles(Role.ADMIN)
  async createProduct(
    @Args('data') product: CreateProductInput
  ): Promise<Product> {
    return this.productService.save(product)
  }

  @Mutation(() => IUpdateResponse)
  @UseGuards(JwtAuthGuard, RoleGuard)
  @HasRoles(Role.ADMIN)
  async updateProduct(
    @Args('id') id: string,
    @Args('data') product: UpdateProductInput
  ): Promise<IUpdateResponse> {
    return this.productService.update(id, product)
  }

  @Mutation(() => IDeleteResponse)
  @UseGuards(JwtAuthGuard, RoleGuard)
  @HasRoles(Role.ADMIN)
  async deleteProduct(@Args('id') id: string): Promise<IDeleteResponse> {
    return await this.productService.delete(id)
  }

  @Mutation(() => IUpdateResponse)
  @UseGuards(JwtAuthGuard, RoleGuard)
  @HasRoles(Role.ADMIN)
  async restoreProduct(@Args('id') id: string): Promise<IUpdateResponse> {
    return await this.productService.restore(id)
  }
}
