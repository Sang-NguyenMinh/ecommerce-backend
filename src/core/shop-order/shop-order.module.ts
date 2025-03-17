import { Module } from '@nestjs/common';
import { ShopOrderService } from './shop-order.service';
import { ShopOrderController } from './shop-order.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ShopOrder, ShopOrderSchema } from './schemas/shop-order.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ShopOrder.name, schema: ShopOrderSchema },
    ]),
  ],
  controllers: [ShopOrderController],
  providers: [ShopOrderService],
})
export class ShopOrderModule {}
