import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import { Model } from 'mongoose';
import { UserDto } from 'user/dtos/user.dto';
import { Role } from './enums/role.enum';
import { Observable, from } from 'rxjs';
import { map } from 'rxjs/operators';
import { UserQueryParams } from '../user/dtos/user-query-params';
import { Log } from 'core/decorators/log-method.decorator';
import { CreateUserDto } from '../user/dtos/create-user.dto';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { TokenService } from './token.service';
import * as moment from 'moment';
import { TokenType } from './enums/token-type.enum';
import { MailerService } from '@nestjs-modules/mailer';
import { keys } from 'lodash';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private configService: ConfigService,
    private tokenService: TokenService,
    private mailerService: MailerService,
    private logger: Logger,
  ) {}

  @Log()
  public findById(id: string): Promise<User> {
    return this.userModel.findById(id).exec();
  }

  @Log()
  public findByUsername(username: string): Promise<User> {
    return this.userModel.findOne({ username }).exec();
  }

  public async getUserByCredentials(
    username: string,
    password: string,
  ): Promise<any> {
    const user = await this.findByUsername(username);
    if (user && (await bcrypt.compare(password, user.password))) {
      return user;
    }

    return null;
  }

  public async register(dto: CreateUserDto): Promise<User> {
    const user = await this.findByUsername(dto.username);
    if (user) {
      throw new ConflictException('User already exists.');
    }

    const salt = await bcrypt.genSalt(
      this.configService.get<number>('auth.passwordSaltRounds'),
    );
    const hashedPassword = await bcrypt.hash(dto.password, salt);
    // FIXME save might fail in certain circumstances, should handle it
    const result = await this.addUser({
      ...dto,
      password: hashedPassword,
    });

    if (result) {
      const token = await this.tokenService.issueToken(
        result._id,
        TokenType.ACTIVATION,
        moment()
          .add(
            this.configService.get<number>('auth.activationTokenExpiration'),
            'day',
          )
          .toDate(),
      );

      this.logger.log(`Sending activation e-mail to ${dto.email}`);
      // TODO create email template
      this.mailerService
        .sendMail({
          to: dto.email,
          subject: 'Confirm registration',
          template: 'registration',
          context: {
            // TODO shorten
            activationUrl: `http://${this.configService.get(
              'frontend.url',
            )}/${this.configService.get('frontend.activationRoute')}/${
              token.value
            }`,
            name: dto.username,
          },
        })
        .then(result => {
          this.logger.log(`Activation e-mail has been sent.`);
          this.logger.debug(JSON.stringify(result));
        })
        .catch(error => {
          this.logger.error('Failed to send activation e-mail.');
          this.logger.error(JSON.stringify(error));
        });

      return result;
    }

    throw new BadRequestException();
  }

  @Log()
  public async addUser(dto: CreateUserDto): Promise<User> {
    const user = new this.userModel({
      ...dto,
    });

    return user.save();
  }

  @Log()
  public query(queryParams: UserQueryParams): Promise<User[]> {
    return this.userModel
      .find()
      .skip(queryParams.offset)
      .limit(queryParams.limit)
      .exec();
  }

  @Log()
  public findAll(): Promise<UserDto[]> {
    return this.userModel.find().exec();
  }

  @Log()
  public async updateUser(
    id: string,
    payload: Partial<UserDto>,
  ): Promise<User> {
    const user = await this.findById(id);

    if (typeof user === undefined) {
      throw new NotFoundException(`User with id ${id} does not exist.`);
    }

    keys(payload).forEach(key => {
      user[key] = payload[key];
    });
    return user.save();
  }

  @Log()
  public activateUser(user: User): void {
    user.isActive = true;
    user.save();
  }

  @Log()
  public hasRoles(userId: string, roles: Role[]): Observable<boolean> {
    return from(
      this.userModel
        .findOne({
          _id: userId,
        })
        .select('roles')
        .exec(),
    ).pipe(map(result => roles.every(role => result.roles.includes(role))));
  }
}
