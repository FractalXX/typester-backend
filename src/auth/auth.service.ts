import { Injectable } from '@nestjs/common';
import { UserService } from './user.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Log } from 'src/core/decorators/log-method.decorator';
import { User } from './schemas/user.schema';
import { TokenDto } from './dtos/token.dto';
import { RegisterDto } from './dtos/register.dto';
import * as bcrypt from 'bcrypt';
import * as moment from 'moment';
import { TokenService } from './token.service';
import { ActivationResult } from './enums/activation-result.enum';
import { TokenType } from './enums/token-type.enum';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private tokenService: TokenService,
    private jwtService: JwtService,
    private configService: ConfigService,
    private mailerService: MailerService,
  ) { }

  @Log()
  public async getUserByCredentials(
    username: string,
    password: string,
  ): Promise<any> {
    const user = await this.userService.findByUsername(username);
    if (user && bcrypt.compare(password, user.password)) {
      return user;
    }

    return null;
  }

  @Log()
  public getToken(user: User): TokenDto {
    return {
      token: this.jwtService.sign({
        username: user.username,
        sub: user.id,
      }),
    };
  }

  @Log()
  public async register(registerDto: RegisterDto): Promise<boolean> {
    const user = await this.userService.findByUsername(registerDto.username);
    if (user) {
      return false;
    }

    const salt = await bcrypt.genSalt(
      this.configService.get<number>('auth.passwordSaltRounds'),
    );
    const hashedPassword = await bcrypt.hash(registerDto.password, salt);
    // FIXME save might fail in certain circumstances, should handle it
    const result = await this.userService.addUser({
      ...registerDto,
      password: hashedPassword,
    });

    if (result) {
      const token = await this.tokenService.issueToken(
        result._id,
        TokenType.ACTIVATION,
        moment().add(this.configService.get<number>('auth.activationTokenExpiration'), 'day').toDate(),
      );

      // TODO create email template
      this.mailerService.sendMail({
        to: registerDto.email,
        subject: 'Confirm registration',
        template: 'registration',
        context: {
          // TODO shorten
          activationUrl: `http://${this.configService.get('frontend.url')}/${this.configService.get('frontend.activationRoute')}/${token.value}`,
          name: registerDto.username,
        },
      });
    }

    return !!result;
  }

  @Log()
  public async activate(tokenValue: string): Promise<ActivationResult> {
    const token = await this.tokenService.findByValueAndType(tokenValue, TokenType.ACTIVATION);
    if (!token) {
      return ActivationResult.TOKEN_NOT_FOUND;
    } else if (token.expirationDate < new Date()) {
      return ActivationResult.TOKEN_EXPIRED;
    }

    this.userService.activateUser(token.user);
    this.tokenService.removeToken(token);
    return ActivationResult.SUCCESSFUL;
  }
}
