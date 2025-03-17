import { Module } from '@nestjs/common';
import { ShippingMethodService } from './shipping-method.service';
import { ShippingMethodController } from './shipping-method.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  ShippingMethod,
  ShippingMethodSchema,
} from './schemas/shipping-method.scheme';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ShippingMethod.name, schema: ShippingMethodSchema },
    ]),
  ],
  controllers: [ShippingMethodController],
  providers: [ShippingMethodService],
})
export class ShippingMethodModule {}
