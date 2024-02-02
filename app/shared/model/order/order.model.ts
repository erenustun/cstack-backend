import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm'
import { Field, InputType, ObjectType } from '@nestjs/graphql'
import { Invoice } from '@shared/model/invoice.model'
import { OrderHasProduct } from '@shared/model/order/order-has-product.model'
import { Address } from '@shared/model/address.model'
import { User } from '@shared/model/user.model'

@ObjectType()
@InputType('OrderInput')
@Entity()
export class Order {
  @PrimaryColumn()
  id: number

  @Column()
  total: number

  @Column({ default: true })
  pending: boolean

  @Column({ type: 'timestamptz', nullable: true })
  cancelled?: Date | null

  @Column({ type: 'timestamptz', nullable: true })
  shipped?: Date | null

  @OneToOne(() => Invoice, (invoice) => invoice.order)
  @JoinColumn({ foreignKeyConstraintName: 'FK__order__invoice' })
  invoice?: Invoice

  @Field(() => [OrderHasProduct])
  @OneToMany(
    () => OrderHasProduct,
    (orderHasProducts) => orderHasProducts.order
  )
  products: OrderHasProduct[]

  @ManyToOne(() => Address, (address) => address.id, { eager: true })
  @JoinColumn({
    foreignKeyConstraintName: 'FK__order__address',
  })
  deliverTo?: Address

  @ManyToOne(() => User, (user) => user.order, { nullable: true })
  @JoinColumn({
    foreignKeyConstraintName: 'FK__order__user',
  })
  user?: User | null

  @CreateDateColumn()
  created?: Date

  @UpdateDateColumn({ nullable: true })
  updated?: Date

  @DeleteDateColumn({ nullable: true })
  deleted?: Date
}
