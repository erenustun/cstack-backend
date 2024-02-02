import { Field, InputType, ObjectType } from '@nestjs/graphql'
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm'
import { formatExpirationDate } from '@shared/util/expiration-date.util'
import { Transform } from 'class-transformer'
import { BaseEntity } from '@shared/model/base.model'
import { Invoice } from '@shared/model/invoice.model'
import { User } from '@shared/model/user.model'

@ObjectType()
@InputType('CardInput')
@Entity()
export class Card extends BaseEntity {
  @Column()
  cardType: string

  @Column({ type: 'varchar', length: 16 })
  creditCardNumber: string

  @Column({ type: 'timestamptz' })
  expirationDate: Date

  @Field({ nullable: true })
  @Column({ nullable: true })
  @Transform(({ obj }) => formatExpirationDate(obj.expirationDate))
  expirationDateFormatted?: string

  @Column({ default: false, type: 'boolean' })
  main?: boolean

  @OneToMany(() => Invoice, (invoice) => invoice.card)
  invoice?: Invoice[]

  @ManyToOne(() => User, (user) => user.order, { nullable: true })
  @JoinColumn({
    foreignKeyConstraintName: 'FK__credit_card__user',
  })
  user?: User
}
