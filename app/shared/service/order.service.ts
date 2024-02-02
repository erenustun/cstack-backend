import {
  HttpException,
  HttpStatus,
  Injectable,
  OnModuleInit,
} from '@nestjs/common'
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm'
import { DataSource, Repository } from 'typeorm'
import {
  RECORD_NOT_FOUND,
  RECORD_NOT_SAVED,
  SPECIFY_SHIPPING_ADDRESS,
} from '@shared/constant/error.constant'
import { IUpdateResponse } from '@shared/dto/typeorm-result.dto'
import { ProductService } from '@shared/service/product/product.service'
import { ORDER_RELATIONS } from '@shared/constant/order/entity-relation.constant'
import { orderMock } from '@feature/order/mock/order.mock'
import { orderHasProductsMock } from '@feature/order/mock/order-has-product.mock'
import { AddressService } from '@shared/service/address.service'
import { InvoiceService } from '@shared/service/invoice.service'
import { CreditCardService } from '@shared/service/credit-card.service'
import { Order } from '@shared/model/order/order.model'
import { OrderHasProduct } from '@shared/model/order/order-has-product.model'
import { CreateOrderInput } from '@shared/dto/order/create-order.input'
import { User } from '@shared/model/user.model'

@Injectable()
export class OrderService implements OnModuleInit {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepo: Repository<Order>,
    @InjectRepository(OrderHasProduct)
    private readonly orderHasProductRepo: Repository<OrderHasProduct>,
    private addressService: AddressService,
    private productService: ProductService,
    private cardService: CreditCardService,
    private invoiceService: InvoiceService,
    @InjectDataSource()
    private dataSource: DataSource
  ) {}

  async onModuleInit(): Promise<void> {
    await this.cardService.mockCards()
    await this.invoiceService.mockInvoices()
    await this.mockOrders()
    await this.mockOrderProducts()
  }

  /**
   * Fetches all records
   * @param where If included, used sql where statement (javascript object syntax)
   */
  async fetch(where?: object): Promise<Order[]> {
    try {
      return await this.orderRepo.find({
        ...(where && { where }),
        relations: ORDER_RELATIONS,
        order: {
          created: 'DESC',
        },
      })
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  /**
   * Fetch record by identifier
   * @param id Record identifier to be fetched
   * @param where If included, used sql where statement (javascript object syntax)
   */
  async fetchOne(id: number, where?: object): Promise<Order> {
    try {
      let product
      if (id)
        product = await this.orderRepo.findOne({
          where: { id },
          relations: ORDER_RELATIONS,
        })
      if (where)
        product = await this.orderRepo.findOne({
          where: where,
          relations: ORDER_RELATIONS,
        })
      if (!product)
        throw new HttpException(RECORD_NOT_FOUND, HttpStatus.NOT_FOUND)

      return product
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  /**
   * Saves a record
   * @param order DTO
   * @param user Order belongs to user
   */
  async save(order: CreateOrderInput, user: User): Promise<Order> {
    try {
      const shipTo = await this.addressService.fetchOne({
        id: order.shipTo,
      })
      if (!order.shipTo)
        throw new HttpException(
          SPECIFY_SHIPPING_ADDRESS,
          HttpStatus.BAD_REQUEST
        )
      delete order.shipTo

      const savedOrder = await this.orderRepo.save({
        ...order,
        shipTo,
        user,
        products: [],
      })

      await Promise.all(
        order?.products?.map(async (_product) => {
          const { productId, quantity } = _product
          const foundProduct = await this.productService.fetchOne(productId)
          await this.orderHasProductRepo.save({
            quantity,
            order: savedOrder,
            product: foundProduct,
          })
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          savedOrder.products.push(foundProduct)
        })
      )
      await this.orderRepo.update(savedOrder.id, savedOrder)

      const orderSaved = await this.fetchOne(savedOrder.id)

      if (!orderSaved)
        throw new HttpException(RECORD_NOT_SAVED, HttpStatus.BAD_REQUEST, {
          cause: new Error(RECORD_NOT_SAVED),
        })

      return orderSaved
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  /**
   * Cancel an order
   */
  async cancel(id: number): Promise<IUpdateResponse> {
    try {
      const order = await this.orderRepo.findOne({ where: { id } })
      if (!order)
        throw new HttpException(RECORD_NOT_FOUND, HttpStatus.NOT_FOUND)

      return await this.orderRepo.update({ id }, { cancelled: new Date() })
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  /**
   * Inserts data into `order` table from `order.mock.ts`
   * Only inserts data upon empty table
   */
  async mockOrders(): Promise<any> {
    try {
      const orders = await this.orderRepo.find()
      if (orders.length === 0) {
        await this.dataSource
          .createQueryBuilder()
          .insert()
          .into(Order)
          .values(orderMock)
          .execute()
        return true
      }
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  /**
   * Inserts data into `order_has_product` table from `order-has-product.mock.ts`
   * Only inserts data upon empty table
   */
  async mockOrderProducts(): Promise<any> {
    try {
      const orderHasProducts = await this.orderHasProductRepo.find()
      if (orderHasProducts.length === 0) {
        await this.dataSource
          .createQueryBuilder()
          .insert()
          .into(OrderHasProduct)
          .values(orderHasProductsMock)
          .execute()
        return true
      }
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }
}
