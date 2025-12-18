import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { Types } from 'mongoose';
import { BaseQueryDto } from 'src/core/base/base.dto';
export class ProductQueryDto extends BaseQueryDto {
  @ApiPropertyOptional({ description: 'Filter by category ID' })
  @IsOptional()
  @IsString()
  categoryId?: string;

  @ApiPropertyOptional({ description: 'Minimum price' })
  @IsOptional()
  @IsNumber()
  minPrice?: number;

  @ApiPropertyOptional({ description: 'Maximum price' })
  @IsOptional()
  @IsNumber()
  maxPrice?: number;

  @ApiPropertyOptional({ description: 'Filter products in stock' })
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true)
  inStock?: boolean;

  @ApiPropertyOptional({ description: 'Filter by product name' })
  @IsOptional()
  @IsString()
  productName?: string;
}

export class CreateProductDto {
  @ApiProperty({ example: 'Áo thun', description: 'Name of the product' })
  @IsString()
  @IsNotEmpty()
  productName: string;

  @ApiPropertyOptional({
    description: 'Product thumbnail file',
    format: 'binary',
  })
  @IsOptional()
  thumbnails?: any[];

  @ApiProperty({
    example: 499.99,
    description: 'Price of the product item',
  })
  @Transform(({ value }) => parseFloat(value))
  @IsNumber()
  @IsNotEmpty()
  price: number;

  @ApiPropertyOptional({
    example: 'A beautiful T-shirt',
    description: 'Product content',
  })
  @IsOptional()
  @IsString()
  content?: string;

  @ApiPropertyOptional({
    example: '67d99c4c23ddec1193fe79d0',
    description: 'Category ID',
  })
  @IsOptional()
  @IsMongoId()
  categoryId?: Types.ObjectId;
}

export class UpdateProductDto {
  @ApiPropertyOptional({
    example: 'Love Bracelet',
    description: 'Name of the product',
  })
  @IsOptional()
  @IsString()
  productName?: string;

  @ApiPropertyOptional({
    description: 'New product thumbnail files',
    type: 'array',
    items: {
      type: 'string',
      format: 'binary',
    },
  })
  @IsOptional()
  thumbnails?: any;

  @ApiPropertyOptional({
    description: 'Existing thumbnail URLs to keep (as JSON string or array)',
    example: '["https://example.com/image1.jpg"',
  })
  @IsOptional()
  @Transform(({ value }) => {
    console.log('Transform existingThumbnails value:', value, typeof value);

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
  existingThumbnails?: string[];

  @ApiPropertyOptional({
    example: 499.99,
    description: 'Updated price of the product item',
  })
  @Transform(({ value }) => parseFloat(value))
  @IsNumber()
  @IsOptional()
  price?: number;

  @ApiPropertyOptional({
    example: 'A beautiful bracelet for couples',
    description: 'Product content',
  })
  @IsOptional()
  @IsString()
  content?: string;

  @ApiPropertyOptional({
    example: '67d99c4c23ddec1193fe79d0',
    description: 'Category ID',
  })
  @IsOptional()
  @IsMongoId()
  categoryId?: Types.ObjectId;
}
