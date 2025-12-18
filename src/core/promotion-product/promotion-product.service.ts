import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  PromotionProduct,
  PromotionProductDocument,
} from './schemas/promotion-product.schema';
import { Model } from 'mongoose';
import {
  CreatePromotionProductDto,
  UpdatePromotionProductDto,
} from './dto/promotion-product.dto';
import { BaseService } from '../base/base.service';

@Injectable()
export class PromotionProductService extends BaseService<PromotionProductDocument> {
  constructor(
    @InjectModel(PromotionProduct.name)
    private readonly promotionProductModel: Model<PromotionProductDocument>,
  ) {
    super(promotionProductModel);
  }

  async create(
    createDto: CreatePromotionProductDto,
  ): Promise<PromotionProduct> {
    return this.promotionProductModel.create(createDto);
  }
}
