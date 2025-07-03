import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsMongoId, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Types } from 'mongoose';

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
    example:
      '["https://example.com/image1.jpg", "https://example.com/image2.jpg"]',
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
