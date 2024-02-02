import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { OrderService } from '@shared/service/order.service'
import { OrderResolver } from '@feature/order/order.resolver'
import { UserModule } from '@feature/user/user.module'
import { ProductModule } from '@feature/product/product.module'
import { AddressModule } from '@feature/address/address.module'
import { InvoiceModule } from '@feature/invoice/invoice.module'
import { CreditCardModule } from '@feature/credit-card/credit-card.module'
import { OrderHasProduct } from '@shared/model/order/order-has-product.model'
import { Order } from '@shared/model/order/order.model'

@Module({
  imports: [
    AddressModule,
    CreditCardModule,
    InvoiceModule,
    ProductModule,
    UserModule,
    TypeOrmModule.forFeature([Order, OrderHasProduct]),
  ],
  providers: [OrderService, OrderResolver],
})
export class OrderModule {}
