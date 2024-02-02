import { Column, Entity, OneToMany } from 'typeorm'
import {
  HideField,
  InputType,
  ObjectType,
  registerEnumType,
} from '@nestjs/graphql'
import { Role } from '@shared/enum/user/role.enum'
import { BaseEntity } from '@shared/model/base.model'
import { ProductRating } from '@shared/model/product/rating.model'
import { Address } from '@shared/model/address.model'
import { Card } from '@shared/model/credit-card.model'
import { Order } from '@shared/model/order/order.model'

registerEnumType(Role, {
  name: 'Role',
})

@ObjectType()
@InputType('UserInput')
@Entity()
export class User extends BaseEntity {
  @Column({ type: 'varchar', length: 255, nullable: true })
  avatar?: string

  @Column({ type: 'varchar', length: 55 })
  firstName: string

  @Column({ type: 'varchar', length: 55 })
  lastName: string

  @Column({ type: 'varchar', length: 512, unique: true })
  email: string

  @HideField()
  @Column({ type: 'varchar', length: 128 })
  password: string

  @Column({
    type: 'enum',
    enum: Role,
    default: Role.CUSTOMER,
    nullable: true,
  })
  role?: Role

  @Column({ type: 'varchar', nullable: true, length: 16 })
  phone?: string

  @Column({ type: 'timestamptz', nullable: true })
  activated?: Date

  @Column({ type: 'text', unique: true, nullable: true })
  activationToken?: string | null

  @Column({ type: 'text', unique: true, nullable: true })
  passwordToken?: string | null

  @HideField()
  @Column({ type: 'timestamptz', nullable: true })
  passwordTokenCreated?: Date | null

  @Column({ type: 'text', unique: true, nullable: true })
  emailToken?: string | null

  @HideField()
  @Column({ type: 'timestamptz', nullable: true })
  emailTokenCreated?: Date | null

  @OneToMany(() => Address, (address) => address.user, { eager: true })
  address?: Address[]

  @OneToMany(() => Card, (creditCard) => creditCard.user, { eager: true })
  creditCards?: Card[]

  @OneToMany(() => Order, (order) => order.user)
  order?: Order[]

  @OneToMany(() => ProductRating, (rating) => rating.user)
  rating?: ProductRating[]
}
