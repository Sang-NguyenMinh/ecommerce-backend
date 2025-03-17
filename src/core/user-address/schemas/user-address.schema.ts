import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as HydratedDocument, Types } from 'mongoose';
import { User } from 'src/core/user/schemas/user.schema';

export type UserAddressDocument = HydratedDocument<UserAddress>;

@Schema()
export class UserAddress extends Document {
  @Prop({ type: Types.ObjectId, ref: User.name })
  userId: Types.ObjectId;

  @Prop()
  address: string;

  @Prop({ default: true })
  isDefault: boolean;
}

export const UserAddressSchema = SchemaFactory.createForClass(UserAddress);
