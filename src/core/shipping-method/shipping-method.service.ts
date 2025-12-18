import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

import { BaseService } from '../base/base.service';
import {
  CreateShippingMethodDto,
  UpdateShippingMethodDto,
} from './dto/shipping-method.dto';
import {
  ShippingMethod,
  ShippingMethodDocument,
} from './schemas/shipping-method.scheme';

@Injectable()
export class ShippingMethodService extends BaseService<ShippingMethodDocument> {
  constructor(
    @InjectModel(ShippingMethod.name)
    private shippingMethodModel: Model<ShippingMethodDocument>,
  ) {
    super(shippingMethodModel);
  }

  async create(
    createDto: CreateShippingMethodDto,
  ): Promise<ShippingMethodDocument> {
    try {
      const created = new this.shippingMethodModel(createDto);
      return await created.save();
    } catch (error) {
      console.error('Error creating shipping method:', error);
      throw new HttpException(
        'Error creating shipping method',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async update(
    id: string,
    updateDto: UpdateShippingMethodDto,
  ): Promise<ShippingMethodDocument> {
    try {
      if (!Types.ObjectId.isValid(id)) {
        throw new HttpException('Invalid ID format', HttpStatus.BAD_REQUEST);
      }

      const updated = await this.shippingMethodModel.findByIdAndUpdate(
        id,
        updateDto,
        { new: true, lean: false },
      );

      if (!updated) {
        throw new HttpException(
          'Shipping method not found',
          HttpStatus.NOT_FOUND,
        );
      }

      return updated;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.error('Error updating shipping method:', error);
      throw new HttpException(
        'Error updating shipping method',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
