import {
  HttpException,
  HttpStatus,
  Injectable,
  OnModuleInit,
} from '@nestjs/common'
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm'
import { DataSource, Repository } from 'typeorm'
import { creditCardMock } from '@feature/credit-card/credit-card.mock'
import { IDeleteResponse } from '@shared/dto/typeorm-result.dto'
import { CREDIT_CARD_RELATIONS } from '@shared/constant/credit-card/entity-relation.constant'
import { Card } from '@shared/model/credit-card.model'
import { CreateCreditCardInput } from '@shared/dto/credit-card/create-credit-card.input'

@Injectable()
export class CreditCardService implements OnModuleInit {
  constructor(
    @InjectRepository(Card)
    private readonly creditCardRepo: Repository<Card>,
    @InjectDataSource()
    private dataSource: DataSource
  ) {}

  async onModuleInit(): Promise<void> {
    //await this.mockCards()
  }

  /**
   * Fetches all records
   * @param where If included, used sql where statement (javascript object syntax)
   */
  async fetch(where?: object): Promise<Card[]> {
    try {
      return await this.creditCardRepo.find({
        ...(where && { where }),
        relations: CREDIT_CARD_RELATIONS,
      })
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  /**
   * Saves a record
   * @param creditCard DTO
   * @param userId User id the card belongs to
   */
  async save(creditCard: CreateCreditCardInput, userId: string): Promise<Card> {
    try {
      return await this.creditCardRepo.save({
        ...creditCard,
        user: { id: userId },
      })
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
      return await this.creditCardRepo.softDelete(id)
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  /**
   * Inserts data into Address table from `credit-card.mock.ts`
   * Won't insert if data is found in table
   */
  async mockCards(): Promise<any> {
    try {
      const cards = await this.creditCardRepo.find()
      if (cards.length === 0) {
        return await this.dataSource
          .createQueryBuilder()
          .insert()
          .into(Card)
          .values(creditCardMock)
          .execute()
      }
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }
}
