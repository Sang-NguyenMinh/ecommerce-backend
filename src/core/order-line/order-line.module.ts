import { Module } from '@nestjs/common';
import { OrderLineService } from './order-line.service';
import { OrderLineController } from './order-line.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { OrderLine, OrderLineSchema } from './schemas/order-line.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: OrderLine.name, schema: OrderLineSchema },
    ]),
  ],
  controllers: [OrderLineController],
  providers: [OrderLineService],
})
export class OrderLineModule {}
