import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { PaymentTypeService } from './payment-type.service';

@Controller('payment-type')
export class PaymentTypeController {
  constructor(private readonly paymentTypeService: PaymentTypeService) {}

  @Post()
  create(@Body() createPaymentTypeDto: any) {
    return this.paymentTypeService.create(createPaymentTypeDto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePaymentTypeDto: any) {
    return this.paymentTypeService.update(+id, updatePaymentTypeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.paymentTypeService.remove(+id);
  }
}
