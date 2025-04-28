import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsMongoId, IsOptional, IsString } from 'class-validator';
import { Types } from 'mongoose';

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
  @IsMongoId()
  parentCategory?: Types.ObjectId;

  @ApiPropertyOptional({
    example: true,
    description: 'Status of the product category (active/inactive)',
  })
  @IsOptional()
  status?: boolean;
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
  status?: boolean;
}
