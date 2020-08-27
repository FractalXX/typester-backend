import { Injectable } from '@nestjs/common';
import { UserService } from './user.service';
import { bcrypt } from 'src/shared/shared.module';
import { JwtService } from '@nestjs/jwt';
import { User } from '../schemas/user.schema';
import { RegisterDto } from 'dtos/auth/register.dto';
import { ConfigService } from '@nestjs/config';
import { Log } from 'src/shared/decorators/log-method.decorator';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) { }

  @Log()
  public async getUserByCredentials(username: string, password: string): Promise<any> {
    const user = await this.userService.findByUsername(username);
    if (user && bcrypt.compare(password, user.password)) {
      return user;
    }

    return null;
  }

  @Log()
  public login(user: User): any {
    return {
      token: this.jwtService.sign({
        username: user.username,
        sub: user.id,
      }),
    }
  }

  @Log()
  public async register(registerDto: RegisterDto): Promise<boolean> {
    const user = await this.userService.findByUsername(registerDto.username);
    if (user) {
      return false;
    }

    const salt = await bcrypt.genSalt(this.configService.get<number>('auth.passwordSaltRounds'));
    const hashedPassword = await bcrypt.hash(registerDto.password, salt);
    return !!this.userService.addUser({ ...registerDto, password: hashedPassword });
  }
}
