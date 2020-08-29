import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import { Model } from 'mongoose';
import { RegisterDto } from './dtos/register.dto';
import { UserDto } from 'src/user/dtos/user.dto';

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

  public findAll(): Promise<UserDto[]> {
    return this.userModel.find().exec();
  }
}
