import { Types } from 'mongoose';

export function toObjectId(id: string): any {
  return Types.ObjectId(id);
}