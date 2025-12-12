import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { OrderLine, OrderLineDocument } from './schemas/order-line.schema';
import { BaseService } from '../base/base.service';
import { CreateOrderLineDto, UpdateOrderLineDto } from './dto/order-line.dto';

@Injectable()
export class OrderLineService extends BaseService<OrderLineDocument> {
  constructor(
    @InjectModel(OrderLine.name)
    private orderLineModel: Model<OrderLineDocument>,
  ) {
    super(orderLineModel);
  }

  async create(createDto: CreateOrderLineDto): Promise<OrderLineDocument> {
    try {
      const created = new this.orderLineModel(createDto);
      return await created.save();
    } catch (error) {
      console.error('Error creating order line:', error);
      throw new HttpException(
        'Error creating order line',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async update(
    id: string,
    updateDto: UpdateOrderLineDto,
  ): Promise<OrderLineDocument> {
    try {
      if (!Types.ObjectId.isValid(id)) {
        throw new HttpException('Invalid ID format', HttpStatus.BAD_REQUEST);
      }

      const updated = await this.orderLineModel.findByIdAndUpdate(
        id,
        updateDto,
        { new: true, lean: false },
      );

      if (!updated) {
        throw new HttpException('Order line not found', HttpStatus.NOT_FOUND);
      }

      return updated;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.error('Error updating order line:', error);
      throw new HttpException(
        'Error updating order line',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async remove(id: string): Promise<{ message: string }> {
    try {
      if (!Types.ObjectId.isValid(id)) {
        throw new HttpException('Invalid ID format', HttpStatus.BAD_REQUEST);
      }

      const deleted = await this.orderLineModel.findByIdAndDelete(id);

      if (!deleted) {
        throw new HttpException('Order line not found', HttpStatus.NOT_FOUND);
      }

      return { message: 'Order line deleted successfully' };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.error('Error deleting order line:', error);
      throw new HttpException(
        'Error deleting order line',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getOrderLinesByOrderId(orderId: string) {
    try {
      if (!Types.ObjectId.isValid(orderId)) {
        throw new HttpException('Invalid order ID', HttpStatus.BAD_REQUEST);
      }

      return await this.findAll(
        { orderId: new Types.ObjectId(orderId), isActive: true },
        {
          populate: ['productItemId'],
          sort: { createdAt: -1 },
          lean: true,
        },
      );
    } catch (error) {
      console.error('Error getting order lines:', error);
      throw new HttpException(
        'Error fetching order lines',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async calculateOrderTotal(orderId: string): Promise<number> {
    try {
      if (!Types.ObjectId.isValid(orderId)) {
        throw new HttpException('Invalid order ID', HttpStatus.BAD_REQUEST);
      }

      const orderLines = await this.orderLineModel.find({
        orderId: new Types.ObjectId(orderId),
        isActive: true,
      });

      return orderLines.reduce((total, line) => {
        return total + line.price * line.qty;
      }, 0);
    } catch (error) {
      console.error('Error calculating order total:', error);
      throw new HttpException(
        'Error calculating total',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
