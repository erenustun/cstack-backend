import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { UserService } from '@shared/service/user.service'
import { UserResolver } from '@feature/user/user.resolver'
import { UserAdminResolver } from '@feature/user/user.resolver.admin'
import { User } from '@shared/model/user.model'

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [UserService, UserResolver, UserAdminResolver],
  exports: [UserService],
})
export class UserModule {}
