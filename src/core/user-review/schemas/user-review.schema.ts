import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { OrderLine } from 'src/core/order-line/schemas/order-line.schema';
import { User } from 'src/core/user/schemas/user.schema';

export type UserReviewDocument = HydratedDocument<UserReview>;

@Schema()
export class UserReview {
  @Prop({ type: Types.ObjectId, ref: User.name, required: true })
  userId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: OrderLine.name, required: true })
  orderedProductId: Types.ObjectId;

  @Prop({ required: true, min: 1, max: 5 })
  ratingValue: number;

  @Prop()
  comment?: string;
}

export const UserReviewSchema = SchemaFactory.createForClass(UserReview);
