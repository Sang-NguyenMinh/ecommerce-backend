import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { OrderLineService } from './order-line.service';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Roles } from 'src/decorators/customize';
import { CreateOrderLineDto, UpdateOrderLineDto } from './dto/order-line.dto';

@ApiBearerAuth()
@Controller('order-line')
export class OrderLineController {
  constructor(private readonly orderLineService: OrderLineService) {}

  @Roles('Admin')
  @Post()
  create(@Body() createOrderLineDto: CreateOrderLineDto) {
    return this.orderLineService.create(createOrderLineDto);
  }

  @Get()
  findAll() {
    return this.orderLineService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.orderLineService.findOne(id);
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
