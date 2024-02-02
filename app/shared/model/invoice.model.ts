import { InputType, ObjectType } from '@nestjs/graphql'
import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm'
import { BaseEntity } from '@shared/model/base.model'
import { Order } from '@shared/model/order/order.model'
import { Address } from '@shared/model/address.model'
import { Card } from '@shared/model/credit-card.model'

@ObjectType()
@InputType('InvoiceInput')
@Entity()
export class Invoice extends BaseEntity {
  @Column({ type: 'timestamptz', nullable: true })
  paid?: Date | null

  @ManyToOne(() => Address, (address) => address.invoice, {
    eager: true,
    nullable: true,
  })
  @JoinColumn({
    foreignKeyConstraintName: 'FK__invoice__address',
  })
  billTo?: Address

  @ManyToOne(() => Card, (card) => card.invoice, {
    cascade: true,
    eager: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ foreignKeyConstraintName: 'FK__invoice__credit_card' })
  card?: Card

  @OneToOne(() => Order, (order) => order.invoice)
  order?: Order
}
