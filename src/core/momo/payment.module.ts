import { Module } from '@nestjs/common';
import { PaymentController } from './payment.controller';
import { MomoService } from './payment.service';

@Module({
  imports: [],
  controllers: [PaymentController],
  providers: [MomoService],
  exports: [MomoService],
})
export class PaymentModule {}
