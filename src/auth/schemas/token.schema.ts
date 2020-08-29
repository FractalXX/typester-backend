import { Document, Schema as MongooseSchema } from "mongoose";
import { Schema, Prop, SchemaFactory } from "@nestjs/mongoose";
import { User } from "./user.schema";
import { TokenType } from "../enums/token-type.enum";

/** Token schema. */
@Schema()
export class Token extends Document {
  @Prop({ required: true, unique: true })
  value: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, required: true, ref: 'User' })
  user: User;

  @Prop({ required: true })
  expirationDate: Date;

  @Prop({ required: true })
  type: TokenType;
}

export const TokenSchema = SchemaFactory.createForClass(Token);