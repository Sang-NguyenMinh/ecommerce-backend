import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { User } from 'src/core/user/schemas/user.schema';

export type ShoppingCartDocument = HydratedDocument<ShoppingCart>;

@Schema()
export class ShoppingCart {
  @Prop({ type: Types.ObjectId, ref: User.name, required: true })
  userId: Types.ObjectId;
}

export const ShoppingCartSchema = SchemaFactory.createForClass(ShoppingCart);
