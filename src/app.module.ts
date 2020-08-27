import { Module, NestModule, MiddlewareConsumer, RequestMethod, Logger, ValidationPipe } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { SharedModule } from './shared/shared.module';
import appConfig from './app.config';
import { LoggerMiddleware } from './shared/middlewares/logger.middleware';
import { APP_INTERCEPTOR, APP_FILTER, APP_PIPE } from '@nestjs/core';
import { LoggerInterceptor } from './shared/interceptors/logger.interceptor';
import { HttpExceptionFilter } from './shared/filters/http-exception.filter';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [appConfig],
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        user: configService.get('database.user'),
        pass: configService.get('database.password'),
        uri: `mongodb+srv://${configService.get('database.host')}/${configService.get('database.name')}`,
      }),
      inject: [ConfigService],
    }),
    SharedModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    Logger,
    {
      provide: APP_PIPE,
      useClass: ValidationPipe,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggerInterceptor,
    },
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes({
        path: '*', method: RequestMethod.ALL,
      });
  }
}
