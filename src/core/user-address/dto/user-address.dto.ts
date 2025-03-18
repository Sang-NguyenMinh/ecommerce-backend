import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsMongoId, IsString, IsBoolean, IsOptional } from 'class-validator';

export class CreateUserAddressDto {
  @ApiProperty({ example: '65f25a3d6e4b3b001c2d5a8e', description: 'User ID' })
  @IsMongoId()
  userId: string;

  @ApiProperty({
    example: '123 Main Street, City, Country',
    description: 'User Address',
  })
  @IsString()
  address: string;

  @ApiProperty({
    example: true,
    description: 'Set as default address',
    required: false,
  })
  @IsBoolean()
  isDefault?: boolean;
}

export class UpdateUserAddressDto {
  @ApiPropertyOptional({
    example: '65f25a3d6e4b3b001c2d5a8e',
    description: 'Address ID',
  })
  @IsMongoId()
  id: string;

  @ApiPropertyOptional({
    example: '456 New Street, City, Country',
    description: 'Updated Address',
  })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiPropertyOptional({
    example: false,
    description: 'Set as default address',
  })
  @IsOptional()
  @IsBoolean()
  isDefault?: boolean;
}
