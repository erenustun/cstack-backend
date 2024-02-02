import { Field, InputType, ObjectType, registerEnumType } from '@nestjs/graphql'
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm'
import { Country } from '@shared/enum/address/country-iso3166.enum'
import { AddressType } from '@shared/enum/address/address-type.enum'
import { BaseEntity } from '@shared/model/base.model'
import { Order } from '@shared/model/order/order.model'
import { Invoice } from '@shared/model/invoice.model'
import { User } from '@shared/model/user.model'

registerEnumType(AddressType, {
  name: 'AddressType',
})

registerEnumType(Country, {
  name: 'Country',
})

@ObjectType()
@InputType('AddressInput')
@Entity()
export class Address extends BaseEntity {
  @Column({ type: 'varchar', length: 7 })
  title?: string

  @Column({ type: 'varchar', length: 64 })
  firstName: string

  @Column({ type: 'varchar', length: 64 })
  lastName: string

  @Column({ nullable: true, type: 'varchar', length: 64 })
  companyName?: string

  @Column({ length: 255 })
  line1: string

  @Column({ length: 10 })
  zipCode: string

  @Column({ length: 55 })
  state: string

  @Column({ nullable: true, length: 16 })
  phone?: string

  @Column({
    type: 'enum',
    enum: Country,
    nullable: false,
  })
  countryCode: Country

  @Column({ default: false, type: 'boolean' })
  primary?: boolean

  @Column({
    type: 'enum',
    enum: AddressType,
    nullable: false,
  })
  type: AddressType

  @OneToMany(() => Order, (order) => order.deliverTo)
  order?: Order[]

  @OneToMany(() => Invoice, (invoice) => invoice.billTo)
  invoice?: Invoice[]

  @Field(() => User, { nullable: true })
  @ManyToOne(() => User, (user: User) => user.address, { onDelete: 'SET NULL' })
  @JoinColumn({
    foreignKeyConstraintName: 'FK__address__user',
  })
  user?: User
}
