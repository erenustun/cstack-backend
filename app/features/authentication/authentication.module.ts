import { Module } from '@nestjs/common'
import { AuthenticationService } from '@shared/service/authentication.service'
import { AuthenticationResolver } from './authentication.resolver'
import { JwtModule } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'
import { UserModule } from '@feature/user/user.module'
import { LocalStrategy } from '@feature/authentication/guard/strategy/local.strategy'
import { JwtStrategy } from '@feature/authentication/guard/strategy/jwt.strategy'
import { ConfigModule } from '@nestjs/config'

@Module({
  imports: [
    ConfigModule,
    JwtModule.registerAsync({
      useFactory: async () => ({
        secret: process.env.JWT_SECRET,
        signOptions: {
          expiresIn: parseInt(process.env.TOKEN_EXPIRES_IN as string),
        },
      }),
    }),
    PassportModule,
    UserModule,
  ],
  providers: [
    AuthenticationService,
    AuthenticationResolver,
    LocalStrategy,
    JwtStrategy,
  ],
  exports: [AuthenticationService, JwtModule],
})
export class AuthenticationModule {}
