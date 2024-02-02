import {
  HttpException,
  HttpStatus,
  Injectable,
  OnModuleInit,
} from '@nestjs/common'
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm'
import { DataSource, Repository } from 'typeorm'

import { RECORD_NOT_FOUND } from '@shared/constant/error.constant'
import {
  IDeleteResponse,
  IUpdateResponse,
} from '@shared/dto/typeorm-result.dto'
import { ADDRESS_RELATIONS } from '@shared/constant/address/entity-relation.constant'
import { addressMock } from '@feature/address/mock/address.mock'
import { Address } from '@shared/model/address.model'
import { AddressFilterArgs } from '@shared/dto/address/filter.args'
import { CreateAddressInput } from '@shared/dto/address/create-address.input'
import { UpdateAddressInput } from '@shared/dto/address/update-address.input'

@Injectable()
export class AddressService implements OnModuleInit {
  constructor(
    @InjectRepository(Address)
    private readonly addressRepo: Repository<Address>,
    @InjectDataSource()
    private dataSource: DataSource
  ) {}

  async onModuleInit(): Promise<void> {
    await this.mockAddresses()
  }

  /**
   * Fetches all records
   * @param filter Data can be filtered by type and primary status
   */
  async fetch(filter?: AddressFilterArgs): Promise<Address[]> {
    try {
      // base query
      const query = await this.addressRepo.createQueryBuilder('address')

      // relationships
      query.leftJoinAndSelect('address.user', 'user')

      // filter
      filter?.primary &&
        query.andWhere('address.primary = :primary', {
          primary: filter.primary,
        })
      filter?.type &&
        query.andWhere('address.type = :type', { type: filter.type })
      filter?.userId &&
        query.andWhere('user.id = :userId', { userId: filter.userId })

      //const count = await query.getCount()
      return await query.getMany()
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  /**
   * Fetch record by identifier
   * @param condition If included, used sql where statement (javascript object syntax)
   */
  async fetchOne(condition?: object): Promise<Address> {
    try {
      const address = await this.addressRepo.findOne({
        where: condition,
        relations: ADDRESS_RELATIONS,
      })

      if (!address)
        throw new HttpException(RECORD_NOT_FOUND, HttpStatus.NOT_FOUND)

      return address
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  async swapPrimary(
    addressId: string,
    userId: string
  ): Promise<IUpdateResponse> {
    try {
      const oldPrimaryAddress = await this.addressRepo.findOne({
        where: { user: { id: userId }, primary: true },
        relations: ADDRESS_RELATIONS,
      })
      if (oldPrimaryAddress)
        await this.update(oldPrimaryAddress.id as string, {
          ...oldPrimaryAddress,
          primary: false,
        })

      const newPrimaryAddress = await this.addressRepo.findOne({
        where: { id: addressId },
        relations: ADDRESS_RELATIONS,
      })
      return await this.update(newPrimaryAddress?.id as string, {
        ...newPrimaryAddress,
        primary: true,
      })
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  /**
   * Saves a record
   * @param address DTO
   */
  async save(address: CreateAddressInput): Promise<Address> {
    try {
      return await this.addressRepo.save(address)
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }
  /**
   * Updates record by id
   * @param id  Record id to be updated
   * @param address DTO
   */
  async update(
    id: string,
    address: UpdateAddressInput
  ): Promise<IUpdateResponse> {
    try {
      return await this.addressRepo.update(id, address)
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  /**
   * Deletes a record by id
   * @param id Record id to be soft deleted
   */
  async delete(id: string): Promise<IDeleteResponse> {
    try {
      return await this.addressRepo.softDelete(id)
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  /**
   * Restores a record by id
   * @param id Record id to be restored
   */
  async restore(id: string): Promise<IUpdateResponse> {
    try {
      const addressRestored = await this.addressRepo.restore(id)
      if (!addressRestored)
        throw new HttpException(RECORD_NOT_FOUND, HttpStatus.NOT_FOUND)

      return addressRestored
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  /**
   * Inserts data into Address table from `address.mock.ts`
   * Won't insert if data is found in table
   */
  async mockAddresses(): Promise<any> {
    try {
      const addresses = await this.addressRepo.find()
      if (addresses.length === 0) {
        return await this.dataSource
          .createQueryBuilder()
          .insert()
          .into(Address)
          .values(addressMock)
          .execute()
      }
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }
}
