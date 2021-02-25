import { Logger, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from 'auth/auth.module';
import { UserModule } from 'user/user.module';
import { ProfileController } from './profile.controller';
import { ProfileService } from './profile.service';
import Profile, { ProfileSchema } from './schemas/profile.schema';

@Module({
  imports: [
    UserModule,
    AuthModule,
    MongooseModule.forFeature([{ name: Profile.name, schema: ProfileSchema }]),
  ],
  controllers: [ProfileController],
  providers: [ProfileService, Logger],
})
export class ProfileModule {}
