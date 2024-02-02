import { Args, Mutation, Resolver } from '@nestjs/graphql'
import { BrandService } from '@shared/service/product/brand.service'
import { UseGuards } from '@nestjs/common'
import { JwtAuthGuard } from '@feature/authentication/guard/jwt-auth.guard'
import { RoleGuard } from '@feature/authentication/guard/role.guard'
import { HasRoles } from '@shared/decorator/role.decorator'
import { Role } from '@shared/enum/user/role.enum'
import {
  IDeleteResponse,
  IUpdateResponse,
} from '@shared/dto/typeorm-result.dto'
import { ProductBrand } from '@shared/model/product/brand.model'

@Resolver(() => ProductBrand)
export class BrandAdminResolver {
  constructor(private readonly brandService: BrandService) {}

  @Mutation(() => ProductBrand)
  @UseGuards(JwtAuthGuard, RoleGuard)
  @HasRoles(Role.ADMIN)
  async createBrand(@Args('name') name: string): Promise<ProductBrand> {
    return this.brandService.save(name)
  }

  @Mutation(() => IUpdateResponse)
  @UseGuards(JwtAuthGuard, RoleGuard)
  @HasRoles(Role.ADMIN)
  async updateBrand(
    @Args('id') id: string,
    @Args('name') name: string
  ): Promise<IUpdateResponse> {
    return this.brandService.update(id, name)
  }

  @Mutation(() => IDeleteResponse)
  @UseGuards(JwtAuthGuard, RoleGuard)
  @HasRoles(Role.ADMIN)
  async deleteBrand(@Args('id') id: string): Promise<IDeleteResponse> {
    return await this.brandService.delete(id)
  }

  @Mutation(() => IUpdateResponse)
  @UseGuards(JwtAuthGuard, RoleGuard)
  @HasRoles(Role.ADMIN)
  async restoreBrand(@Args('id') id: string): Promise<IUpdateResponse> {
    return await this.brandService.restore(id)
  }
}
