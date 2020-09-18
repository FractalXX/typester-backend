import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import { Model } from 'mongoose';
import { RegisterDto } from './dtos/register.dto';
import { UserDto } from 'src/user/dtos/user.dto';
import { Role } from './enums/role.enum';
import { Observable, from } from 'rxjs';
import { map } from 'rxjs/operators';
import { UserQueryParams } from './dtos/user-query-params';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) { }

  public findByUsername(username: string): Promise<User> {
    return this.userModel.findOne({ username }).exec();
  }

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

  public query(queryParams: UserQueryParams): Promise<User[]> {
    return this.userModel
      .find()
      .skip(queryParams.offset)
      .limit(queryParams.limit)
      .exec();
  }

  public findAll(): Promise<UserDto[]> {
    return this.userModel.find().exec();
  }

  public hasRoles(userId: string, roles: Role[]): Observable<boolean> {
    return from(
      this.userModel.findOne({
        _id: userId,
      })
        .select('roles')
        .exec(),
    ).pipe(
      map(result => roles.every(role => result.roles.includes(role))),
    );
  }
}
