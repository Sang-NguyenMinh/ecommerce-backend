import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type UserAddressDocument = HydratedDocument<UserAddress>;

@Schema({ timestamps: true })
export class UserAddress {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ required: true })
  recipientName: string;

  @Prop({ required: true })
  phoneNumber: string;

  @Prop({ required: true })
  address: string;

  @Prop({ required: true })
  district: string;

  @Prop({ required: true })
  ward: string;

  @Prop({ required: true })
  city: string;

  @Prop({ default: true })
  isActive: boolean;
}

export const UserAddressSchema = SchemaFactory.createForClass(UserAddress);
