import { Injectable, NotFoundException } from '@nestjs/common';
import { FilterQuery, Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CustomOptions } from 'src/config/types';
import {
  CategoryVariation,
  CategoryVariationDocument,
} from './schemas/categoryVariation.schema';
import {
  CreateCategoryVariationDto,
  UpdateCategoryVariationDto,
} from './dto/categoryVariation.dto';
import { extend } from 'dayjs';
import { BaseService } from '../base/base.service';

@Injectable()
export class CategoryVariationService extends BaseService<CategoryVariationDocument> {
  constructor(
    @InjectModel(CategoryVariation.name)
    private categoryVariationModel: Model<CategoryVariationDocument>,
  ) {
    super(categoryVariationModel);
  }

  async create(
    createCategoryVariationDto: CreateCategoryVariationDto,
  ): Promise<CategoryVariation> {
    const newCategoryVariation = new this.categoryVariationModel(
      createCategoryVariationDto,
    );
    return newCategoryVariation.save();
  }

  async update(
    id: string,
    updateCategoryVariationDto: UpdateCategoryVariationDto,
  ): Promise<CategoryVariation> {
    const { ...updateData } = updateCategoryVariationDto;
    const updatedCategoryVariation =
      await this.categoryVariationModel.findByIdAndUpdate(id, updateData, {
        new: true,
      });
    if (!updatedCategoryVariation) {
      throw new NotFoundException('CategoryVariation not found');
    }
    return updatedCategoryVariation;
  }

  async remove(id: string): Promise<void> {
    await this.categoryVariationModel.findByIdAndDelete(id);
  }
}
