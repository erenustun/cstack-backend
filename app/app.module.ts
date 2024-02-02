import 'reflect-metadata'

import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { DatabaseConfig } from '@config/database.config'
import { ConfigModule } from '@nestjs/config'
import { ProductModule } from '@feature/product/product.module'
import { join } from 'path'
import { GraphQLModule } from '@nestjs/graphql'
import { ApolloDriver } from '@nestjs/apollo'
import { UserModule } from '@feature/user/user.module'
import { EmailModule } from '@feature/email/email.module'
import { AuthenticationModule } from '@feature/authentication/authentication.module'
import { OrderModule } from '@feature/order/order.module'
import { BrandModule } from '@feature/product/features/brand/brand.module'
import { CategoryModule } from '@feature/product/features/category/category.module'
import { RatingModule } from '@feature/product/features/rating/rating.module'
import { AddressModule } from '@feature/address/address.module'
import { CreditCardModule } from '@feature/credit-card/credit-card.module'
import { ServeStaticModule } from '@nestjs/serve-static'
import { InvoiceModule } from '@feature/invoice/invoice.module'

@Module({
  imports: [
    UserModule,
    CreditCardModule,
    InvoiceModule,
    AddressModule,
    AuthenticationModule,
    BrandModule,
    CategoryModule,
    ConfigModule.forRoot({ isGlobal: true }),
    GraphQLModule.forRoot({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd() + '/app/schema.graphql'),
      sortSchema: true,
      playground: true,
      introspection: true,
      cors: {
        origin: '*',
        credentials: true,
      },
    }),
    EmailModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'static'),
      serveStaticOptions: {
        index: false,
      },
    }),
    ProductModule,
    OrderModule,
    RatingModule,
    TypeOrmModule.forRootAsync({
      useClass: DatabaseConfig,
    }),
  ],
})
export class AppModule {}
