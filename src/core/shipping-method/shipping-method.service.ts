import { Injectable, NotFoundException } from '@nestjs/common';
import { ShippingMethod } from './schemas/shipping-method.scheme';
import {
  CreateShippingMethodDto,
  UpdateShippingMethodDto,
} from './dto/shipping-method.dto';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class ShippingMethodService {
  constructor(
    @InjectModel(ShippingMethod.name)
    private shippingMethodModel: Model<ShippingMethod>,
  ) {}

  async create(
    createShippingMethodDto: CreateShippingMethodDto,
  ): Promise<ShippingMethod> {
    const newShippingMethod = new this.shippingMethodModel(
      createShippingMethodDto,
    );
    return newShippingMethod.save();
  }

  async update(
    updateShippingMethodDto: UpdateShippingMethodDto,
  ): Promise<ShippingMethod> {
    const { id, ...updateData } = updateShippingMethodDto;
    const updatedShippingMethod =
      await this.shippingMethodModel.findByIdAndUpdate(id, updateData, {
        new: true,
      });
    if (!updatedShippingMethod) {
      throw new NotFoundException('Shipping method not found');
    }
    return updatedShippingMethod;
  }

  async findOne(id: string): Promise<ShippingMethod> {
    const shippingMethod = await this.shippingMethodModel.findById(id);
    if (!shippingMethod) {
      throw new NotFoundException('Shipping method not found');
    }
    return shippingMethod;
  }

  findAll() {
    return `This action returns all shippingMethod`;
  }

  remove(id: number) {
    return `This action removes a #${id} shippingMethod`;
  }
}
