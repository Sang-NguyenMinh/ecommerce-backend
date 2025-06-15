import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Variation } from 'src/core/variation/schemas/variation.schema';

export type VariationOptionDocument = HydratedDocument<VariationOption>;

@Schema()
export class VariationOption {
  @Prop({ required: true })
  name: string;
  @Prop()
  value: string;

  @Prop({ type: Types.ObjectId, ref: Variation.name })
  variationId: Types.ObjectId;
}

export const VariationOptionSchema =
  SchemaFactory.createForClass(VariationOption);
