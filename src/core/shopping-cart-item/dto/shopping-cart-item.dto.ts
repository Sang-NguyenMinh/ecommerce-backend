import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsMongoId, IsInt, Min, IsOptional } from 'class-validator';

export class CreateShoppingCartItemDto {
  @ApiProperty({
    example: '65f25a3d6e4b3b001c2d5a8e',
    description: 'Shopping Cart ID',
  })
  @IsMongoId()
  cartId: string;

  @ApiProperty({
    example: '65f25a3d6e4b3b001c2d5a8e',
    description: 'Product Item ID',
  })
  @IsMongoId()
  productItemId: string;

  @ApiProperty({
    example: 2,
    description: 'Quantity of the product item',
    minimum: 1,
  })
  @IsInt()
  @Min(1)
  qty: number;
}
export class UpdateShoppingCartItemDto {
  @ApiPropertyOptional({
    example: '65f25a3d6e4b3b001c2d5a8e',
    description: 'Shopping Cart Item ID',
  })
  @IsMongoId()
  id: string;

  @ApiPropertyOptional({
    example: '65f25a3d6e4b3b001c2d5a8e',
    description: 'Updated Product Item ID',
  })
  @IsOptional()
  @IsMongoId()
  productItemId?: string;

  @ApiPropertyOptional({
    example: 3,
    description: 'Updated quantity of the product item',
    minimum: 1,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  qty?: number;
}
