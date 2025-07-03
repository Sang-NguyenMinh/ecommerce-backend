import { Injectable, NotFoundException } from '@nestjs/common';
import {
  ProductConfiguration,
  ProductConfigurationDocument,
} from './schemas/product_configuration.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import {
  CreateProductConfigurationDto,
  UpdateProductConfigurationDto,
} from './dto/product-configuration.dto';
import { BaseService } from '../base/base.service';

@Injectable()
export class ProductConfigurationService extends BaseService<ProductConfigurationDocument> {
  constructor(
    @InjectModel(ProductConfiguration.name)
    private productConfigModel: Model<ProductConfigurationDocument>,
  ) {
    super(productConfigModel);
  }

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

  async createMany(createDto: CreateProductConfigurationDto[]): Promise<any> {
    return this.productConfigModel.insertMany(createDto);
  }

  async remove(id: string): Promise<void> {
    const deletedConfig = await this.productConfigModel.findByIdAndDelete(id);
    if (!deletedConfig) {
      throw new NotFoundException('Product Configuration not found');
    }
  }
}
