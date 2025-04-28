import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
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
  @ApiProperty({
    example: '65f25a3d6e4b3b001c2d5a8e',
    description: 'ID of the product  to update',
  })
  @IsMongoId()
  id: string;

  @ApiPropertyOptional({
    example: 'Love Bracelet',
    description: 'Name of the product',
  })
  @IsOptional()
  @IsString()
  productName?: string;

  @ApiPropertyOptional({
    description: 'Product thumbnail file',
    type: 'string',
    format: 'binary',
  })
  @IsOptional()
  thumbnails?: any;

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
