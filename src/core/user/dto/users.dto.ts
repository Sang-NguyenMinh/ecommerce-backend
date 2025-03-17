import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString } from 'class-validator';
import { ACCOUNT_TYPE, ROLES } from 'src/config/constants';

export class CreateUserDto {
  @IsString()
  @IsOptional()
  @ApiProperty({ example: 'john_doe', description: 'The username of the user' })
  username?: string;

  @IsString()
  @ApiProperty({
    example: 'SecureP@ssw0rd',
    description: 'The password of the user',
  })
  password: string;

  @IsEmail()
  @ApiProperty({
    example: 'john.doe@example.com',
    description: 'The unique email of the user',
  })
  email?: string;

  @IsOptional()
  @ApiProperty({
    example: '+1234567890',
    description: 'The unique phone number of the user',
  })
  phone?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    example: 'https://example.com/avatar.jpg',
    description: 'The avatar URL of the user',
  })
  avatar?: string;

  @IsOptional()
  @ApiProperty({ example: ROLES.USER, description: 'The role of the user' })
  role?: ROLES;

  @IsOptional()
  @ApiProperty({
    example: ACCOUNT_TYPE.LOCAL,
    description: 'The account type of the user',
  })
  accountType?: ACCOUNT_TYPE;

  @IsOptional()
  @ApiProperty({
    example: true,
    description: 'Indicates whether the user is active',
  })
  isActive?: boolean;

  @IsOptional()
  @ApiProperty({
    example: 'ExponentPushToken[xxx]',
    description: 'The push notification token of the user',
  })
  pushToken?: string;
}

export class UpdateUserDto {
  @ApiProperty({
    example: 'john_doe',
    description: 'The updated username of the user',
  })
  username?: string;

  @ApiProperty({
    example: 'NewSecureP@ssw0rd',
    description: 'The updated password of the user',
  })
  password?: string;

  @ApiProperty({
    example: 'john.doe@example.com',
    description: 'The updated email of the user',
  })
  email?: string;

  @ApiProperty({
    example: '+1234567890',
    description: 'The updated phone number of the user',
  })
  phone?: string;

  @ApiProperty({
    example: 'https://example.com/new-avatar.jpg',
    description: 'The updated avatar URL of the user',
  })
  avatar?: string;

  @ApiProperty({
    example: ROLES.ADMIN,
    description: 'The updated role of the user',
  })
  role?: ROLES;

  @ApiProperty({
    example: ACCOUNT_TYPE.GOOGLE,
    description: 'The updated account type of the user',
  })
  accountType?: ACCOUNT_TYPE;

  @ApiProperty({
    example: true,
    description: 'Indicates whether the user is active',
  })
  isActive?: boolean;

  @ApiProperty({
    example: 'ExponentPushToken[xxxxxxxxxxxxxxxxxxxxxx]',
    description: 'The updated push notification token of the user',
  })
  pushToken?: string;

  @ApiProperty({
    example: '654321',
    description: 'The updated verification code ID of the user',
  })
  codeId?: string;

  @ApiProperty({
    example: '2026-01-01T23:59:59.999Z',
    description: 'The updated expiration date of the verification code',
  })
  codeExpired?: Date;
}
