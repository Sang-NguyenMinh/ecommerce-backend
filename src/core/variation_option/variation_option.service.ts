import { Injectable, NotFoundException } from '@nestjs/common';
import {
  CreateVariationOptionDto,
  UpdateVariationOptionDto,
} from './dto/variation-option.dto';
import { VariationOption } from './schemas/variation_option.schema';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { CustomOptions } from 'src/config/types';

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
  async findAll(
    filter?: FilterQuery<VariationOption>,
    options?: CustomOptions<VariationOption>,
  ): Promise<{ variationOptions: VariationOption[]; total: number }> {
    const total = await this.variationOptionModel.countDocuments({
      ...filter,
    });

    const variationOptions = await this.variationOptionModel
      .find({ ...filter }, { ...options })
      .exec();

    return {
      variationOptions,
      total,
    };
  }

  async remove(id: string) {
    const deletedVariationOption =
      await this.variationOptionModel.findByIdAndDelete(id);
    if (!deletedVariationOption) {
      throw new NotFoundException('Variation Option not found');
    }
    return deletedVariationOption;
  }
}
