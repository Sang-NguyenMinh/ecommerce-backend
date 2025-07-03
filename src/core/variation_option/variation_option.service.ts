import { Injectable, NotFoundException } from '@nestjs/common';
import {
  CreateVariationOptionDto,
  UpdateVariationOptionDto,
} from './dto/variation-option.dto';
import {
  VariationOption,
  VariationOptionDocument,
} from './schemas/variation_option.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { BaseService } from '../base/base.service';
import { CategoryVariationService } from '../category-variation/categoryVariation.service';

@Injectable()
export class VariationOptionService extends BaseService<VariationOptionDocument> {
  constructor(
    @InjectModel(VariationOption.name)
    private variationOptionModel: Model<VariationOptionDocument>,

    private categoryVariationService: CategoryVariationService,
  ) {
    super(variationOptionModel);
  }

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

  async remove(id: string) {
    const deletedVariationOption =
      await this.variationOptionModel.findByIdAndDelete(id);
    if (!deletedVariationOption) {
      throw new NotFoundException('Variation Option not found');
    }
    return deletedVariationOption;
  }

  async getVariationOptionsByCategoryId(categoryId: string): Promise<any> {
    const variations = (
      await this.categoryVariationService.getByCategoryId(categoryId)
    ).map((variation) => variation.variationId);

    const variationIds = variations.map((variation) =>
      variation._id.toString(),
    );

    const variationOptions = await this.variationOptionModel.find({
      variationId: { $in: variationIds },
    });

    const variationsMap = new Map();

    variations.forEach((variation: any) => {
      const variationKey = variation._id.toString();
      variationsMap.set(variationKey, {
        variation: variation,
        options: [],
      });
    });

    variationOptions.forEach((option) => {
      const variationId = option.variationId.toString();
      const variation = variationsMap.get(variationId);

      if (variation) {
        variation.options.push({
          _id: option._id,
          name: option.name,
          value: option.value,
        });
      }
    });

    return Array.from(variationsMap.values());
  }
}
