import { Optional } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class CreateAuthDto {
  @IsNotEmpty()
  password: string;

  @Optional()
  name: string;

  @IsEmail()
  email: string;
}

export class CodeAuthDto {
  @IsNotEmpty({ message: '_id không được để trống' })
  @ApiProperty({ example: 'your-id' })
  _id: string;

  @IsNotEmpty({ message: 'code không được để trống' })
  @ApiProperty({ example: 'code' })
  code: string;
}

export class ChangePasswordAuthDto {
  @IsNotEmpty({ message: 'password không được để trống' })
  password: string;

  @IsNotEmpty({ message: 'email không được để trống' })
  email: string;
}
