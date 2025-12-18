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
}
