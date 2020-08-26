import { Module } from '@nestjs/common';
import * as Bcrypt from 'bcrypt';

export const bcrypt = Bcrypt;

@Module({})
export class SharedModule { }
