import { Module } from '@nestjs/common'
import { EmailService } from '@shared/service/email.service'
import { join } from 'path'
import { MailerModule } from '@nestjs-modules/mailer'
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter'
import { ConfigModule } from '@nestjs/config'

@Module({
  imports: [
    ConfigModule,
    MailerModule.forRootAsync({
      useFactory: async () => ({
        transport: {
          sender: process.env.SMTP_USERNAME,
          host: process.env.SMTP_HOST,
          port: Number(process.env.SMTP_PORT_TLS),
          secure: false, // TLS requires secureConnection to be false
          tls: {
            ciphers: 'SSLv3',
          },
          auth: {
            user: process.env.SMTP_USERNAME,
            pass: process.env.SMTP_PASSWORD,
          },
        },
        defaults: {
          from: `DigiPlus <${process.env.SMTP_USERNAME}>`,
        },
        template: {
          dir: join(__dirname, 'template'),
          adapter: new HandlebarsAdapter(),
          options: {
            strict: false,
          },
        },
      }),
    }),
  ],
  providers: [EmailService],
  exports: [EmailService],
})
export class EmailModule {}
