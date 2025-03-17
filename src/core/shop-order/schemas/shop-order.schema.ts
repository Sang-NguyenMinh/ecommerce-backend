import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { OrderStatusEnum, PaymentTypeEnum } from 'src/config/type';
import { ShippingMethod } from 'src/core/shipping-method/schemas/shipping-method.scheme';
import { UserAddress } from 'src/core/user-address/schemas/user-address.schema';
import { User } from 'src/core/user/schemas/user.schema';

@Schema({ timestamps: true })
export class ShopOrder {
  @Prop({ type: Types.ObjectId, ref: ShippingMethod.name })
  shoppingMethodId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: User.name })
  userId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: UserAddress.name })
  shippingAddress: Types.ObjectId;

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

  @Prop()
  orderTotal: number;
}

export const ShopOrderSchema = SchemaFactory.createForClass(ShopOrder);
