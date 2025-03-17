import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Promotion } from 'src/core/promotion/schemas/promotion.schema';
export type PromotionCategoryDocument = HydratedDocument<PromotionCategory>;

@Schema()
export class PromotionCategory {
  @Prop({ type: Types.ObjectId, ref: PromotionCategory.name, required: true })
  categoryId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: Promotion.name, required: true })
  promotionId: Types.ObjectId;
}

export const PromotionCategorySchema =
  SchemaFactory.createForClass(PromotionCategory);
