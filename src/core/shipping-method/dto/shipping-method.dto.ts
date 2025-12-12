import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional, Min } from 'class-validator';

export class CreateShippingMethodDto {
  @ApiProperty({
    example: 'Giao hàng nhanh',
    description: 'Tên phương thức vận chuyển',
  })
  @IsString()
  name: string;

  @ApiProperty({ example: 30000, description: 'Phí vận chuyển (VNĐ)' })
  @IsNumber()
  @Min(0)
  price: number;
}

export class UpdateShippingMethodDto {
  @ApiPropertyOptional({
    example: 'Giao hàng tiết kiệm',
    description: 'Tên phương thức vận chuyển',
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ example: 25000, description: 'Phí vận chuyển (VNĐ)' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  price?: number;
}
