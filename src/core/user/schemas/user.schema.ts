import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as HydratedDocument } from 'mongoose';
import { ACCOUNT_TYPE, ROLES } from 'src/config/type';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User extends Document {
  @Prop()
  username?: string;

  @Prop()
  password: string;

  @Prop({ unique: true })
  email?: string;

  @Prop({ unique: true })
  phone?: string;

  @Prop()
  avatar?: string;

  @Prop({ default: ROLES.USER })
  role?: ROLES;

  @Prop({ default: ACCOUNT_TYPE.LOCAL })
  accountType?: ACCOUNT_TYPE;

  @Prop({ default: false })
  isActive?: boolean;

  @Prop()
  pushToken?: string;

  @Prop()
  codeId?: string;

  @Prop()
  codeExpired?: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
