import { UseGuards } from '@nestjs/common'
import { Args, Mutation, Resolver } from '@nestjs/graphql'
import { HasRoles } from '@shared/decorator/role.decorator'
import { IUpdateResponse } from '@shared/dto/typeorm-result.dto'
import { AddressService } from '@shared/service/address.service'
import { JwtAuthGuard } from '@feature/authentication/guard/jwt-auth.guard'
import { RoleGuard } from '@feature/authentication/guard/role.guard'
import { Role } from '@shared/enum/user/role.enum'
import { Address } from '@shared/model/address.model'
import { UpdateAddressInput } from '@shared/dto/address/update-address.input'

@Resolver(() => Address)
export class AddressAdminResolver {
  constructor(private readonly addressService: AddressService) {}

  @Mutation(() => IUpdateResponse)
  @UseGuards(JwtAuthGuard, RoleGuard)
  @HasRoles(Role.ADMIN)
  async updateAddress(
    @Args('id', { type: () => String }) id: string,
    @Args('data') address: UpdateAddressInput
  ): Promise<IUpdateResponse> {
    return await this.addressService.update(id, address)
  }

  @Mutation(() => IUpdateResponse)
  @UseGuards(JwtAuthGuard, RoleGuard)
  @HasRoles(Role.ADMIN)
  async restoreAddress(
    @Args('id', { type: () => String }) id: string
  ): Promise<IUpdateResponse> {
    return await this.addressService.restore(id)
  }
}
