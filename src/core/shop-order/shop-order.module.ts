import { Module } from '@nestjs/common';
import { ShopOrderService } from './shop-order.service';
import { ShopOrderController } from './shop-order.controller';

@Module({
  controllers: [ShopOrderController],
  providers: [ShopOrderService],
})
export class ShopOrderModule {}
