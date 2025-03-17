import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Product } from 'src/core/product/schemas/product.schema';

export type ProductItemDocument = HydratedDocument<ProductItem>;

@Schema()
export class ProductItem {
  @Prop({ type: Types.ObjectId, ref: Product.name, required: true })
  productId: Types.ObjectId;

  @Prop({ required: true })
  SKU: string;

  @Prop()
  price: number;

  @Prop()
  qtyInStock: number;
}

export const ProductItemSchema = SchemaFactory.createForClass(ProductItem);
