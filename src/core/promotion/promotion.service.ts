import { Injectable, NotFoundException } from '@nestjs/common';
import { Promotion, PromotionDocument } from './schemas/promotion.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreatePromotionDto, UpdatePromotionDto } from './dto/promotion.dto';
import { BaseService } from '../base/base.service';

@Injectable()
export class PromotionService extends BaseService<PromotionDocument> {
  constructor(
    @InjectModel(Promotion.name)
    private promotionModel: Model<PromotionDocument>,
  ) {
    super(promotionModel);
  }

  async create(createPromotionDto: CreatePromotionDto): Promise<Promotion> {
    const newPromotion = new this.promotionModel(createPromotionDto);
    return newPromotion.save();
  }

  async update(updatePromotionDto: UpdatePromotionDto): Promise<Promotion> {
    const { id, ...updateData } = updatePromotionDto;
    const updatedPromotion = await this.promotionModel.findByIdAndUpdate(
      id,
      updateData,
      {
        new: true,
        runValidators: true,
      },
    );
    if (!updatedPromotion) {
      throw new NotFoundException('Promotion not found');
    }
    return updatedPromotion;
  }
  async remove(id: string) {
    const promotion = await this.promotionModel.findByIdAndDelete(id);
    if (!promotion) {
      throw new NotFoundException('Promotion not found');
    }
    return promotion;
  }
}
