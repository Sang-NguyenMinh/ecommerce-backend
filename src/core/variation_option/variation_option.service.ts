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
import { FilterQuery, Model, Types } from 'mongoose';
import { CustomOptions } from 'src/config/types';
import { BaseQueryResult, BaseService } from '../base/base.service';

@Injectable()
export class VariationOptionService extends BaseService<VariationOptionDocument> {
  constructor(
    @InjectModel(VariationOption.name)
    private variationOptionModel: Model<VariationOptionDocument>,
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

  async getAll(params?: {
    variationId?: string | Types.ObjectId;
    filter?: FilterQuery<VariationOptionDocument>;
    options?: CustomOptions<VariationOptionDocument>;
  }): Promise<BaseQueryResult<VariationOptionDocument>> {
    const { variationId, filter = {}, options } = params || {};

    let finalFilter: FilterQuery<VariationOptionDocument> = { ...filter };

    if (variationId) {
      if (!Types.ObjectId.isValid(variationId)) {
        throw new NotFoundException('Invalid variation ID format');
      }
      finalFilter.variationId = variationId.toString();
    }

    const defaultOptions: CustomOptions<VariationOptionDocument> = {
      populate: ['variationId'],
      sort: variationId ? { name: 1 } : { createdAt: -1 },
      ...options,
    };

    return this.findAll(finalFilter, defaultOptions);
  }

  async getByVariationId(
    variationId: string,
    options?: CustomOptions<VariationOptionDocument>,
  ): Promise<BaseQueryResult<VariationOptionDocument>> {
    if (!Types.ObjectId.isValid(variationId)) {
      throw new NotFoundException('Invalid variation ID format');
    }

    const filter: FilterQuery<VariationOptionDocument> = {
      variationId: new Types.ObjectId(variationId),
    };

    const defaultOptions: CustomOptions<VariationOptionDocument> = {
      populate: ['variationId'],
      sort: { name: 1 },
      ...options,
    };

    return this.findAll(filter, defaultOptions);
  }
}
