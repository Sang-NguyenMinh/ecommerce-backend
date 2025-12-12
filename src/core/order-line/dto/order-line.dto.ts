import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsMongoId, IsInt, Min, IsOptional, IsNumber } from 'class-validator';

export class CreateOrderLineDto {
  @ApiProperty({
    example: '65f25a3d6e4b3b001c2d5a8e',
    description: 'Product Item ID',
  })
  @IsMongoId()
  productItemId: string;

  @ApiProperty({
    example: '65f25a3d6e4b3b001c2d5a8e',
    description: 'Order ID',
  })
  @IsMongoId()
  orderId: string;

  @ApiProperty({
    example: 2,
    description: 'Số lượng sản phẩm',
    minimum: 1,
  })
  @IsInt()
  @Min(1)
  qty: number;

  @ApiProperty({
    example: 49000,
    description: 'Giá sản phẩm (VNĐ)',
    minimum: 0,
  })
  @IsNumber()
  @Min(0)
  price: number;
}

export class UpdateOrderLineDto {
  @ApiPropertyOptional({
    example: '65f25a3d6e4b3b001c2d5a8e',
    description: 'Product Item ID',
  })
  @IsOptional()
  @IsMongoId()
  productItemId?: string;

  @ApiPropertyOptional({
    example: 3,
    description: 'Số lượng sản phẩm',
    minimum: 1,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  qty?: number;

  @ApiPropertyOptional({
    example: 59000,
    description: 'Giá sản phẩm (VNĐ)',
    minimum: 0,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  price?: number;
}
