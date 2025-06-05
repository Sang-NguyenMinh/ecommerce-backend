import { Injectable, NotFoundException } from '@nestjs/common';
import { FilterQuery, Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CustomOptions } from 'src/config/types';
import { CategoryVariation } from './schemas/variation.schema';
import {
  CreateCategoryVariationDto,
  UpdateCategoryVariationDto,
} from './dto/variation.dto';

@Injectable()
export class CategoryVariationService {
  constructor(
    @InjectModel(CategoryVariation.name)
    private categoryVariationModel: Model<CategoryVariation>,
  ) {}

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

  async findOne(id: string): Promise<CategoryVariation> {
    const categoryVariation = await this.categoryVariationModel.findById(id);
    if (!categoryVariation) {
      throw new NotFoundException('CategoryVariation not found');
    }
    return categoryVariation;
  }

  async findAll(
    filter?: FilterQuery<CategoryVariation>,
    options?: CustomOptions<CategoryVariation>,
  ): Promise<{ categoryVariations: CategoryVariation[]; total: number }> {
    const total = await this.categoryVariationModel.countDocuments({
      ...filter,
    });

    const categoryVariations = await this.categoryVariationModel
      .find({ ...filter }, { ...options })
      .exec();

    return {
      categoryVariations,
      total,
    };
  }

  async remove(id: string): Promise<void> {
    await this.categoryVariationModel.findByIdAndDelete(id);
  }
}
