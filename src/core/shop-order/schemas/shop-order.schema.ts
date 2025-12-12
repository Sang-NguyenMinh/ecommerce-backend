import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { OrderStatusEnum, PaymentTypeEnum } from 'src/config/constants';
import { ShippingMethod } from 'src/core/shipping-method/schemas/shipping-method.scheme';
import { UserAddress } from 'src/core/user-address/schemas/user-address.schema';
import { User } from 'src/core/user/schemas/user.schema';

export type ShopOrderDocument = HydratedDocument<ShopOrder>;

@Schema({ timestamps: true })
export class ShopOrder {
  // Shipping method (optional for both user and guest)
  @Prop({ type: Types.ObjectId, ref: ShippingMethod.name })
  shippingMethodId: Types.ObjectId;

  // User order fields (NULL if guest order)
  @Prop({ type: Types.ObjectId, ref: User.name, default: null })
  userId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: UserAddress.name, default: null })
  shippingAddress: Types.ObjectId;

  // Guest order identifier
  @Prop({ default: false })
  isGuestOrder: boolean;

  @Prop({ type: String, unique: true, sparse: true })
  orderToken: string; // For guest order tracking

  // Guest order fields
  @Prop({ type: String })
  guestEmail: string;

  @Prop({ type: String })
  guestPhone: string;

  @Prop({ type: String })
  guestName: string;

  @Prop({ type: String })
  guestShippingAddress: string;

  // Common fields
  @Prop({
    required: true,
    enum: OrderStatusEnum,
    default: OrderStatusEnum.PENDING,
  })
  orderStatus: OrderStatusEnum;

  @Prop({
    required: true,
    enum: PaymentTypeEnum,
    default: PaymentTypeEnum.CASH,
  })
  paymentType: PaymentTypeEnum;

  @Prop({ required: true, min: 0, default: 0 })
  orderTotal: number;

  @Prop({ default: true })
  isActive: boolean;
}

export const ShopOrderSchema = SchemaFactory.createForClass(ShopOrder);

// Add indexes for better query performance
// ShopOrderSchema.index({ userId: 1, createdAt: -1 });
// ShopOrderSchema.index({ orderToken: 1, guestEmail: 1 });
// ShopOrderSchema.index({ orderStatus: 1 });
// ShopOrderSchema.index({ isGuestOrder: 1 });
// ShopOrderSchema.index({ createdAt: -1 });
