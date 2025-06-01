import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PromotionProduct } from './schemas/promotion-product.schema';
import { FilterQuery, Model } from 'mongoose';
import {
  CreatePromotionProductDto,
  UpdatePromotionProductDto,
} from './dto/promotion-product.dto';
import { CustomOptions } from 'src/config/types';

@Injectable()
export class PromotionProductService {
  constructor(
    @InjectModel(PromotionProduct.name)
    private readonly promotionProductModel: Model<PromotionProduct>,
  ) {}

  async create(
    createDto: CreatePromotionProductDto,
  ): Promise<PromotionProduct> {
    return this.promotionProductModel.create(createDto);
  }

  async findOne(id: string): Promise<PromotionProduct> {
    const promotionProduct = await this.promotionProductModel
      .findById(id)
      .populate('productItemId')
      .populate('promotionId')
      .exec();
    if (!promotionProduct)
      throw new NotFoundException('Promotion Product not found');
    return promotionProduct;
  }

  async update(
    updateDto: UpdatePromotionProductDto,
  ): Promise<PromotionProduct> {
    const promotionProduct = await this.promotionProductModel.findByIdAndUpdate(
      updateDto.id,
      updateDto,
      {
        new: true,
      },
    );
    if (!promotionProduct)
      throw new NotFoundException('Promotion Product not found');
    return promotionProduct;
  }

  async findAll(
    filter?: FilterQuery<PromotionProduct>,
    options?: CustomOptions<PromotionProduct>,
  ): Promise<{ promotionProducts: PromotionProduct[]; total: number }> {
    const total = await this.promotionProductModel.countDocuments({
      ...filter,
    });
    const promotionProducts = await this.promotionProductModel
      .find({ ...filter }, { ...options })
      .populate('productItemId')
      .populate('promotionId')
      .exec();
    return {
      promotionProducts,
      total,
    };
  }

  async remove(id: string) {
    const promotionProduct =
      await this.promotionProductModel.findByIdAndDelete(id);
    if (!promotionProduct)
      throw new NotFoundException('Promotion Product not found');
    return promotionProduct;
  }
}
