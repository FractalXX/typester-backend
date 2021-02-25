import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Log } from 'core/decorators/log-method.decorator';
import { Model } from 'mongoose';
import CreateProfileDto from './dtos/create-profile.dto';
import Profile from './schemas/profile.schema';

@Injectable()
export class ProfileService {
  constructor(
    @InjectModel(Profile.name) private profileModel: Model<Profile>,
  ) {}

  @Log()
  public createProfile(
    userId: string,
    dto: CreateProfileDto,
  ): Promise<Profile> {
    const profile = new this.profileModel({
      ...dto,
      user: userId,
    });

    return profile.save();
  }

  @Log()
  public getUserProfiles(userId: string): Promise<Profile[]> {
    return this.profileModel
      .find({
        user: userId,
      })
      .exec();
  }

  @Log()
  public findUserProfileById(id: string, userId: string): Promise<Profile> {
    return this.profileModel
      .findOne({
        _id: id,
        user: userId,
      })
      .exec();
  }
}
