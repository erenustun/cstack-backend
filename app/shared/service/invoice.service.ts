import {
  HttpException,
  HttpStatus,
  Injectable,
  OnModuleInit,
} from '@nestjs/common'
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm'
import { DataSource, Repository } from 'typeorm'
import { invoiceMock } from '@feature/invoice/invoice.mock'
import { Invoice } from '@shared/model/invoice.model'

@Injectable()
export class InvoiceService implements OnModuleInit {
  constructor(
    @InjectRepository(Invoice)
    private readonly paymentRepo: Repository<Invoice>,
    @InjectDataSource()
    private dataSource: DataSource
  ) {}

  async onModuleInit(): Promise<void> {
    //await this.mockInvoices()
  }

  /**
   * Inserts data into `invoice` table from `invoice.mock.ts`
   * Only inserts data upon empty table
   */
  async mockInvoices(): Promise<any> {
    try {
      const invoices = await this.paymentRepo.find()
      if (invoices.length === 0) {
        await this.dataSource
          .createQueryBuilder()
          .insert()
          .into(Invoice)
          .values(invoiceMock)
          .execute()
        return true
      }
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }
}
