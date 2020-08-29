import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schemas/user.schema';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService, ConfigModule } from '@nestjs/config';
import { AuthService } from './auth.service';
import { LocalStrategy } from './passport/local.strategy';
import { JwtStrategy } from './passport/jwt.strategy';
import { AuthController } from './auth.controller';
import { UserService } from './user.service';
import { MailModule } from 'src/mail/mail.module';
import { TokenService } from './token.service';
import { Token, TokenSchema } from './schemas/token.schema';

@Module({
  imports: [
    ConfigModule,
    PassportModule,
    MailModule,
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Token.name, schema: TokenSchema },
    ]),
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
  // TODO move UserService to user module
  providers: [UserService, AuthService, TokenService, LocalStrategy, JwtStrategy],
  controllers: [AuthController],
})
export class AuthModule { }
