import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { ProductCategory } from 'src/core/product-category/schemas/product-category.schema';

export type ProductDocument = HydratedDocument<Product>;

@Schema()
export class Product {
  @Prop()
  productName: string;

  @Prop()
  thumbnail?: string;

  @Prop()
  description?: string;

  @Prop({ type: Types.ObjectId, ref: ProductCategory.name, default: null })
  categoryId?: Types.ObjectId;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
