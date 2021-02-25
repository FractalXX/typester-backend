import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('auth.jwtSecretKey'),
        signOptions: {
          expiresIn: `${configService.get('auth.tokenExpirationSeconds')}s`,
        },
      }),
      inject: [ConfigService],
    }),
  ],
})
export class CoreModule {}
