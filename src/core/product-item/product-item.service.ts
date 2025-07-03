import { ProductConfigurationService } from './../product_configuration/product_configuration.service';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  ProductItem,
  ProductItemDocument,
} from './schemas/product-item.schema';
import { FilterQuery, Model, Types } from 'mongoose';
import {
  CreateProductItemDto,
  UpdateProductItemDto,
} from './dto/product-item.dto';
import { BaseService } from '../base/base.service';
import { CustomOptions } from 'src/config/types';

@Injectable()
export class ProductItemService extends BaseService<ProductItemDocument> {
  constructor(
    @InjectModel(ProductItem.name)
    private readonly productItemModel: Model<ProductItemDocument>,
    private readonly productConfigurationService: ProductConfigurationService,
  ) {
    super(productItemModel);
  }

  async create(dto: CreateProductItemDto): Promise<any> {
    const existingProductItem = await this.productItemModel
      .findOne({ categoryName: dto.SKU })
      .exec();
    if (existingProductItem) {
      throw new BadRequestException('Product item already exists');
    }

    const newProductItem = new this.productItemModel(dto);
    const savedProductItem = await newProductItem.save();

    const configurations = dto?.configurations?.map((optionId) => ({
      productItemId: savedProductItem._id,
      variationOptionId: new Types.ObjectId(optionId),
    }));

    await this.productConfigurationService.createMany(configurations as any);

    return savedProductItem;
  }

  async update(
    updateProductItemDto: UpdateProductItemDto,
  ): Promise<ProductItem> {
    const { id, ...updateData } = updateProductItemDto;
    const updatedProductItem = await this.productItemModel.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true },
    );

    if (!updatedProductItem) {
      throw new NotFoundException('Product item not found');
    }

    return updatedProductItem;
  }

  async remove(id: string): Promise<void> {
    const productItem = await this.productItemModel.findByIdAndDelete(id);

    if (!productItem) {
      throw new NotFoundException('Product item not found');
    }
  }

  async findAllWithVariations(
    filter?: FilterQuery<ProductItemDocument>,
    options?: CustomOptions<ProductItemDocument>,
  ) {
    const result = await this.findAll(filter, {
      ...options,
      populate: ['productId'],
    });

    if (result.data.length > 0) {
      const productItemIds = result.data.map((item) => item._id);
      const configurations = await this.productConfigurationService.findAll(
        { productItemId: { $in: productItemIds } },
        {
          populate: ['variationOptionId'],
          populates: [
            {
              path: 'variationOptionId',
              populate: {
                path: 'variationId',
                model: 'Variation',
              },
            },
          ],
        },
      );

      // Group configurations by productItemId
      const configsByProductItem = configurations.data.reduce((acc, config) => {
        const productItemId = config.productItemId.toString();
        if (!acc[productItemId]) {
          acc[productItemId] = [];
        }
        acc[productItemId].push(config);
        return acc;
      }, {});

      // Attach configurations to each product item
      result.data = result.data.map((item) => ({
        ...item,
        configurations: configsByProductItem[item._id.toString()] || [],
      }));
    }

    return result;
  }

  async findByIdWithVariations(
    id: string | Types.ObjectId,
    options?: Omit<
      CustomOptions<ProductItemDocument>,
      'page' | 'pageSize' | 'limit'
    >,
  ) {
    const productItem = await this.findById(id, {
      ...options,
      populate: ['productId'], // populate product info
    });

    if (!productItem) {
      return null;
    }

    // Lấy configurations cho product item này
    const configurations = await this.productConfigurationService.findAll(
      { productItemId: productItem._id },
      {
        populate: ['variationOptionId'],
        populates: [
          {
            path: 'variationOptionId',
            populate: {
              path: 'variationId',
              model: 'Variation',
            },
          },
        ],
      },
    );

    return {
      ...productItem,
      configurations: configurations.data,
    };
  }

  async getProductItemVariations(productItemId: string | Types.ObjectId) {
    const configurations = await this.productConfigurationService.findAll(
      { productItemId },
      {
        populate: ['variationOptionId'],
        populates: [
          {
            path: 'variationOptionId',
            populate: {
              path: 'variationId',
              model: 'Variation',
            },
          },
        ],
      },
    );

    // Transform data để dễ sử dụng hơn
    return configurations.data.map((config) => ({
      configurationId: config._id,
      variation: {
        id: config.variationOptionId.variationId._id,
        name: config.variationOptionId.variationId.name,
        description: config.variationOptionId.variationId.description,
      },
      option: {
        id: config.variationOptionId._id,
        value: config.variationOptionId.value,
      },
    }));
  }

  async findByVariationOptions(variationOptionIds: string[]) {
    const objectIds = variationOptionIds.map((id) => new Types.ObjectId(id));

    const configurations = await this.productConfigurationService.findAll(
      { variationOptionId: { $in: objectIds } },
      { populate: ['productItemId'] },
    );

    const productItemIds = configurations.data.map(
      (config) => config.productItemId,
    );

    return this.findAllWithVariations({ _id: { $in: productItemIds } });
  }
}
