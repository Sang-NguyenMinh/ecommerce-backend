import { Injectable, NotFoundException } from '@nestjs/common';
import {
  CreateVariationOptionDto,
  UpdateVariationOptionDto,
} from './dto/variation-option.dto';
import { VariationOption } from './schemas/variation_option.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class VariationOptionService {
  constructor(
    @InjectModel(VariationOption.name)
    private variationOptionModel: Model<VariationOption>,
  ) {}

  async create(
    createVariationOptionDto: CreateVariationOptionDto,
  ): Promise<VariationOption> {
    const newVariationOption = new this.variationOptionModel(
      createVariationOptionDto,
    );
    return newVariationOption.save();
  }

  async update(
    updateVariationOptionDto: UpdateVariationOptionDto,
  ): Promise<VariationOption> {
    const { id, ...updateData } = updateVariationOptionDto;
    const updatedVariationOption =
      await this.variationOptionModel.findByIdAndUpdate(id, updateData, {
        new: true,
      });
    if (!updatedVariationOption) {
      throw new NotFoundException('Variation Option not found');
    }
    return updatedVariationOption;
  }

  async findOne(id: string): Promise<VariationOption> {
    const variationOption = await this.variationOptionModel.findById(id);
    if (!variationOption) {
      throw new NotFoundException('Variation Option not found');
    }
    return variationOption;
  }
  findAll() {
    return `This action returns all variationOption`;
  }

  remove(id: number) {
    return `This action removes a #${id} variationOption`;
  }
}
