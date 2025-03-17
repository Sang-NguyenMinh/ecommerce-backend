import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { ProductItem } from 'src/core/product-item/schemas/product-item.schema';
import { Promotion } from 'src/core/promotion/schemas/promotion.schema';

export type PromotionProductDocument = HydratedDocument<PromotionProduct>;

@Schema()
export class PromotionProduct {
  @Prop({
    type: Types.ObjectId,
    ref: ProductItem.name,
  })
  productItemId: Types.ObjectId;

  @Prop({
    type: Types.ObjectId,
    ref: Promotion.name,
  })
  promotionId: Types.ObjectId;

  @Prop()
  discountPrice?: number;
}

export const PromotionProductSchema =
  SchemaFactory.createForClass(PromotionProduct);
