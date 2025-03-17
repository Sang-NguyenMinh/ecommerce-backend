import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type ShoppingCartItemDocument = HydratedDocument<ShoppingCartItem>;

@Schema()
export class ShoppingCartItem {
  @Prop({ type: Types.ObjectId, ref: 'ShoppingCart', required: true })
  cartId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'ProductItem', required: true })
  productItemId: Types.ObjectId;

  @Prop({ required: true, min: 1 })
  qty: number;
}

export const ShoppingCartItemSchema =
  SchemaFactory.createForClass(ShoppingCartItem);
