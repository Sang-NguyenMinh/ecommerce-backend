import { Injectable, NotFoundException } from '@nestjs/common';
import { Promotion } from './schemas/promotion.schema';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { CreatePromotionDto, UpdatePromotionDto } from './dto/promotion.dto';
import { CustomOptions } from 'src/config/types';

@Injectable()
export class PromotionService {
  constructor(
    @InjectModel(Promotion.name) private promotionModel: Model<Promotion>,
  ) {}

  async create(createPromotionDto: CreatePromotionDto): Promise<Promotion> {
    const newPromotion = new this.promotionModel(createPromotionDto);
    return newPromotion.save();
  }

  async findOne(id: string): Promise<Promotion> {
    const promotion = await this.promotionModel.findById(id);
    if (!promotion) {
      throw new NotFoundException('Promotion not found');
    }
    return promotion;
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
  async findAll(
    filter?: FilterQuery<Promotion>,
    options?: CustomOptions<Promotion>,
  ): Promise<{ promotions: Promotion[]; total: number }> {
    const total = await this.promotionModel.countDocuments({ ...filter });

    const promotions = await this.promotionModel
      .find({ ...filter }, { ...options })
      .exec();

    return {
      promotions,
      total,
    };
  }

  async remove(id: string) {
    const promotion = await this.promotionModel.findByIdAndDelete(id);
    if (!promotion) {
      throw new NotFoundException('Promotion not found');
    }
    return promotion;
  }
}
