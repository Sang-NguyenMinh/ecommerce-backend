import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { Types } from 'mongoose';
import { Transform } from 'class-transformer';

export class CreateProductItemDto {
  @ApiProperty({
    example: '67d99c94245a36412d744bdd',
    description: 'The ID of the product this item belongs to',
  })
  @IsMongoId()
  @IsNotEmpty()
  productId: Types.ObjectId;

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

  @ApiProperty({
    description: 'List of image URLs for the product item',
    type: 'string',
    format: 'binary',
    isArray: true,
  })
  @IsOptional()
  images?: string[];

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
