import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { ProductCategory } from 'src/core/product-category/schemas/product-category.schema';
import { Promotion } from 'src/core/promotion/schemas/promotion.schema';
export type PromotionCategoryDocument = HydratedDocument<PromotionCategory>;

@Schema({ timestamps: true })
export class PromotionCategory {
  @Prop({ type: Types.ObjectId, ref: ProductCategory.name, required: true })
  categoryId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: Promotion.name, required: true })
  promotionId: Types.ObjectId;

  @Prop({ default: true })
  includeSubCategories: boolean;
}

export const PromotionCategorySchema =
  SchemaFactory.createForClass(PromotionCategory);
