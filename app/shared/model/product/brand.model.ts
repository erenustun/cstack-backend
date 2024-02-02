import { InputType, ObjectType } from '@nestjs/graphql'
import { Column, Entity, OneToMany } from 'typeorm'
import { BaseEntity } from '@shared/model/base.model'
import { Product } from '@shared/model/product/product.model'

@ObjectType()
@InputType('BrandInput')
@Entity()
export class ProductBrand extends BaseEntity {
  @Column()
  name: string

  @OneToMany(() => Product, (product) => product.brand)
  product?: Product
}
