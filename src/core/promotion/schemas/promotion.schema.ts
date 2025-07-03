import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export enum DiscountTypeEnum {
  PERCENTAGE = 'Percentage',
  FIXED_AMOUNT = 'Fixed',
}

export type PromotionDocument = HydratedDocument<Promotion>;

@Schema({ timestamps: true })
export class Promotion {
  @Prop({ required: true })
  name: string;

  @Prop()
  description: string;

  @Prop({
    required: true,
    enum: DiscountTypeEnum,
    default: DiscountTypeEnum.PERCENTAGE,
  })
  discountType: DiscountTypeEnum;

  @Prop({ required: true, min: 0 })
  discountValue: number;

  @Prop({ min: 0 })
  maxDiscountAmount?: number;

  @Prop({ min: 0, default: 0 })
  minOrderValue: number;

  @Prop({ required: true })
  startDate: Date;

  @Prop({ required: true })
  endDate: Date;

  @Prop({ min: 0 })
  usageLimit?: number;

  @Prop({ min: 0, default: 0 })
  usedCount: number;

  @Prop({ default: true })
  isActive: boolean;
}

export const PromotionSchema = SchemaFactory.createForClass(Promotion);
