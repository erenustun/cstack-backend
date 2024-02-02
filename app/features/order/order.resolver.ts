import { UseGuards } from '@nestjs/common'
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'
import { CurrentUser } from '@shared/decorator/current-user.decorator'
import { HasRoles } from '@shared/decorator/role.decorator'
import { IUpdateResponse } from '@shared/dto/typeorm-result.dto'
import { RoleGuard } from '@feature/authentication/guard/role.guard'
import { JwtAuthGuard } from '@feature/authentication/guard/jwt-auth.guard'
import { Role } from '@shared/enum/user/role.enum'
import { OrderService } from '@shared/service/order.service'
import { UserService } from '@shared/service/user.service'
import { User } from '@shared/model/user.model'
import { Order } from '@shared/model/order/order.model'
import { CreateOrderInput } from '@shared/dto/order/create-order.input'

@Resolver()
export class OrderResolver {
  constructor(
    private readonly orderService: OrderService,
    private userService: UserService
  ) {}

  @Query(() => [Order])
  @UseGuards(JwtAuthGuard, RoleGuard)
  @HasRoles(Role.CUSTOMER)
  async currentOrders(@CurrentUser() currentUser: User): Promise<Order[]> {
    return await this.orderService.fetch({ user: { id: currentUser.id } })
  }

  @Query(() => Order)
  @UseGuards(JwtAuthGuard, RoleGuard)
  @HasRoles(Role.CUSTOMER)
  async order(@Args('id') id: number): Promise<Order> {
    return await this.orderService.fetchOne(id)
  }

  @Mutation(() => Order)
  @UseGuards(JwtAuthGuard, RoleGuard)
  @HasRoles(Role.CUSTOMER)
  async createOrder(
    @CurrentUser() currentUser: User,
    @Args('data') order: CreateOrderInput
  ): Promise<Order> {
    const user = await this.userService.fetchOne({
      id: currentUser.id as string,
    })
    return await this.orderService.save(order, user as User)
  }

  @Mutation(() => IUpdateResponse)
  @UseGuards(JwtAuthGuard, RoleGuard)
  @HasRoles(Role.CUSTOMER)
  async cancelOrder(@Args('id') id: number): Promise<IUpdateResponse> {
    return await this.orderService.cancel(id)
  }
}
