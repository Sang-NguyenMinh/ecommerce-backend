import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { Types } from 'mongoose';
import { Transform } from 'class-transformer';
import { BaseQueryDto } from 'src/core/base/base.dto';

export class CreateProductItemDto {
  @ApiProperty({
    example: '67d99c94245a36412d744bdd',
    description: 'The ID of the product this item belongs to',
  })
  @IsMongoId()
  @IsNotEmpty()
  productId: Types.ObjectId;

  @ApiPropertyOptional({
    example: ['65f25a3d6e4b3b001c2d5a8f', '65f25a3d6e4b3b001c2d5a90'],
    description: 'Array of variation-option IDs',
  })
  @IsOptional()
  configurations?: any[];

  @ApiProperty({
    example: 'NIKE-RED-S',
    description: 'Unique Stock Keeping Unit (SKU) of the product item',
  })
  @IsString()
  @IsNotEmpty()
  SKU: string;

  @ApiProperty({
    example: 499.99,
    description: 'Price of the product item',
  })
  @Transform(({ value }) => parseFloat(value))
  @IsNumber()
  @IsNotEmpty()
  price: number;

  @ApiPropertyOptional({
    description: 'New product thumbnail files',
    type: 'array',
    items: {
      type: 'string',
      format: 'binary',
    },
  })
  @IsOptional()
  images?: any;

  @ApiPropertyOptional({
    description: 'Existing thumbnail URLs to keep (as JSON string or array)',
    example:
      '["https://example.com/image1.jpg", "https://example.com/image2.jpg"]',
  })
  @IsOptional()
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      try {
        const parsed = JSON.parse(value);
        return Array.isArray(parsed) ? parsed : [value];
      } catch {
        return [value];
      }
    }

    if (Array.isArray(value)) {
      return value;
    }

    return [];
  })
  existingImages?: string[];

  @ApiProperty({
    example: 100,
    description: 'Quantity in stock',
  })
  @IsNumber()
  @Transform(({ value }) => parseFloat(value))
  @IsNotEmpty()
  qtyInStock: number;
}

export class UpdateProductItemDto {
  @ApiPropertyOptional({
    example: '67d99c94245a36412d744bdd',
    description: 'The ID of the product item to update',
  })
  @IsMongoId()
  @IsOptional()
  id?: Types.ObjectId;

  @ApiPropertyOptional({
    example: 'NIKE-RED-S',
    description: 'Updated SKU of the product item',
  })
  @IsString()
  @IsOptional()
  SKU?: string;

  @ApiPropertyOptional({
    example: 499.99,
    description: 'Updated price of the product item',
  })
  @Transform(({ value }) => parseFloat(value))
  @IsNumber()
  @IsOptional()
  price?: number;

  @ApiPropertyOptional({
    description: 'Updated list of image URLs for the product item',
    type: 'string',
    format: 'binary',
  })
  @IsOptional()
  images?: string[];

  @ApiPropertyOptional({
    example: 100,
    description: 'Updated quantity in stock',
  })
  @IsNumber()
  @Transform(({ value }) => parseFloat(value))
  @IsOptional()
  qtyInStock?: number;
}
export class ProductItemQueryDto extends BaseQueryDto {
  @ApiPropertyOptional({ description: 'Filter by product ID' })
  @IsOptional()
  @IsMongoId()
  productId?: string;

  @ApiPropertyOptional({ description: 'Filter by category ID' })
  @IsOptional()
  @IsMongoId()
  categoryId?: string;

  @ApiPropertyOptional({
    description:
      'Filter by variation option IDs (comma-separated string or array)',
    type: String,
  })
  @IsOptional()
  @Transform(({ value }) =>
    typeof value === 'string' ? value.split(',').map((s) => s.trim()) : value,
  )
  @IsMongoId({ each: true })
  variationOptionIds?: string[];

  @ApiPropertyOptional({ description: 'Minimum price' })
  @IsOptional()
  @IsNumber()
  minPrice?: number;

  @ApiPropertyOptional({ description: 'Maximum price' })
  @IsOptional()
  @IsNumber()
  maxPrice?: number;

  @ApiPropertyOptional({
    description: 'Include out of stock items',
    default: true,
  })
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  includeOutOfStock?: boolean = true;
}
