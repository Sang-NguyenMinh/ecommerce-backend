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
import { ShopOrderService } from './shop-order.service';
import {
  ApiBearerAuth,
  ApiParam,
  ApiResponse,
  ApiTags,
  ApiOperation,
} from '@nestjs/swagger';
import { BaseController } from '../base/base.controller';
import { ShopOrderDocument } from './schemas/shop-order.schema';
import {
  CreateShopOrderDto,
  UpdateShopOrderDto,
  TrackGuestOrderDto,
} from './dto/shop-order.dto';
import { BaseQueryDto } from '../base/base.dto';
import { FilterQuery } from 'mongoose';
import { BaseQueryResult } from '../base/base.service';
import { OrderStatusEnum } from 'src/config/constants';

@ApiTags('Shop Order')
@Controller('shop-order')
export class ShopOrderController extends BaseController<
  ShopOrderDocument,
  ShopOrderService
> {
  constructor(private readonly shopOrderService: ShopOrderService) {
    super(shopOrderService, 'shop-order', []);
  }

  @Post()
  @ApiOperation({
    summary: 'Create order (Guest or User)',
    description: 'Create order for guest (without login) or authenticated user',
  })
  @ApiResponse({ status: 201, description: 'Order created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async create(@Body() createDto: CreateShopOrderDto) {
    return this.shopOrderService.create(createDto);
  }

  @Post('track-guest')
  @ApiOperation({
    summary: 'Track guest order',
    description: 'Track order using order token and email (for guest orders)',
  })
  @ApiResponse({ status: 200, description: 'Order found successfully' })
  @ApiResponse({ status: 404, description: 'Order not found' })
  async trackGuestOrder(@Body() trackDto: TrackGuestOrderDto) {
    return this.shopOrderService.trackGuestOrder(trackDto);
  }

  @Get()
  @ApiBearerAuth()
  @ApiResponse({ status: 200, description: 'Get all orders successfully' })
  async findAll(
    @Query() queryDto: BaseQueryDto,
  ): Promise<BaseQueryResult<ShopOrderDocument>> {
    const filter = this.buildFilter(queryDto);
    const options = this.buildOptions(queryDto);

    return await this.shopOrderService.findAll(filter, options);
  }

  @Get('user/:userId')
  @ApiBearerAuth()
  @ApiParam({ name: 'userId', description: 'User ID' })
  @ApiResponse({ status: 200, description: 'Get user orders successfully' })
  async getOrdersByUserId(@Param('userId') userId: string) {
    return this.shopOrderService.getOrdersByUserId(userId);
  }

  @Get('status/:status')
  @ApiBearerAuth()
  @ApiParam({
    name: 'status',
    description: 'Order Status',
    enum: OrderStatusEnum,
  })
  @ApiResponse({
    status: 200,
    description: 'Get orders by status successfully',
  })
  async getOrdersByStatus(@Param('status') status: OrderStatusEnum) {
    return this.shopOrderService.getOrdersByStatus(status);
  }

  @Get('revenue')
  @ApiBearerAuth()
  @ApiResponse({ status: 200, description: 'Get total revenue successfully' })
  async getTotalRevenue(@Query('userId') userId?: string) {
    const revenue = await this.shopOrderService.getTotalRevenue(userId);
    return { revenue };
  }

  @Get(':id/details')
  @ApiParam({ name: 'id', description: 'Order ID' })
  @ApiResponse({ status: 200, description: 'Get order details successfully' })
  @ApiResponse({ status: 404, description: 'Order not found' })
  async getOrderWithDetails(@Param('id') id: string) {
    return this.shopOrderService.getOrderWithDetails(id);
  }

  @Patch(':id')
  @ApiBearerAuth()
  @ApiParam({ name: 'id', description: 'Order ID' })
  @ApiResponse({ status: 200, description: 'Order updated successfully' })
  @ApiResponse({ status: 404, description: 'Order not found' })
  async update(@Param('id') id: string, @Body() updateDto: UpdateShopOrderDto) {
    return this.shopOrderService.update(id, updateDto);
  }

  @Patch(':id/status')
  @ApiBearerAuth()
  @ApiParam({ name: 'id', description: 'Order ID' })
  @ApiResponse({
    status: 200,
    description: 'Order status updated successfully',
  })
  @ApiResponse({ status: 404, description: 'Order not found' })
  async updateOrderStatus(
    @Param('id') id: string,
    @Body('orderStatus') orderStatus: OrderStatusEnum,
  ) {
    return this.shopOrderService.updateOrderStatus(id, orderStatus);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @ApiParam({ name: 'id', description: 'Order ID' })
  @ApiResponse({ status: 200, description: 'Order deleted successfully' })
  @ApiResponse({ status: 404, description: 'Order not found' })
  async remove(@Param('id') id: string) {
    return this.shopOrderService.remove(id);
  }

  @Post('track-guest-by-id')
  async trackGuestOrderByOrderId(@Body() trackDto: { orderId: string }) {
    return await this.shopOrderService.trackGuestOrderByOrderId(
      trackDto.orderId,
    );
  }

  protected buildFilter(
    queryDto: BaseQueryDto,
  ): FilterQuery<ShopOrderDocument> {
    const filter = super.buildFilter(queryDto);

    // Custom filters
    // Can add filter by orderStatus, paymentType, isGuestOrder, etc.

    return filter;
  }
}
