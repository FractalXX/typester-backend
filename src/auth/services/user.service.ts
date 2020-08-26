import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../schemas/user.schema';
import { Model } from 'mongoose';
import { bcrypt } from 'src/shared/shared.module';
import { RegisterDto } from 'dtos/auth/register.dto';

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
}
