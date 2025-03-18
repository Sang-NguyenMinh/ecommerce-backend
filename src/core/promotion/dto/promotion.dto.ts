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
  IsMongoId,
} from 'class-validator';

export class CreatePromotionDto {
  @ApiProperty({ example: 'Summer Sale', description: 'Name of the promotion' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({
    example: 'Discount for summer collection',
    description: 'Description of the promotion',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    example: 20,
    description: 'Discount rate (0 - 100)',
    minimum: 0,
    maximum: 100,
  })
  @IsNumber()
  @Min(0)
  @Max(100)
  discountRate: number;

  @ApiProperty({
    example: '2025-06-01T00:00:00.000Z',
    description: 'Start date of the promotion',
  })
  @IsDate()
  @IsNotEmpty()
  @Transform(({ value }) => new Date(value))
  startDate: Date;

  @ApiProperty({
    example: '2025-06-30T23:59:59.000Z',
    description: 'End date of the promotion',
  })
  @Transform(({ value }) => new Date(value))
  @IsDate()
  @IsNotEmpty()
  endDate: Date;
}

export class UpdatePromotionDto {
  @ApiProperty({
    example: '65f25a3d6e4b3b001c2d5a8e',
    description: 'ID of the promotion to update',
  })
  @IsMongoId()
  @IsNotEmpty()
  id: string;
  @ApiPropertyOptional({
    example: 'Winter Sale',
    description: 'Updated name of the promotion',
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({
    example: 'Discount for winter collection',
    description: 'Updated description',
  })
  @IsOptional()
  @IsString()
  description?: string;

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
  discountRate?: number;

  @ApiPropertyOptional({
    example: '2025-07-01T00:00:00.000Z',
    description: 'Updated start date',
  })
  @Transform(({ value }) => new Date(value))
  @IsOptional()
  @IsNotEmpty()
  startDate?: Date;

  @ApiPropertyOptional({
    example: '2025-07-31T23:59:59.000Z',
    description: 'Updated end date',
  })
  @Transform(({ value }) => new Date(value))
  @IsOptional()
  @IsNotEmpty()
  endDate?: Date;
}
