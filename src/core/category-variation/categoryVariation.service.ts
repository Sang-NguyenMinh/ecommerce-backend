import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import {
  CategoryVariation,
  CategoryVariationDocument,
} from './schemas/categoryVariation.schema';
import {
  CreateCategoryVariationDto,
  UpdateCategoryVariationDto,
} from './dto/categoryVariation.dto';
import { BaseService } from '../base/base.service';
import { VariationService } from '../variation/variation.service';

@Injectable()
export class CategoryVariationService extends BaseService<CategoryVariationDocument> {
  constructor(
    @InjectModel(CategoryVariation.name)
    private categoryVariationModel: Model<CategoryVariationDocument>,

    @Inject(forwardRef(() => VariationService))
    private variationService: VariationService,
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

  async createMany(
    createCategoryVariationDtos: CreateCategoryVariationDto[],
  ): Promise<CategoryVariation[]> {
    return this.categoryVariationModel.insertMany(createCategoryVariationDtos);
  }

  async deleteByCategoryId(categoryId: string): Promise<any> {
    return this.categoryVariationModel.deleteMany({ categoryId }).exec();
  }

  async getByCategoryId(categoryId: string): Promise<CategoryVariation[]> {
    return this.categoryVariationModel
      .find({ categoryId: new Types.ObjectId(categoryId) })
      .populate('variationId')
      .exec();
  }

  async findByCategoryId(categoryId: string): Promise<CategoryVariation[]> {
    return this.categoryVariationModel.find({ categoryId }).exec();
  }

  async findVariationsByCategoryId(categoryId: string): Promise<any[]> {
    const categoryVariations = await this.findByCategoryId(categoryId);
    if (!categoryVariations.length) return [];

    const variationIds = categoryVariations.map((cv) =>
      cv.variationId.toString(),
    );
    const variations =
      await this.variationService.findMultipleWithOptions(variationIds);

    return variations.map((variation) => {
      const categoryVariation: any = categoryVariations.find(
        (cv) => cv.variationId.toString() === variation.variationId,
      );
      return {
        ...variation,
        isRequired: categoryVariation?.isRequired || false,
      };
    });
  }
}
