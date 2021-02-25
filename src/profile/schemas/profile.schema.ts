import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { User } from 'auth/schemas/user.schema';

@Schema()
export default class Profile extends Document {
  @Prop({ required: true, unique: true })
  name: string;

  @Prop({ required: false })
  firstName: string;

  @Prop({ required: false })
  lastName: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, required: true, ref: 'User' })
  user: User | string;
}

export const ProfileSchema = SchemaFactory.createForClass(Profile);
