import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @Length(3, 20)
  readonly name: string;

  @IsEmail()
  @IsNotEmpty()
  readonly email: string;
}
