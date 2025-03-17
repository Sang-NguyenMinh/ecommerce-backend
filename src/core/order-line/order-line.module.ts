import { Module } from '@nestjs/common';
import { OrderLineService } from './order-line.service';
import { OrderLineController } from './order-line.controller';

@Module({
  controllers: [OrderLineController],
  providers: [OrderLineService],
})
export class OrderLineModule {}
