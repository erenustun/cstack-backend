import {
  CreateDateColumn,
  DeleteDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'
import { ObjectType } from '@nestjs/graphql'

@ObjectType()
export class BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id?: string

  @CreateDateColumn()
  created?: Date

  @UpdateDateColumn({ nullable: true })
  updated?: Date

  @DeleteDateColumn({ nullable: true })
  deleted?: Date
}
