import { Injectable } from "@nestjs/common";
import { Token } from "./schemas/token.schema";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { v4 as uuidv4 } from 'uuid';
import { toObjectId } from "src/utils";
import { TokenType } from "./enums/token-type.enum";

@Injectable()
export class TokenService {
  constructor(
    @InjectModel(Token.name) private tokenModel: Model<Token>) { }

  public issueToken(userId: string, type: TokenType, expirationDate: Date): Promise<Token> {
    return new this.tokenModel({
      type,
      expirationDate,
      value: uuidv4(),
      user: toObjectId(userId),
    })
      .save();
  }

  public findByValueAndType(value: string, type: TokenType): Promise<Token> {
    return this.tokenModel.findOne({
      value,
      type,
    })
      .populate('user')
      .exec();
  }

  public findOneByUserIdAndType(userId: string, type: TokenType): Promise<Token> {
    return this.tokenModel.findOne({
      type,
      user: toObjectId(userId),
    })
      .exec();
  }

  public removeToken(token: Token): void {
    this.tokenModel.findByIdAndDelete(token._id).exec();
  }
}