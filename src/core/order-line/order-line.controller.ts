import { Controller, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { OrderLineService } from './order-line.service';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Roles } from 'src/decorators/customize';
import { CreateOrderLineDto, UpdateOrderLineDto } from './dto/order-line.dto';
import { OrderLineDocument } from './schemas/order-line.schema';
import { BaseController } from '../base/base.controller';

@ApiBearerAuth()
@Controller('order-line')
export class OrderLineController extends BaseController<
  OrderLineDocument,
  OrderLineService
> {
  constructor(private readonly orderLineService: OrderLineService) {
    super(orderLineService, 'Order Line');
  }

  @Roles('Admin')
  @Post()
  create(@Body() createOrderLineDto: CreateOrderLineDto) {
    return this.orderLineService.create(createOrderLineDto);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateOrderLineDto: UpdateOrderLineDto,
  ) {
    return this.orderLineService.update(updateOrderLineDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.orderLineService.remove(+id);
  }
}
