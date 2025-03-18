import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { OrderLine } from './schemas/order-line.schema';
import { Model } from 'mongoose';
import { CreateOrderLineDto, UpdateOrderLineDto } from './dto/order-line.dto';

@Injectable()
export class OrderLineService {
  constructor(
    @InjectModel(OrderLine.name) private orderLineModel: Model<OrderLine>,
  ) {}

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

  async findOne(id: string): Promise<OrderLine> {
    const orderLine = await this.orderLineModel
      .findById(id)
      .populate(['productItemId', 'orderId']);
    if (!orderLine) {
      throw new NotFoundException('Order Line not found');
    }
    return orderLine;
  }

  findAll() {
    return `This action returns all orderLine`;
  }

  remove(id: number) {
    return `This action removes a #${id} orderLine`;
  }
}
