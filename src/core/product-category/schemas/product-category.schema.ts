import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type ProductCategoryDocument = HydratedDocument<ProductCategory>;

@Schema({ timestamps: true })
export class ProductCategory {
  @Prop({ unique: true })
  categoryName: string;

  @Prop({ type: Types.ObjectId, ref: ProductCategory.name, default: null })
  parentCategory?: Types.ObjectId;

  @Prop()
  thumbnail?: string;

  @Prop({ default: true })
  status?: boolean;
}

export const ProductCategorySchema =
  SchemaFactory.createForClass(ProductCategory);
