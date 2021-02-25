import { Injectable } from '@nestjs/common';
import { Token } from './schemas/token.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import { toObjectId } from 'utils';
import { TokenType } from './enums/token-type.enum';
import { Log } from 'core/decorators/log-method.decorator';

@Injectable()
export class TokenService {
  constructor(@InjectModel(Token.name) private tokenModel: Model<Token>) {}

  @Log()
  public issueToken(
    userId: string,
    type: TokenType,
    expirationDate: Date,
  ): Promise<Token> {
    return new this.tokenModel({
      type,
      expirationDate,
      value: uuidv4(),
      user: toObjectId(userId),
    }).save();
  }

  @Log()
  public findByValueAndType(value: string, type: TokenType): Promise<Token> {
    return this.tokenModel
      .findOne({
        value,
        type,
      })
      .populate('user')
      .exec();
  }

  @Log()
  public findOneByUserIdAndType(
    userId: string,
    type: TokenType,
  ): Promise<Token> {
    return this.tokenModel
      .findOne({
        type,
        user: toObjectId(userId),
      })
      .exec();
  }

  @Log()
  public findActivationToken(userId: string, value: string): Promise<Token> {
    return this.tokenModel
      .findOne({
        value,
        type: TokenType.ACTIVATION,
        user: toObjectId(userId),
      })
      .exec();
  }

  @Log()
  public removeToken(token: Token): void {
    this.tokenModel.findByIdAndDelete(token._id).exec();
  }
}
