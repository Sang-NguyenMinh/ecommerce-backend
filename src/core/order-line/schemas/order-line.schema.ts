import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { ProductItem } from 'src/core/product-item/schemas/product-item.schema';
import { ShopOrder } from 'src/core/shop-order/schemas/shop-order.schema';

export type OrderLineDocument = HydratedDocument<OrderLine>;

@Schema()
export class OrderLine {
  @Prop({ type: Types.ObjectId, ref: ProductItem.name, required: true })
  productItemId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: ShopOrder.name, required: true })
  orderId: Types.ObjectId;

  @Prop({ required: true, min: 1 })
  qty: number;

  @Prop({ required: true, min: 0 })
  price: number;
}

export const OrderLineSchema = SchemaFactory.createForClass(OrderLine);
