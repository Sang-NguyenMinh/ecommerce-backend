import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsMongoId, IsEnum, IsNumber, Min, IsOptional } from 'class-validator';
import { OrderStatusEnum, PaymentTypeEnum } from 'src/config/constants';

export class CreateShopOrderDto {
  @ApiProperty({
    example: '65f25a3d6e4b3b001c2d5a8e',
    description: 'Shipping Method ID',
  })
  @IsMongoId()
  shippingMethodId: string;

  @ApiProperty({ example: '65f25a3d6e4b3b001c2d5a8e', description: 'User ID' })
  @IsMongoId()
  userId: string;

  @ApiProperty({
    example: '65f25a3d6e4b3b001c2d5a8e',
    description: 'Shipping Address ID',
  })
  @IsMongoId()
  shippingAddress: string;

  @ApiProperty({
    example: OrderStatusEnum.PENDING,
    enum: OrderStatusEnum,
    description: 'Order Status',
  })
  @IsEnum(OrderStatusEnum)
  orderStatus: OrderStatusEnum;

  @ApiProperty({
    example: PaymentTypeEnum.CASH,
    enum: PaymentTypeEnum,
    description: 'Payment Type',
  })
  @IsEnum(PaymentTypeEnum)
  paymentType: PaymentTypeEnum;

  @ApiProperty({ example: 100.5, description: 'Total Order Price' })
  @IsNumber()
  @Min(0)
  orderTotal: number;
}
export class UpdateShopOrderDto {
  @ApiPropertyOptional({
    example: '65f25a3d6e4b3b001c2d5a8e',
    description: 'Order ID',
  })
  @IsMongoId()
  id: string;

  @ApiPropertyOptional({
    example: OrderStatusEnum.SHIPPED,
    enum: OrderStatusEnum,
    description: 'Updated Order Status',
  })
  @IsOptional()
  @IsEnum(OrderStatusEnum)
  orderStatus?: OrderStatusEnum;

  @ApiPropertyOptional({
    example: PaymentTypeEnum.CASH,
    enum: PaymentTypeEnum,
    description: 'Updated Payment Type',
  })
  @IsOptional()
  @IsEnum(PaymentTypeEnum)
  paymentType?: PaymentTypeEnum;

  @ApiPropertyOptional({ example: 150.75, description: 'Updated Order Total' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  orderTotal?: number;
}
