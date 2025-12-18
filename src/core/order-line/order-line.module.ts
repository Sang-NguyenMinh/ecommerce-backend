import { forwardRef, Module } from '@nestjs/common';
import { OrderLineService } from './order-line.service';
import { OrderLineController } from './order-line.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { OrderLine, OrderLineSchema } from './schemas/order-line.schema';
import { ShopOrderModule } from '../shop-order/shop-order.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: OrderLine.name, schema: OrderLineSchema },
    ]),
    forwardRef(() => ShopOrderModule),
  ],
  controllers: [OrderLineController],
  providers: [OrderLineService],
  exports: [OrderLineService, MongooseModule],
})
export class OrderLineModule {}
