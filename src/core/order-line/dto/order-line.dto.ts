import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsMongoId, IsInt, Min, IsOptional } from 'class-validator';

export class CreateOrderLineDto {
  @ApiProperty({
    example: '65f25a3d6e4b3b001c2d5a8e',
    description: 'Product Item ID',
  })
  @IsMongoId()
  productItemId: string;

  @ApiProperty({ example: '65f25a3d6e4b3b001c2d5a8e', description: 'Order ID' })
  @IsMongoId()
  orderId: string;

  @ApiProperty({
    example: 2,
    description: 'Quantity of the product item',
    minimum: 1,
  })
  @IsInt()
  @Min(1)
  qty: number;

  @ApiProperty({
    example: 49.99,
    description: 'Price of the product item',
    minimum: 0,
  })
  @Min(0)
  price: number;
}

export class UpdateOrderLineDto {
  @ApiPropertyOptional({
    example: '65f25a3d6e4b3b001c2d5a8e',
    description: 'Order Line ID',
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

  @ApiPropertyOptional({
    example: 59.99,
    description: 'Updated price of the product item',
    minimum: 0,
  })
  @IsOptional()
  @Min(0)
  price?: number;
}
