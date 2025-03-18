import { Injectable, NotFoundException } from '@nestjs/common';
import { ProductConfiguration } from './schemas/product_configuration.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import {
  CreateProductConfigurationDto,
  UpdateProductConfigurationDto,
} from './dto/product-configuration.dto';

@Injectable()
export class ProductConfigurationService {
  constructor(
    @InjectModel(ProductConfiguration.name)
    private productConfigModel: Model<ProductConfiguration>,
  ) {}

  async create(
    createProductConfigurationDto: CreateProductConfigurationDto,
  ): Promise<ProductConfiguration> {
    const newConfig = new this.productConfigModel(
      createProductConfigurationDto,
    );
    return newConfig.save();
  }

  async update(
    updateProductConfigurationDto: UpdateProductConfigurationDto,
  ): Promise<ProductConfiguration> {
    const { id, ...updateData } = updateProductConfigurationDto;
    const updatedConfig = await this.productConfigModel.findByIdAndUpdate(
      id,
      updateData,
      { new: true },
    );
    if (!updatedConfig) {
      throw new NotFoundException('Product Configuration not found');
    }
    return updatedConfig;
  }

  async findOne(id: string): Promise<ProductConfiguration> {
    const config = await this.productConfigModel
      .findById(id)
      .populate('productItemId variationOptionId');
    if (!config) {
      throw new NotFoundException('Product Configuration not found');
    }
    return config;
  }

  findAll() {
    return `This action returns all productConfiguration`;
  }

  remove(id: number) {
    return `This action removes a #${id} productConfiguration`;
  }
}
