import { Optional } from '@nestjs/common';
import { Prop } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId } from 'class-validator';
import { Types } from 'mongoose';
import { BaseQueryDto } from 'src/core/base/base.dto';
import { ProductCategory } from 'src/core/product-category/schemas/product-category.schema';
import { Variation } from 'src/core/variation/schemas/variation.schema';
export class CategoryVariationQueryDto extends BaseQueryDto {
  @Prop({ type: Types.ObjectId, ref: ProductCategory.name })
  @ApiProperty({
    example: '65f25a3d6e4b3b001c2d5a8e',
    description: 'Category ID',
  })
  categoryId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: Variation.name })
  @ApiProperty({
    example: '65f25a3d6e4b3b001c2d5a8f',
    description: 'Variation ID',
  })
  variationId: Types.ObjectId;
}

export class CreateCategoryVariationDto {
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
}

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
}
