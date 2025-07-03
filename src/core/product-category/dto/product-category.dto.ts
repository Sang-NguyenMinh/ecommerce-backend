import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsMongoId, IsOptional, IsString } from 'class-validator';
import { Types } from 'mongoose';
import { BaseQueryDto } from 'src/core/base/base.dto';

export class ProductCategoryQueryDto extends BaseQueryDto {}

export class CreateProductCategoryDto {
  @ApiProperty({
    example: 'Jeans',
    description: 'Product category name',
  })
  @IsString()
  categoryName: string;

  @ApiPropertyOptional({
    example: '65f25a3d6e4b3b001c2d5a8e',
    description: 'Parent category ID (if any)',
  })
  @IsOptional()
  parentCategory?: string;

  @ApiPropertyOptional({
    example: true,
    description: 'Status of the product category (active/inactive)',
  })
  @IsOptional()
  status?: boolean;

  @ApiPropertyOptional({
    example: ['65f25a3d6e4b3b001c2d5a8f', '65f25a3d6e4b3b001c2d5a90'],
    description: 'Array of variation IDs',
  })
  @IsOptional()
  variations?: string[];
}

export class UpdateProductCategoryDto {
  @ApiPropertyOptional({
    example: 'Smartphones',
    description: 'New category name (if you want to update)',
  })
  @IsOptional()
  @IsString()
  categoryName?: string;

  @ApiPropertyOptional({
    example: '65f25a3d6e4b3b001c2d5a8e',
    description: 'New parent category ID (if you want to update)',
  })
  @IsOptional()
  @IsMongoId()
  parentCategory?: Types.ObjectId;

  @ApiPropertyOptional({
    example: true,
    description: 'Status of the product category (active/inactive)',
  })
  @IsOptional()
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      return value === 'true';
    }
    return value;
  })
  status?: boolean;

  @ApiPropertyOptional({
    example: ['65f25a3d6e4b3b001c2d5a8f', '65f25a3d6e4b3b001c2d5a90'],
    description: 'Array of variation IDs',
  })
  @IsOptional()
  variations?: string[];
}
