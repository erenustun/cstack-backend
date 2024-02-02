import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm'
import { Field, InputType, Int, ObjectType } from '@nestjs/graphql'
import { BaseEntity } from '../base.model'
import { ProductBrand } from '@shared/model/product/brand.model'
import { ProductCategory } from '@shared/model/product/category.model'
import { ProductImage } from '@shared/model/product/image.model'
import { OrderHasProduct } from '@shared/model/order/order-has-product.model'
import { ProductRating } from '@shared/model/product/rating.model'
import { ProductSpecification } from '@shared/model/product/specification.model'
import { FetchResponse } from '@shared/dto/product/fetch-response.entity'

@ObjectType()
@InputType('ProductInput')
@Entity()
export class Product extends BaseEntity {
  @Column({ nullable: true, length: 1600 })
  description?: string

  @Column({ type: 'float', nullable: true })
  discount?: number

  @Column()
  name: string

  @Column({ nullable: true })
  osUpgradable?: string

  @Column({ type: 'float' })
  price: number

  ratingAverage?: number

  @Column({ type: 'varchar', length: 32 })
  sku: string

  @Column()
  @Field(() => Int)
  stock: number

  @Column({ nullable: true })
  thumbnail?: string

  @Column({ default: 24 })
  @Field(() => Int)
  warranty?: number

  @ManyToOne(() => ProductBrand, (brand) => brand.product, {
    eager: true,
    cascade: true,
  })
  @JoinColumn({
    foreignKeyConstraintName: 'FK__product__brand',
  })
  brand: ProductBrand

  @ManyToOne(() => ProductCategory, (category) => category.product, {
    eager: true,
    cascade: true,
  })
  @JoinColumn({
    foreignKeyConstraintName: 'FK__product__category',
  })
  category: ProductCategory

  @OneToMany(() => ProductImage, (image) => image.product, {
    eager: true,
    cascade: true,
    onDelete: 'CASCADE',
  })
  image?: ProductImage[]

  @OneToMany(
    () => OrderHasProduct,
    (orderHasProduct) => orderHasProduct.product
  )
  order?: OrderHasProduct[]

  @OneToMany(() => ProductRating, (rating) => rating.product)
  rating?: ProductRating[]

  @ManyToOne(
    () => ProductSpecification,
    (specification) => specification.product,
    {
      cascade: true,
    }
  )
  @JoinColumn({
    foreignKeyConstraintName: 'FK__product__specification',
  })
  specification: ProductSpecification
}

@ObjectType()
@InputType('ProductsFetchResponseInput')
export class ProductsFetchResponse extends FetchResponse(Product) {}

@ObjectType()
export class GroupedRamResponse {
  label: string
  @Field(() => Int)
  value: number
}

@ObjectType()
export class GroupedStorageResponse {
  label: string
  @Field(() => Int)
  value: number
}

@ObjectType()
export class GroupedBrandResponse {
  label: string
}
