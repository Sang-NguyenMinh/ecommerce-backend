import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsMongoId, IsOptional } from 'class-validator';

export class CreateShoppingCartDto {
  @ApiProperty({
    example: '65f25a3d6e4b3b001c2d5a8e',
    description: 'User ID associated with the shopping cart',
  })
  @IsMongoId()
  userId: string;
}

export class UpdateShoppingCartDto {
  @ApiPropertyOptional({
    example: '65f25a3d6e4b3b001c2d5a8e',
    description: 'Shopping Cart ID',
  })
  @IsMongoId()
  id: string;

  @ApiPropertyOptional({
    example: '65f25a3d6e4b3b001c2d5a8e',
    description: 'Updated User ID',
  })
  @IsOptional()
  @IsMongoId()
  userId?: string;
}
