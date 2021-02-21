import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import { Model } from 'mongoose';
import { RegisterDto } from './dtos/register.dto';
import { UserDto } from 'src/user/dtos/user.dto';
import { Role } from './enums/role.enum';
import { Observable, from } from 'rxjs';
import { map } from 'rxjs/operators';
import { UserQueryParams } from '../user/dtos/user-query-params';
import { Log } from 'src/core/decorators/log-method.decorator';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  @Log()
  public findByUsername(username: string): Promise<User> {
    return this.userModel.findOne({ username }).exec();
  }

  @Log()
  public async addUser(registerDto: RegisterDto): Promise<User> {
    const user = new this.userModel({
      ...registerDto,
    });

    return user.save();
  }

  public activateUser(user: User): void {
    user.isActive = true;
    user.save();
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
