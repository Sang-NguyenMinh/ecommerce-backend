import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ShippingMethodDocument = HydratedDocument<ShippingMethod>;

@Schema()
export class ShippingMethod {
  @Prop()
  name: string;

  @Prop()
  price: number;
}

export const ShippingMethodSchema =
  SchemaFactory.createForClass(ShippingMethod);
