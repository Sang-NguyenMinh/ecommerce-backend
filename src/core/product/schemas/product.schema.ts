import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { ProductCategory } from 'src/core/product-category/schemas/product-category.schema';

export type ProductDocument = HydratedDocument<Product>;

@Schema()
export class Product {
  @Prop()
  productName: string;

  @Prop()
  thumbnails?: any[];

  @Prop()
  price: number;

  @Prop()
  content?: string;

  @Prop({ type: Types.ObjectId, ref: ProductCategory.name, default: null })
  categoryId?: Types.ObjectId;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
