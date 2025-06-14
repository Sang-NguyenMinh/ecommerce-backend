import { Injectable, NotFoundException } from '@nestjs/common';
import { Variation, VariationDocument } from './schemas/variation.schema';
import { FilterQuery, Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CreateVariationDto, UpdateVariationDto } from './dto/variation.dto';
import { CustomOptions } from 'src/config/types';
import { BaseQueryResult, BaseService } from '../base/base.service';
import { CategoryVariation } from '../category-variation/schemas/categoryVariation.schema';
import { VariationOption } from '../variation_option/schemas/variation_option.schema';

@Injectable()
export class VariationService extends BaseService<VariationDocument> {
  constructor(
    @InjectModel(Variation.name)
    private variationModel: Model<VariationDocument>,
    @InjectModel(CategoryVariation.name)
    private categoryVariationModel: Model<CategoryVariation>,
    @InjectModel(VariationOption.name)
    private variationOptionModel: Model<VariationOption>,
  ) {
    super(variationModel);
  }

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

  async remove(id: string): Promise<void> {
    await this.variationModel.findByIdAndDelete(id);
  }

  // async findAllBasic(
  //   filter?: any,
  //   options?: any,
  // ): Promise<BaseQueryResult<any>> {
  //   const basicResult = await super.findAll(filter, options);

  //   const enhancedData = await Promise.all(
  //     basicResult.data.map(async (variation: any) => {
  //       const [categoryCount, optionCount] = await Promise.all([
  //         this.categoryVariationModel.countDocuments({
  //           variationId: variation._id,
  //         }),
  //         this.variationOptionModel.countDocuments({
  //           variationId: variation._id,
  //         }),
  //       ]);

  //       return {
  //         ...variation,
  //         categoryCount,
  //         optionCount,
  //       };
  //     }),
  //   );

  //   return {
  //     ...basicResult,
  //     data: enhancedData,
  //   };
  // }
  async findAll(filter?: any, options?: any) {
    const defaultOptions = {
      ...options,
      populates: [...(options?.populates || [])],
    };

    return super.findAll(filter, defaultOptions);
  }

  async findOne(
    filter: FilterQuery<VariationDocument>,
    options?: Omit<
      CustomOptions<VariationDocument>,
      'page' | 'pageSize' | 'limit'
    >,
  ): Promise<VariationDocument | null> {
    // Add default population for parentCategory
    const defaultOptions = {
      ...options,
      populates: [...(options?.populates || [])],
    };

    return super.findOne(filter, defaultOptions);
  }
}
