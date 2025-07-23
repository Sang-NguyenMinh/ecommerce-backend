import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Variation, VariationDocument } from './schemas/variation.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CreateVariationDto, UpdateVariationDto } from './dto/variation.dto';
import { BaseQueryResult, BaseService } from '../base/base.service';
import { VariationOptionService } from '../variation_option/variation_option.service';
@Injectable()
export class VariationService extends BaseService<VariationDocument> {
  constructor(
    @InjectModel(Variation.name)
    private variationModel: Model<VariationDocument>,

    @Inject(forwardRef(() => VariationOptionService))
    private variationOptionService: VariationOptionService,
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

  async findAll(filter?: any, options?: any): Promise<BaseQueryResult<any>> {
    try {
      const variationResult = await super.findAll(filter, {
        ...options,
        lean: true,
      });

      const variationIds = variationResult.data.map((variation) =>
        variation._id.toString(),
      );

      const variationOptions =
        await this.variationOptionService.findByVariationIds(variationIds);

      const optionsMap = new Map();
      variationOptions.forEach((option) => {
        const variationId = option.variationId.toString();
        if (!optionsMap.has(variationId)) {
          optionsMap.set(variationId, []);
        }
        optionsMap.get(variationId).push(option);
      });

      const enrichedData = variationResult.data.map((variation) => {
        const variationIdStr = variation._id.toString();
        const options = optionsMap.get(variationIdStr) || [];

        return {
          ...variation,
          options: options,
          totalOptions: options.length,
        };
      });

      return {
        ...variationResult,
        data: enrichedData,
      };
    } catch (error) {
      throw error;
    }
  }

  async findWithOptions(variationId: string): Promise<any | null> {
    const variation = await this.findById(variationId);
    if (!variation) return null;

    const options =
      await this.variationOptionService.findByVariationId(variationId);

    return {
      variationId: variation._id.toString(),
      name: variation.name,
      description: variation.description,
      isActive: variation.isActive,
      isRequired: false,
      options: options.map((option: any) => ({
        optionId: option._id.toString(),
        value: option.value,
        variationId: option.variationId.toString(),
      })),
    };
  }

  async findByIds(variationIds: string[]): Promise<Variation[]> {
    return this.variationModel
      .find({
        _id: { $in: variationIds },
      })
      .exec();
  }

  async findMultipleWithOptions(variationIds: string[]): Promise<any[]> {
    const variations = await this.findByIds(variationIds);
    if (!variations.length) return [];

    const options =
      await this.variationOptionService.findByVariationIds(variationIds);

    return variations.map((variation: any) => ({
      variationId: variation._id.toString(),
      name: variation.name,
      description: variation.description,
      isActive: variation.isActive,
      isRequired: false,
      options: options
        .filter(
          (option) =>
            option.variationId.toString() === variation._id.toString(),
        )
        .map((option: any) => ({
          optionId: option._id.toString(),
          value: option.value,
          variationId: option.variationId.toString(),
        })),
    }));
  }
}
