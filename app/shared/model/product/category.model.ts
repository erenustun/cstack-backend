import { InputType, ObjectType } from '@nestjs/graphql'
import { Column, Entity, OneToMany } from 'typeorm'
import { BaseEntity } from '@shared/model/base.model'
import { Product } from '@shared/model/product/product.model'

@ObjectType()
@InputType('CategoryInput')
@Entity()
export class ProductCategory extends BaseEntity {
  @Column()
  name: string

  @OneToMany(() => Product, (product) => product.category)
  product?: Product
}
