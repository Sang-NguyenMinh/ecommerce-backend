import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { BaseService } from '../base/base.service';
import {
  PromotionUsage,
  PromotionUsageDocument,
} from './schemas/promotion-usage.schema';
import {
  CreatePromotionUsageDto,
  UpdatePromotionUsageDto,
} from './dto/promotion-usage.dto';
import { Model } from 'mongoose';

@Injectable()
export class PromotionUsageService extends BaseService<PromotionUsageDocument> {
  constructor(
    @InjectModel(PromotionUsage.name)
    private readonly promotionUsageModel: Model<PromotionUsageDocument>,
  ) {
    super(promotionUsageModel);
  }

  async create(dto: CreatePromotionUsageDto): Promise<PromotionUsage> {
    return this.promotionUsageModel.create(dto);
  }

  async update(dto: UpdatePromotionUsageDto): Promise<PromotionUsage> {
    const updatedPromotionUsage = await this.promotionUsageModel
      .findByIdAndUpdate(dto.id, dto, { new: true })
      .exec();

    if (!updatedPromotionUsage) {
      throw new NotFoundException('Promotion usage not found');
    }

    return updatedPromotionUsage;
  }

  async delete(id: string): Promise<{ message: string }> {
    const deleted = await this.promotionUsageModel.findByIdAndDelete(id).exec();

    if (!deleted) {
      throw new NotFoundException('Promotion usage not found');
    }

    return { message: 'Promotion usage deleted successfully' };
  }
}
