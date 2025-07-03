import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { OrderLine, OrderLineDocument } from './schemas/order-line.schema';
import { Model } from 'mongoose';
import { CreateOrderLineDto, UpdateOrderLineDto } from './dto/order-line.dto';
import { BaseService } from '../base/base.service';

@Injectable()
export class OrderLineService extends BaseService<OrderLineDocument> {
  constructor(
    @InjectModel(OrderLine.name)
    private orderLineModel: Model<OrderLineDocument>,
  ) {
    super(orderLineModel);
  }

  async create(createOrderLineDto: CreateOrderLineDto): Promise<OrderLine> {
    const newOrderLine = new this.orderLineModel(createOrderLineDto);
    return newOrderLine.save();
  }

  async update(updateOrderLineDto: UpdateOrderLineDto): Promise<OrderLine> {
    const { id, ...updateData } = updateOrderLineDto;
    const updatedOrderLine = await this.orderLineModel.findByIdAndUpdate(
      id,
      updateData,
      { new: true },
    );
    if (!updatedOrderLine) {
      throw new NotFoundException('Order Line not found');
    }
    return updatedOrderLine;
  }

  remove(id: number) {
    return `This action removes a #${id} orderLine`;
  }
}
