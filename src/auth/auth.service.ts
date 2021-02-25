import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Log } from 'core/decorators/log-method.decorator';
import { User } from './schemas/user.schema';
import { TokenDto } from './dtos/token.dto';
import { TokenService } from './token.service';
import { UserService } from './user.service';
import { TokenType } from './enums/token-type.enum';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private tokenService: TokenService,
    private userService: UserService,
  ) {}

  @Log()
  public login(user: User): TokenDto {
    if (!user.isActive) {
      throw new UnauthorizedException('User is not activated.');
    }

    return {
      token: this.jwtService.sign({
        username: user.username,
        sub: user.id,
      }),
    };
  }

  @Log()
  public async activate(tokenValue: string): Promise<void> {
    const token = await this.tokenService.findByValueAndType(
      tokenValue,
      TokenType.ACTIVATION,
    );
    if (!token) {
      throw new UnauthorizedException('Activation token is invalid.');
    } else if (token.expirationDate < new Date()) {
      throw new UnauthorizedException('Activation token is expired.');
    }

    this.userService.activateUser(token.user);
    this.tokenService.removeToken(token);
  }
}
