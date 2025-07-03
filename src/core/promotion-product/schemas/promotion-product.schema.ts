import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Product } from 'src/core/product/schemas/product.schema';
import { Promotion } from 'src/core/promotion/schemas/promotion.schema';

export type PromotionProductDocument = HydratedDocument<PromotionProduct>;

@Schema({ timestamps: true })
export class PromotionProduct {
  @Prop({
    type: Types.ObjectId,
    ref: Product.name,
    required: true,
  })
  productId: Types.ObjectId;

  @Prop({
    type: Types.ObjectId,
    ref: Promotion.name,
    required: true,
  })
  promotionId: Types.ObjectId;
}

export const PromotionProductSchema =
  SchemaFactory.createForClass(PromotionProduct);
