import { Injectable, NotFoundException } from '@nestjs/common';
import { Promotion } from './schemas/promotion.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreatePromotionDto, UpdatePromotionDto } from './dto/promotion.dto';

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

  findAll() {
    return `This action returns all promotion`;
  }

  remove(id: number) {
    return `This action removes a #${id} promotion`;
  }
}
