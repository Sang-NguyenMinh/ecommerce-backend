import { forwardRef, Module } from '@nestjs/common';
import { ShopOrderService } from './shop-order.service';
import { ShopOrderController } from './shop-order.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ShopOrder, ShopOrderSchema } from './schemas/shop-order.schema';
import { OrderLineModule } from '../order-line/order-line.module';
import {
  OrderLine,
  OrderLineSchema,
} from '../order-line/schemas/order-line.schema';
import { UserAddressModule } from '../user-address/user-address.module';
import {
  UserAddress,
  UserAddressSchema,
} from '../user-address/schemas/user-address.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ShopOrder.name, schema: ShopOrderSchema },
      { name: OrderLine.name, schema: OrderLineSchema }, // Thêm OrderLine schema
      { name: UserAddress.name, schema: UserAddressSchema },
    ]),
    forwardRef(() => OrderLineModule),
    forwardRef(() => UserAddressModule),
  ],
  controllers: [ShopOrderController],
  providers: [ShopOrderService],
  exports: [ShopOrderService],
})
export class ShopOrderModule {}
