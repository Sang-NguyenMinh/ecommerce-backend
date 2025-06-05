import { Injectable, NotFoundException } from '@nestjs/common';
import { Variation } from './schemas/variation.schema';
import { FilterQuery, Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CreateVariationDto, UpdateVariationDto } from './dto/variation.dto';
import { CustomOptions } from 'src/config/types';

@Injectable()
export class VariationService {
  constructor(
    @InjectModel(Variation.name) private variationModel: Model<Variation>,
  ) {}

  async create(createVariationDto: CreateVariationDto): Promise<Variation> {
    const newVariation = new this.variationModel(createVariationDto);
    return newVariation.save();
  }

  async update(
    id: string,
    updateVariationDto: UpdateVariationDto,
  ): Promise<Variation> {
    const { ...updateData } = updateVariationDto;
    const updatedVariation = await this.variationModel.findByIdAndUpdate(
      id,
      updateData,
      { new: true },
    );
    if (!updatedVariation) {
      throw new NotFoundException('Variation not found');
    }
    return updatedVariation;
  }

  async findOne(id: string): Promise<Variation> {
    const variation = await this.variationModel.findById(id);
    if (!variation) {
      throw new NotFoundException('Variation not found');
    }
    return variation;
  }

  async findAll(
    filter?: FilterQuery<Variation>,
    options?: CustomOptions<Variation>,
  ): Promise<{ variations: Variation[]; total: number }> {
    const total = await this.variationModel.countDocuments({ ...filter });

    const variations = await this.variationModel
      .find({ ...filter }, { ...options })
      .exec();

    return {
      variations,
      total,
    };
  }

  async remove(id: string): Promise<void> {
    await this.variationModel.findByIdAndDelete(id);
  }
}
