import { Field, InputType, Int, ObjectType } from '@nestjs/graphql'
import { Column, Entity, OneToMany } from 'typeorm'
import { BaseEntity } from '@shared/model/base.model'
import { Product } from '@shared/model/product/product.model'

@ObjectType()
@InputType('SpecificationInput')
@Entity()
export class ProductSpecification extends BaseEntity {
  @Field(() => Int)
  @Column()
  dataRam: number

  @Field(() => [Int])
  @Column('int', { array: true })
  dataStorage: number[]

  @Column({ type: 'float', nullable: true })
  dimensionDepth?: number

  @Column({ type: 'float', nullable: true })
  dimensionLength?: number

  @Column({ nullable: true })
  dimensionWeight?: number

  @Column({ type: 'float', nullable: true })
  dimensionWidth?: number

  @Column({ type: 'varchar', length: 2, default: 'mm' })
  dimensionUnit?: string

  @Field(() => Int, { nullable: true })
  @Column()
  batteryCapacity?: number

  @Field(() => Int, { nullable: true })
  @Column({ nullable: true })
  batteryChargingSpeed?: number

  @Field({ nullable: true })
  @Column({ type: 'float', nullable: true })
  batteryReverseCharging?: number

  @Column({ type: 'varchar', length: 12, nullable: true })
  batteryType?: string

  @Field(() => Int, { nullable: true })
  @Column({ nullable: true })
  batteryWirelessCharging?: number

  @Column({ nullable: true })
  connectAudio?: string

  @Column({ type: 'float', nullable: true })
  connectBluetoothVersion?: number

  @Column('text', { array: true, nullable: true })
  connectConnectivity?: string[]

  @Column({ nullable: true })
  connectMobileStandard?: string

  @Column({ nullable: true })
  connectUsb?: string

  @Column({ nullable: true })
  connectWifiStandard?: string

  @Field(() => Int, { nullable: true })
  @Column()
  cpuCores?: number

  @Column('float', { array: true, nullable: true })
  cpuFrequency?: number[]

  @Column({ nullable: true })
  cpuName?: string

  @Column({ nullable: true })
  displayAspectRatio?: string

  @Field(() => Int, { nullable: true })
  @Column({ nullable: true })
  displayPixelDensity?: number

  @Field(() => Int, { nullable: true })
  @Column({ nullable: true })
  displayRefreshRate?: number

  @Column({ nullable: true })
  displayResolution?: string

  @Column({ type: 'numeric', precision: 3, scale: 1, nullable: true })
  displayScreenToBody?: number

  @Column({ type: 'numeric', precision: 3, scale: 1, nullable: true })
  displaySize: number

  @OneToMany(() => Product, (product) => product.specification)
  product?: Product
}
