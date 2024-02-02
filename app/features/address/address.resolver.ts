import { UseGuards } from '@nestjs/common'
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'
import { CurrentUser } from '@shared/decorator/current-user.decorator'
import { HasRoles } from '@shared/decorator/role.decorator'
import {
  IDeleteResponse,
  IUpdateResponse,
} from '@shared/dto/typeorm-result.dto'
import { AddressService } from '@shared/service/address.service'
import { JwtAuthGuard } from '@feature/authentication/guard/jwt-auth.guard'
import { RoleGuard } from '@feature/authentication/guard/role.guard'
import { Role } from '@shared/enum/user/role.enum'
import { Address } from '@shared/model/address.model'
import { AddressFilterArgs } from '@shared/dto/address/filter.args'
import { User } from '@shared/model/user.model'
import { CreateAddressInput } from '@shared/dto/address/create-address.input'
import { UpdateAddressInput } from '@shared/dto/address/update-address.input'

@Resolver(() => Address)
export class AddressResolver {
  constructor(private readonly addressService: AddressService) {}

  @Query(() => [Address])
  @UseGuards(JwtAuthGuard, RoleGuard)
  @HasRoles(Role.CUSTOMER)
  async addresses(
    @CurrentUser() user: User,
    @Args('filterArgs', { nullable: true }) filterArgs?: AddressFilterArgs
  ): Promise<Address[]> {
    return await this.addressService.fetch({
      userId: user.id,
      type: filterArgs?.type && filterArgs?.type,
      primary: filterArgs?.primary && filterArgs?.primary,
    })
  }

  @Query(() => Address)
  @UseGuards(JwtAuthGuard, RoleGuard)
  @HasRoles(Role.CUSTOMER)
  async address(
    @CurrentUser() user: User,
    @Args('id') addressId: string,
    @Args('filterArgs', { nullable: true }) filterArgs?: AddressFilterArgs
  ): Promise<Address> {
    return await this.addressService.fetchOne({
      id: addressId,
      user: { id: user.id },
      type: filterArgs?.type && filterArgs?.type,
      primary: filterArgs?.primary && filterArgs?.primary,
    })
  }

  @Mutation(() => Address)
  @UseGuards(JwtAuthGuard, RoleGuard)
  @HasRoles(Role.CUSTOMER)
  async createAddress(
    @CurrentUser() user: User,
    @Args('data') address: CreateAddressInput
  ): Promise<Address> {
    return await this.addressService.save({ ...address, user })
  }

  @Mutation(() => IUpdateResponse)
  @UseGuards(JwtAuthGuard, RoleGuard)
  @HasRoles(Role.CUSTOMER)
  async swapPrimaryAddress(
    @CurrentUser() user: User,
    @Args('addressId') addressId: string
  ): Promise<IUpdateResponse> {
    return await this.addressService.swapPrimary(addressId, user.id as string)
  }

  @Mutation(() => IUpdateResponse)
  @UseGuards(JwtAuthGuard, RoleGuard)
  @HasRoles(Role.CUSTOMER)
  async updateCustomerAddress(
    @Args('id', { type: () => String }) id: string,
    @Args('data') address: UpdateAddressInput
  ): Promise<IUpdateResponse> {
    return await this.addressService.update(id, address)
  }

  @Mutation(() => IDeleteResponse)
  @UseGuards(JwtAuthGuard, RoleGuard)
  @HasRoles(Role.CUSTOMER)
  async deleteAddress(
    @Args('id', { type: () => String }) id: string
  ): Promise<IDeleteResponse> {
    return await this.addressService.delete(id)
  }
}
