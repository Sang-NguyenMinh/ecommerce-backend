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
}
