import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Role } from '../enums/role.enum';

/**
 * Basic User schema used for authentication.
 */
@Schema()
export class User extends Document {
  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true, unique: true })
  username: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true, default: false })
  isActive: boolean;

  @Prop({ required: true, default: [Role.USER] })
  roles: Role[];
}

export const UserSchema = SchemaFactory.createForClass(User);
