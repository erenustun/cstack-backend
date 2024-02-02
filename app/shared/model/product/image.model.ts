import { InputType, ObjectType } from '@nestjs/graphql'
import { AfterLoad, Column, Entity, JoinColumn, ManyToOne } from 'typeorm'
import { BaseEntity } from '@shared/model/base.model'
import { Product } from '@shared/model/product/product.model'

@ObjectType()
@InputType('ProductImageInput')
@Entity()
export class ProductImage extends BaseEntity {
  @Column()
  url: string

  @ManyToOne(() => Product, (product) => product.image, { onDelete: 'CASCADE' })
  @JoinColumn({
    foreignKeyConstraintName: 'FK__image_product',
  })
  product?: Product

  @AfterLoad()
  formatUrl() {
    this.url = `http://${process.env.SERVER_HOST}:${process.env.SERVER_PORT}${this.url}`
  }
}
