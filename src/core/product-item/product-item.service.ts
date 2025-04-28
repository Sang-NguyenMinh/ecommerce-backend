import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ProductItem } from './schemas/product-item.schema';
import { FilterQuery, Model } from 'mongoose';
import {
  CreateProductItemDto,
  UpdateProductItemDto,
} from './dto/product-item.dto';
import { CustomOptions } from 'src/config/types';

@Injectable()
export class ProductItemService {
  constructor(
    @InjectModel(ProductItem.name)
    private readonly productItemModel: Model<ProductItem>,
  ) {}

  async create(
    createProductItemDto: CreateProductItemDto,
  ): Promise<ProductItem> {
    const newProductItem = new this.productItemModel(createProductItemDto);
    return newProductItem.save();
  }

  async update(
    updateProductItemDto: UpdateProductItemDto,
  ): Promise<ProductItem> {
    const { id, ...updateData } = updateProductItemDto;
    const updatedProductItem = await this.productItemModel.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true },
    );

    if (!updatedProductItem) {
      throw new NotFoundException('Product item not found');
    }

    return updatedProductItem;
  }

  async findOne(id: string): Promise<ProductItem> {
    const productItem = await this.productItemModel
      .findById(id)
      .populate('productId');

    if (!productItem) {
      throw new NotFoundException('Product item not found');
    }

    return productItem;
  }

  async findAll(
    filter?: FilterQuery<ProductItem>,
    options?: CustomOptions<ProductItem>,
  ) {
    const total = await this.productItemModel.countDocuments({ ...filter });

    const productItems = await this.productItemModel
      .find({ ...filter }, { ...options })
      .exec();

    return {
      productItems,
      total,
    };
  }

  remove(id: number) {
    return `This action removes a #${id} productItem`;
  }
}
