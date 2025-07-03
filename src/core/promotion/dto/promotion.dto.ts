import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsString,
  IsOptional,
  IsNumber,
  Min,
  Max,
  IsDate,
  IsNotEmpty,
  IsEnum,
  IsMongoId,
} from 'class-validator';
import { DiscountTypeEnum } from '../schemas/promotion.schema';
import { Prop } from '@nestjs/mongoose';

export class CreatePromotionDto {
  @ApiProperty({ example: 'Summer Sale', description: 'Name of the promotion' })
  @IsString()
  @IsNotEmpty()
  @Prop({ required: true })
  name: string;

  @ApiPropertyOptional({
    example: 'Discount for summer collection',
    description: 'Description of the promotion',
  })
  @IsOptional()
  @IsString()
  @Prop()
  description?: string;

  @ApiProperty({
    example: DiscountTypeEnum.PERCENTAGE,
    description: 'Discount type',
    enum: DiscountTypeEnum,
    default: DiscountTypeEnum.PERCENTAGE,
  })
  @IsEnum(DiscountTypeEnum)
  @Prop({
    required: true,
    enum: DiscountTypeEnum,
    default: DiscountTypeEnum.PERCENTAGE,
  })
  discountType: DiscountTypeEnum;

  @ApiProperty({
    example: 20,
    description: 'Discount rate (0 - 100)',
    minimum: 0,
    maximum: 100,
  })
  @IsNumber()
  @Min(0)
  @Max(100)
  @Prop({ required: true, min: 0 })
  discountValue: number;

  @ApiPropertyOptional({
    example: 100,
    description: 'Max discount amount',
    minimum: 0,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Prop({ min: 0 })
  maxDiscountAmount?: number;

  @ApiProperty({
    example: 0,
    description: 'Min order value',
    minimum: 0,
  })
  @IsNumber()
  @Min(0)
  @Prop({ min: 0, default: 0 })
  minOrderValue: number;

  @ApiProperty({
    example: '2025-06-01T00:00:00.000Z',
    description: 'Start date of the promotion',
  })
  @IsDate()
  @IsNotEmpty()
  @Transform(({ value }) => new Date(value))
  @Prop({ required: true })
  startDate: Date;

  @ApiProperty({
    example: '2025-06-30T23:59:59.000Z',
    description: 'End date of the promotion',
  })
  @Transform(({ value }) => new Date(value))
  @IsDate()
  @IsNotEmpty()
  @Prop({ required: true })
  endDate: Date;

  @ApiPropertyOptional({
    example: 5,
    description: 'Usage limit',
    minimum: 0,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Prop({ min: 0 })
  usageLimit?: number;

  @ApiProperty({
    example: 0,
    description: 'Used count',
    minimum: 0,
    default: 0,
  })
  @IsNumber()
  @Min(0)
  @Prop({ min: 0, default: 0 })
  usedCount: number;

  @ApiProperty({
    example: true,
    description: 'Is active',
    default: true,
  })
  @Prop({ default: true })
  isActive: boolean;
}

export class UpdatePromotionDto {
  @ApiProperty({
    example: '65f25a3d6e4b3b001c2d5a8e',
    description: 'ID of the promotion to update',
  })
  @IsMongoId()
  @IsNotEmpty()
  @Prop({ required: true })
  id: string;

  @ApiPropertyOptional({
    example: 'Winter Sale',
    description: 'Updated name of the promotion',
  })
  @IsOptional()
  @IsString()
  @Prop()
  name?: string;

  @ApiPropertyOptional({
    example: 'Discount for winter collection',
    description: 'Updated description',
  })
  @IsOptional()
  @IsString()
  @Prop()
  description?: string;

  @ApiPropertyOptional({
    example: DiscountTypeEnum.FIXED_AMOUNT,
    description: 'Updated discount type',
    enum: DiscountTypeEnum,
  })
  @IsOptional()
  @IsEnum(DiscountTypeEnum)
  @Prop({ enum: DiscountTypeEnum })
  discountType?: DiscountTypeEnum;

  @ApiPropertyOptional({
    example: 15,
    description: 'Updated discount rate (0 - 100)',
    minimum: 0,
    maximum: 100,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  @Prop({ min: 0 })
  discountValue?: number;

  @ApiPropertyOptional({
    example: 50,
    description: 'Updated max discount amount',
    minimum: 0,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Prop({ min: 0 })
  maxDiscountAmount?: number;

  @ApiPropertyOptional({
    example: 50,
    description: 'Updated min order value',
    minimum: 0,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Prop({ min: 0 })
  minOrderValue?: number;

  @ApiPropertyOptional({
    example: '2025-07-01T00:00:00.000Z',
    description: 'Updated start date',
  })
  @Transform(({ value }) => new Date(value))
  @IsOptional()
  @IsNotEmpty()
  @Prop()
  startDate?: Date;

  @ApiPropertyOptional({
    example: '2025-07-31T23:59:59.000Z',
    description: 'Updated end date',
  })
  @Transform(({ value }) => new Date(value))
  @IsOptional()
  @IsNotEmpty()
  @Prop()
  endDate?: Date;

  @ApiPropertyOptional({
    example: 5,
    description: 'Updated usage limit',
    minimum: 0,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Prop({ min: 0 })
  usageLimit?: number;

  @ApiPropertyOptional({
    example: 5,
    description: 'Updated used count',
    minimum: 0,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Prop({ min: 0 })
  usedCount?: number;

  @ApiPropertyOptional({
    example: true,
    description: 'Updated is active',
    default: true,
  })
  @Prop({ default: true })
  isActive?: boolean;
}
