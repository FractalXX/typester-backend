import { IsNotEmpty, IsEmail, IsBoolean, MinLength } from 'class-validator';

export class UserDto {
  @IsNotEmpty()
  @MinLength(2)
  username: string;

  @IsNotEmpty()
  password: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsBoolean()
  isActive: boolean;
}
