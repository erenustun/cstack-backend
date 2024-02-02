import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AddressResolver } from '@feature/address/address.resolver'
import { AddressService } from '@shared/service/address.service'
import { AddressAdminResolver } from '@feature/address/address.resolver.admin'
import { Address } from '@shared/model/address.model'

@Module({
  imports: [TypeOrmModule.forFeature([Address])],
  providers: [AddressService, AddressResolver, AddressAdminResolver],
  exports: [AddressService],
})
export class AddressModule {}
