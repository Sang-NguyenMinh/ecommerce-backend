import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { ProductCategory } from 'src/core/product-category/schemas/product-category.schema';

export type VariationDocument = HydratedDocument<Variation>;

@Schema({
  timestamps: true,
})
export class Variation {
  @Prop()
  name: string;

  @Prop()
  description?: string;

  @Prop({ default: true })
  isActive: boolean;
}

export const VariationSchema = SchemaFactory.createForClass(Variation);
