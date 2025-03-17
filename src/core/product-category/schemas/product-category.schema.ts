import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type ProductCategoryDocument = HydratedDocument<ProductCategory>;

@Schema()
export class ProductCategory {
  @Prop()
  categoryName: string;

  @Prop({ type: Types.ObjectId, ref: ProductCategory.name, default: null })
  parentCategoryId?: Types.ObjectId;
}

export const ProductCategorySchema =
  SchemaFactory.createForClass(ProductCategory);
