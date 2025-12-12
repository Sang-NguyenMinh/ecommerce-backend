import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsBoolean,
  IsArray,
  ValidateNested,
  IsNumber,
  Min,
  IsEmail,
  IsEnum,
  ValidateIf,
} from 'class-validator';
import { Type } from 'class-transformer';
import { OrderStatusEnum, PaymentTypeEnum } from 'src/config/constants';

export class OrderLineItemDto {
  @ApiProperty({ description: 'Product Item ID' })
  @IsNotEmpty()
  @IsString()
  productItemId: string;

  @ApiProperty({ description: 'Quantity', minimum: 1 })
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  qty: number;

  @ApiProperty({ description: 'Price', minimum: 0 })
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  price: number;
}

export class CreateShopOrderDto {
  // User order fields (required if not guest)
  @ApiPropertyOptional({ description: 'User ID (required if not guest order)' })
  @IsOptional()
  @IsString()
  @ValidateIf((o) => !o.isGuestOrder)
  @IsNotEmpty()
  userId?: string;

  @ApiPropertyOptional({
    description:
      'User shipping address ID (optional - will use existing or create new)',
  })
  @IsOptional()
  @IsString()
  shippingAddress?: string;

  // New address fields for first-time user orders
  @ApiPropertyOptional({
    description: 'Recipient name (required if user has no existing address)',
  })
  @IsOptional()
  @IsString()
  recipientName?: string;

  @ApiPropertyOptional({
    description: 'Phone number (required if user has no existing address)',
  })
  @IsOptional()
  @IsString()
  phoneNumber?: string;

  @ApiPropertyOptional({
    description: 'Street address (required if user has no existing address)',
  })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiPropertyOptional({
    description: 'City/Province (required if user has no existing address)',
  })
  @IsOptional()
  @IsString()
  city?: string;

  @ApiPropertyOptional({
    description: 'District (required if user has no existing address)',
  })
  @IsOptional()
  @IsString()
  district?: string;

  @ApiPropertyOptional({
    description: 'Ward (required if user has no existing address)',
  })
  @IsOptional()
  @IsString()
  ward?: string;

  // Guest order fields
  @ApiProperty({ description: 'Is guest order', default: false })
  @IsOptional()
  @IsBoolean()
  isGuestOrder?: boolean;

  @ApiPropertyOptional({ description: 'Guest email (required if guest order)' })
  @IsOptional()
  @IsEmail()
  @ValidateIf((o) => o.isGuestOrder)
  @IsNotEmpty()
  guestEmail?: string;

  @ApiPropertyOptional({ description: 'Guest phone (required if guest order)' })
  @IsOptional()
  @IsString()
  @ValidateIf((o) => o.isGuestOrder)
  @IsNotEmpty()
  guestPhone?: string;

  @ApiPropertyOptional({ description: 'Guest name (required if guest order)' })
  @IsOptional()
  @IsString()
  @ValidateIf((o) => o.isGuestOrder)
  @IsNotEmpty()
  guestName?: string;

  @ApiPropertyOptional({
    description: 'Guest shipping address (required if guest order)',
  })
  @IsOptional()
  @IsString()
  @ValidateIf((o) => o.isGuestOrder)
  @IsNotEmpty()
  guestShippingAddress?: string;

  // Common fields
  @ApiPropertyOptional({ description: 'Shipping method ID' })
  @IsOptional()
  @IsString()
  shippingMethodId?: string;

  @ApiProperty({
    description: 'Order status',
    enum: OrderStatusEnum,
    default: OrderStatusEnum.PENDING,
  })
  @IsOptional()
  @IsEnum(OrderStatusEnum)
  orderStatus?: OrderStatusEnum;

  @ApiProperty({
    description: 'Payment type',
    enum: PaymentTypeEnum,
    default: PaymentTypeEnum.CASH,
  })
  @IsOptional()
  @IsEnum(PaymentTypeEnum)
  paymentType?: PaymentTypeEnum;

  @ApiProperty({ description: 'Order items', type: [OrderLineItemDto] })
  @IsNotEmpty()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderLineItemDto)
  orderItems: OrderLineItemDto[];

  @ApiPropertyOptional({ description: 'Promotion code' })
  @IsOptional()
  @IsString()
  promotionCode?: string;

  @ApiPropertyOptional({ description: 'Order notes' })
  @IsOptional()
  @IsString()
  note?: string;
}

export class UpdateShopOrderDto extends PartialType(CreateShopOrderDto) {}

export class TrackGuestOrderDto {
  @ApiProperty({ description: 'Order token for guest order tracking' })
  @IsNotEmpty()
  @IsString()
  orderToken: string;

  @ApiProperty({ description: 'Guest email' })
  @IsNotEmpty()
  @IsEmail()
  guestEmail: string;
}
