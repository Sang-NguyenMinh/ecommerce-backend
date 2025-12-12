import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { OrderLineService } from './order-line.service';
import { ApiBearerAuth, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { BaseController } from '../base/base.controller';
import { OrderLineDocument } from './schemas/order-line.schema';
import { CreateOrderLineDto, UpdateOrderLineDto } from './dto/order-line.dto';
import { BaseQueryDto } from '../base/base.dto';
import { BaseQueryResult } from '../base/base.service';

@ApiTags('Order Line')
@ApiBearerAuth()
@Controller('order-line')
export class OrderLineController extends BaseController<
  OrderLineDocument,
  OrderLineService
> {
  constructor(private readonly orderLineService: OrderLineService) {
    super(orderLineService, 'order-line', []);
  }

  @Post()
  @ApiResponse({ status: 201, description: 'Order line created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async create(@Body() createDto: CreateOrderLineDto) {
    return this.orderLineService.create(createDto);
  }

  @Get()
  @ApiResponse({ status: 200, description: 'Get all order lines successfully' })
  async findAll(
    @Query() queryDto: BaseQueryDto,
  ): Promise<BaseQueryResult<OrderLineDocument>> {
    const filter = this.buildFilter(queryDto);
    const options = this.buildOptions(queryDto);

    return await this.orderLineService.findAll(filter, options);
  }

  @Get('order/:orderId')
  @ApiParam({ name: 'orderId', description: 'Order ID' })
  @ApiResponse({
    status: 200,
    description: 'Get order lines by order ID successfully',
  })
  async getOrderLinesByOrderId(@Param('orderId') orderId: string) {
    return this.orderLineService.getOrderLinesByOrderId(orderId);
  }

  @Get('order/:orderId/total')
  @ApiParam({ name: 'orderId', description: 'Order ID' })
  @ApiResponse({
    status: 200,
    description: 'Calculate order total successfully',
  })
  async calculateOrderTotal(@Param('orderId') orderId: string) {
    const total = await this.orderLineService.calculateOrderTotal(orderId);
    return { total };
  }

  @Patch(':id')
  @ApiParam({ name: 'id', description: 'Order line ID' })
  @ApiResponse({ status: 200, description: 'Order line updated successfully' })
  @ApiResponse({ status: 404, description: 'Order line not found' })
  async update(@Param('id') id: string, @Body() updateDto: UpdateOrderLineDto) {
    return this.orderLineService.update(id, updateDto);
  }

  @Delete(':id')
  @ApiParam({ name: 'id', description: 'Order line ID' })
  @ApiResponse({ status: 200, description: 'Order line deleted successfully' })
  @ApiResponse({ status: 404, description: 'Order line not found' })
  async remove(@Param('id') id: string) {
    return this.orderLineService.remove(id);
  }
}
