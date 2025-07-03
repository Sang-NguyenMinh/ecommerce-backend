import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  PromotionCategory,
  PromotionCategoryDocument,
} from './schemas/promotion-category.schema';
import { Model } from 'mongoose';
import {
  CreatePromotionCategoryDto,
  UpdatePromotionCategoryDto,
} from './dto/promotion-category.dto';
import { BaseService } from '../base/base.service';

@Injectable()
export class PromotionCategoryService extends BaseService<PromotionCategoryDocument> {
  constructor(
    @InjectModel(PromotionCategory.name)
    private promotionCategoryModel: Model<PromotionCategoryDocument>,
  ) {
    super(promotionCategoryModel);
  }

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

  async delete(id: string): Promise<{ message: string }> {
    const deleted = await this.promotionCategoryModel
      .findByIdAndDelete(id)
      .exec();
    if (!deleted) {
      throw new NotFoundException('Promotion category not found');
    }
    return { message: 'Promotion category deleted successfully' };
  }
}
