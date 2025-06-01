import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PromotionCategory } from './schemas/promotion-category.schema';
import { FilterQuery, Model } from 'mongoose';
import {
  CreatePromotionCategoryDto,
  UpdatePromotionCategoryDto,
} from './dto/promotion-category.dto';
import { CustomOptions } from 'src/config/types';

@Injectable()
export class PromotionCategoryService {
  constructor(
    @InjectModel(PromotionCategory.name)
    private promotionCategoryModel: Model<PromotionCategory>,
  ) {}

  async create(dto: CreatePromotionCategoryDto): Promise<PromotionCategory> {
    return this.promotionCategoryModel.create(dto);
  }

  async update(dto: UpdatePromotionCategoryDto): Promise<PromotionCategory> {
    const updatedPromotionCategory = await this.promotionCategoryModel
      .findByIdAndUpdate(dto.id, dto, { new: true })
      .exec();

    if (!updatedPromotionCategory) {
      throw new NotFoundException('Promotion category not found');
    }

    return updatedPromotionCategory;
  }

  async findOne(id: string): Promise<PromotionCategory> {
    const promotionCategory = await this.promotionCategoryModel
      .findById(id)
      .exec();
    if (!promotionCategory) {
      throw new NotFoundException('Promotion category not found');
    }
    return promotionCategory;
  }

  async delete(id: string): Promise<{ message: string }> {
    const deleted = await this.promotionCategoryModel
      .findByIdAndDelete(id)
      .exec();
    if (!deleted) {
      throw new NotFoundException('Promotion category not found');
    }
    return { message: 'Promotion category deleted successfully' };
  }

  async findAll(
    filter?: FilterQuery<PromotionCategory>,
    options?: CustomOptions<PromotionCategory>,
  ): Promise<{ promotionCategories: PromotionCategory[]; total: number }> {
    const total = await this.promotionCategoryModel.countDocuments({
      ...filter,
    });
    const promotionCategories = await this.promotionCategoryModel
      .find({ ...filter }, { ...options })
      .exec();
    return {
      promotionCategories,
      total,
    };
  }
}
