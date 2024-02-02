import { Module } from '@nestjs/common'
import { InvoiceService } from '@shared/service/invoice.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Invoice } from '@shared/model/invoice.model'

@Module({
  imports: [TypeOrmModule.forFeature([Invoice])],
  providers: [InvoiceService],
  exports: [InvoiceService],
})
export class InvoiceModule {}
