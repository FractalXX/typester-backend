import { IsNotEmpty, MinLength } from 'class-validator';

export default class CreateProfileDto {
  @IsNotEmpty()
  @MinLength(2)
  name: string;

  @IsNotEmpty()
  @MinLength(2)
  firstName: string;

  @IsNotEmpty()
  @MinLength(2)
  lastName: string;
}
