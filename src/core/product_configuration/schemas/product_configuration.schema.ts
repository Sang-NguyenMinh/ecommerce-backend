import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { ProductItem } from 'src/core/product-item/schemas/product-item.schema';
import { VariationOption } from 'src/core/variation_option/schemas/variation_option.schema';

export type ProductConfigurationDocument =
  HydratedDocument<ProductConfiguration>;

@Schema()
export class ProductConfiguration {
  @Prop({ type: Types.ObjectId, ref: ProductItem.name })
  productItemId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: VariationOption.name })
  variationOptionId: Types.ObjectId;
}

export const ProductConfigurationSchema =
  SchemaFactory.createForClass(ProductConfiguration);
