import { Optional } from '@nestjs/common';
import { Prop, Schema } from '@nestjs/mongoose';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsMongoId, IsOptional, IsBoolean } from 'class-validator';
import { Types } from 'mongoose';
import { ProductCategory } from 'src/core/product-category/schemas/product-category.schema';
import { Variation } from 'src/core/variation/schemas/variation.schema';
@Schema()
export class CategoryVariation {
  @Prop({ type: Types.ObjectId, ref: ProductCategory.name })
  @ApiProperty({
    example: '65f25a3d6e4b3b001c2d5a8e',
    description: 'Category ID',
  })
  @IsMongoId()
  categoryId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: Variation.name })
  @ApiProperty({
    example: '65f25a3d6e4b3b001c2d5a8f',
    description: 'Variation ID',
  })
  @IsMongoId()
  variationId: Types.ObjectId;

  @Prop({ default: true })
  @ApiPropertyOptional({
    example: true,
    description: 'Is the variation required?',
  })
  @IsOptional()
  @IsBoolean()
  required?: boolean;
}

export class CreateCategoryVariationDto extends CategoryVariation {}

export class UpdateCategoryVariationDto {
  @Prop({ type: Types.ObjectId, ref: ProductCategory.name })
  @ApiProperty({
    example: '65f25a3d6e4b3b001c2d5a8e',
    description: 'Category ID',
  })
  @Optional()
  @IsMongoId()
  categoryId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: Variation.name })
  @ApiProperty({
    example: '65f25a3d6e4b3b001c2d5a8f',
    description: 'Variation ID',
  })
  @IsMongoId()
  @Optional()
  variationId: Types.ObjectId;

  @Prop({ default: true })
  @ApiPropertyOptional({
    example: true,
    description: 'Is the variation required?',
  })
  @IsOptional()
  @IsBoolean()
  required?: boolean;
}
