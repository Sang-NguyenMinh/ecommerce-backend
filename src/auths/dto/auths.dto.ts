import { Optional } from '@nestjs/common';
import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreateAuthDto {
  @ApiProperty({
    example: 'SecureP@ssw0rd',
    description: 'The password of the user',
  })
  @IsNotEmpty()
  password: string;

  @ApiProperty({
    example: 'John Doe',
    description: 'The name of the user',
    required: false,
  })
  @Optional()
  name: string;

  @ApiProperty({
    example: 'john.doe@example.com',
    description: 'The unique email of the user',
  })
  @IsEmail()
  email: string;
}

export class CodeAuthDto {
  @ApiProperty({
    example: 'your-id',
    description: 'The unique identifier for the user',
  })
  @IsNotEmpty({ message: '_id cannot be empty' })
  _id: string;

  @ApiProperty({
    example: '123456',
    description: 'The authentication code for verification',
  })
  @IsNotEmpty({ message: 'code cannot be empty' })
  code: string;
}

export class ChangePasswordAuthDto {
  @ApiProperty({
    example: 'NewSecureP@ssw0rd',
    description: 'The new password for the user',
  })
  @IsNotEmpty({ message: 'password cannot be empty' })
  password: string;

  @ApiProperty({
    example: 'john.doe@example.com',
    description: 'The email associated with the account',
  })
  @IsNotEmpty({ message: 'email cannot be empty' })
  email: string;
}

export class UpdateAuthDto extends PartialType(CreateAuthDto) {}
