import { Injectable, NotFoundException } from '@nestjs/common';
import { ShippingMethod } from './schemas/shipping-method.scheme';
import {
  CreateShippingMethodDto,
  UpdateShippingMethodDto,
} from './dto/shipping-method.dto';
import { FilterQuery, Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CustomOptions } from 'src/config/types';

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

  async findAll(
    filter?: FilterQuery<ShippingMethod>,
    options?: CustomOptions<ShippingMethod>,
  ): Promise<{ shippingMethods: ShippingMethod[]; total: number }> {
    const total = await this.shippingMethodModel.countDocuments({
      ...filter,
    });
    const shippingMethods = await this.shippingMethodModel
      .find({ ...filter }, { ...options })
      .exec();
    return {
      shippingMethods,
      total,
    };
  }

  async remove(id: string) {
    const deletedShippingMethod =
      await this.shippingMethodModel.findByIdAndDelete(id);
    if (!deletedShippingMethod) {
      throw new NotFoundException('Shipping method not found');
    }
    return deletedShippingMethod;
  }
}
