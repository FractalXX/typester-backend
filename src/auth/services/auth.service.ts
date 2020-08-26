import { Injectable } from '@nestjs/common';
import { UserService } from './user.service';
import { bcrypt } from 'src/shared/shared.module';
import { omit as _omit } from 'lodash';
import { JwtService } from '@nestjs/jwt';
import { User } from '../schemas/user.schema';
import { RegisterDto } from 'dtos/auth/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) { }

  public async getUserByCredentials(username: string, password: string): Promise<any> {
    const user = await this.userService.findByUsername(username);
    if (user && bcrypt.compare(password, user.password)) {
      return _omit(user, ['password']);
    }

    return null;
  }

  public login(user: User): any {
    return {
      token: this.jwtService.sign({
        username: user.username,
        sub: user.id,
      }),
    }
  }

  public async register(registerDto: RegisterDto): Promise<boolean> {
    const user = await this.userService.findByUsername(registerDto.username);
    if (user) {
      return false;
    }

    const salt = await bcrypt.genSalt(parseInt(process.env.PASSWORD_SALT_ROUNDS));
    const hashedPassword = await bcrypt.hash(registerDto.password, salt);
    return !!this.userService.addUser({ ...registerDto, password: hashedPassword });
  }
}
