import { Injectable, NotFoundException } from '@nestjs/common';
import { ShopOrder } from './schemas/shop-order.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateShopOrderDto, UpdateShopOrderDto } from './dto/shop-order.dto';

@Injectable()
export class ShopOrderService {
  constructor(
    @InjectModel(ShopOrder.name)
    private shopOrderModel: Model<ShopOrder>,
  ) {}

  async create(createShopOrderDto: CreateShopOrderDto): Promise<ShopOrder> {
    const newOrder = new this.shopOrderModel(createShopOrderDto);
    return newOrder.save();
  }

  async update(updateShopOrderDto: UpdateShopOrderDto): Promise<ShopOrder> {
    const { id, ...updateData } = updateShopOrderDto;
    const updatedOrder = await this.shopOrderModel.findByIdAndUpdate(
      id,
      updateData,
      { new: true },
    );

    if (!updatedOrder) {
      throw new NotFoundException('Order not found');
    }
    return updatedOrder;
  }

  async findOne(id: string): Promise<ShopOrder> {
    const order = await this.shopOrderModel
      .findById(id)
      .populate(['shippingMethodId', 'userId', 'shippingAddress']);
    if (!order) {
      throw new NotFoundException('Order not found');
    }
    return order;
  }

  async findByUser(userId: string): Promise<ShopOrder[]> {
    return this.shopOrderModel.find({ userId }).sort({ createdAt: -1 });
  }
  findAll() {
    return `This action returns all shopOrder`;
  }

  remove(id: number) {
    return `This action removes a #${id} shopOrder`;
  }
}
