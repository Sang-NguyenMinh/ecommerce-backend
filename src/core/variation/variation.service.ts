import { Injectable, NotFoundException } from '@nestjs/common';
import { Variation } from './schemas/variation.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CreateVariationDto, UpdateVariationDto } from './dto/variation.dto';

@Injectable()
export class VariationService {
  constructor(
    @InjectModel(Variation.name) private variationModel: Model<Variation>,
  ) {}

  async create(createVariationDto: CreateVariationDto): Promise<Variation> {
    const newVariation = new this.variationModel(createVariationDto);
    return newVariation.save();
  }

  async update(updateVariationDto: UpdateVariationDto): Promise<Variation> {
    const { id, ...updateData } = updateVariationDto;
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

  findAll() {
    return `This action returns all variation`;
  }

  remove(id: number) {
    return `This action removes a #${id} variation`;
  }
}
