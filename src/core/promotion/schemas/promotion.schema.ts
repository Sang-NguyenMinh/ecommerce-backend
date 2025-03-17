import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type PromotionDocument = HydratedDocument<Promotion>;

@Schema()
export class Promotion {
  @Prop({ required: true })
  name: string;
  @Prop()
  description: string;

  @Prop({ required: true, min: 0, max: 100 })
  discountRate: number;

  @Prop({ required: true })
  startDate: Date;

  @Prop({ required: true })
  endDate: Date;
}

export const PromotionSchema = SchemaFactory.createForClass(Promotion);
