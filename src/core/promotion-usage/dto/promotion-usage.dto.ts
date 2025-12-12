import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsOptional,
  IsNumber,
  Min,
  IsDate,
  IsNotEmpty,
  IsMongoId,
} from 'class-validator';
import { Types } from 'mongoose';

export class CreatePromotionUsageDto {
  @ApiProperty({
    example: '65f25a3d6e4b3b001c2d5a8e',
    description: 'ID of the promotion',
  })
  @IsMongoId()
  @IsNotEmpty()
  promotionId: Types.ObjectId;

  @ApiProperty({
    example: '65f25a3d6e4b3b001c2d5a8e',
    description: 'ID of the user',
  })
  @IsMongoId()
  @IsNotEmpty()
  userId: Types.ObjectId;

  @ApiProperty({
    example: '65f25a3d6e4b3b001c2d5a8e',
    description: 'ID of the order',
  })
  @IsMongoId()
  @IsNotEmpty()
  orderId: Types.ObjectId;

  @ApiProperty({
    example: 10,
    description: 'Discount amount',
    minimum: 0,
  })
  @IsNumber()
  @Min(0)
  discountAmount: number;

  @ApiProperty({
    example: '2025-06-01T00:00:00.000Z',
    description: 'Used at',
  })
  @IsDate()
  @IsNotEmpty()
  @Transform(({ value }) => new Date(value))
  usedAt: Date;
}

export class UpdatePromotionUsageDto {
  @ApiProperty({
    example: '65f25a3d6e4b3b001c2d5a8e',
    description: 'ID of the promotion usage to update',
  })
  @IsMongoId()
  @IsNotEmpty()
  id: string;

  @ApiPropertyOptional({
    example: '65f25a3d6e4b3b001c2d5a8e',
    description: 'Updated ID of the promotion',
  })
  @IsOptional()
  @IsMongoId()
  promotionId?: Types.ObjectId;

  @ApiPropertyOptional({
    example: '65f25a3d6e4b3b001c2d5a8e',
    description: 'Updated ID of the user',
  })
  @IsOptional()
  @IsMongoId()
  userId?: Types.ObjectId;

  @ApiPropertyOptional({
    example: '65f25a3d6e4b3b001c2d5a8e',
    description: 'Updated ID of the order',
  })
  @IsOptional()
  @IsMongoId()
  orderId?: Types.ObjectId;

  @ApiPropertyOptional({
    example: 10,
    description: 'Updated discount amount',
    minimum: 0,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  discountAmount?: number;

  @ApiPropertyOptional({
    example: '2025-07-01T00:00:00.000Z',
    description: 'Updated used at',
  })
  @IsOptional()
  @IsDate()
  @IsNotEmpty()
  @Transform(({ value }) => new Date(value))
  usedAt?: Date;
}
