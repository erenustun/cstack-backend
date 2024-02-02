import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { CreditCardService } from '@shared/service/credit-card.service'
import { CreditCardResolver } from '@feature/credit-card/credit-card.resolver'
import { Card } from '@shared/model/credit-card.model'

@Module({
  imports: [TypeOrmModule.forFeature([Card])],
  providers: [CreditCardService, CreditCardResolver],
  exports: [CreditCardService],
})
export class CreditCardModule {}
