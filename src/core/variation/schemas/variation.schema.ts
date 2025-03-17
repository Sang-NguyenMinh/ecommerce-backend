import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { ProductCategory } from 'src/core/product-category/schemas/product-category.schema';

export type VariationDocument = HydratedDocument<Variation>;

@Schema()
export class Variation {
  @Prop()
  name: string;

  @Prop({ type: Types.ObjectId, ref: ProductCategory.name })
  productCategoryId: Types.ObjectId;
}

export const VariationSchema = SchemaFactory.createForClass(Variation);
