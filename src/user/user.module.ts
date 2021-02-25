import { Logger, Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { AuthModule } from 'auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [UserController],
  providers: [Logger],
})
export class UserModule {}
