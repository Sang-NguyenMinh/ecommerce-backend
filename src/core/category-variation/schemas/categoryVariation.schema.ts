import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { ProductCategory } from 'src/core/product-category/schemas/product-category.schema';
import { Variation } from 'src/core/variation/schemas/variation.schema';

export type CategoryVariationDocument = HydratedDocument<CategoryVariation>;

@Schema({ timestamps: true })
export class CategoryVariation {
  @Prop({ type: Types.ObjectId, ref: ProductCategory.name })
  categoryId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: Variation.name })
  variationId: Types.ObjectId;
}

export const CategoryVariationSchema =
  SchemaFactory.createForClass(CategoryVariation);
