import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Promotion } from 'src/core/promotion/schemas/promotion.schema';
import { ShopOrder } from 'src/core/shop-order/schemas/shop-order.schema';
import { User } from 'src/core/user/schemas/user.schema';

export type PromotionUsageDocument = HydratedDocument<PromotionUsage>;

@Schema({ timestamps: true })
export class PromotionUsage {
  @Prop({
    type: Types.ObjectId,
    ref: Promotion.name,
    required: true,
  })
  promotionId: Types.ObjectId;

  @Prop({
    type: Types.ObjectId,
    ref: User.name,
    required: true,
  })
  userId: Types.ObjectId;

  @Prop({
    type: Types.ObjectId,
    ref: ShopOrder.name,
    required: true,
  })
  orderId: Types.ObjectId;

  @Prop({ required: true, min: 0 })
  discountAmount: number;

  @Prop({ required: true })
  usedAt: Date;
}

export const PromotionUsageSchema =
  SchemaFactory.createForClass(PromotionUsage);
