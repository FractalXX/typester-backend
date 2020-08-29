import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { ConfigService, ConfigModule } from '@nestjs/config';

// TODO localize emails
@Module({
  imports: [
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const user = configService.get('mailer.user');
        const domain = configService.get('mailer.domain');
        const password = configService.get('mailer.password');
        const from = configService.get('mailer.from');
        return {
          transport: `smtps://${user}@${domain}:${password}@smtp.${domain}`,
          defaults: {
            from,
          },
          template: {
            dir: __dirname + '/templates/pages',
            adapter: new HandlebarsAdapter(),
            options: {
              strict: true,
            },
          },
          options: {
            partials: {
              dir: __dirname + '/templates/partials',
              options: {
                strict: true,
              },
            }
          }
        };
      },
      inject: [ConfigService],
    }),
  ],
  exports: [MailerModule],
})
export class MailModule { }
