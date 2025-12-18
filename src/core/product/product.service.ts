import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Product, ProductDocument } from './schemas/product.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Document, FilterQuery, Model, ObjectId, Types } from 'mongoose';
import { CreateProductDto, UpdateProductDto } from './dto/product.dto';
import {
  BaseQueryResult,
  BaseService,
  CustomOptions,
} from '../base/base.service';
import { CategoryVariationService } from '../category-variation/categoryVariation.service';
import { ProductItemService } from '../product-item/product-item.service';
import { ProductCategoryService } from '../product-category/product-category.service';

@Injectable()
export class ProductService extends BaseService<ProductDocument> {
  constructor(
    @InjectModel(Product.name)
    private productModel: Model<ProductDocument>,

    @Inject(forwardRef(() => CategoryVariationService))
    private categoryVariationService: CategoryVariationService,

    @Inject(forwardRef(() => ProductItemService))
    private productItemService: ProductItemService,

    @Inject(forwardRef(() => ProductCategoryService))
    private productCategoryService: ProductCategoryService,
  ) {
    super(productModel);
  }

  async create(createProductDto: CreateProductDto): Promise<Product> {
    const newProduct = new this.productModel(createProductDto);
    return newProduct.save();
  }

  async findAll(
    filter?: FilterQuery<ProductDocument>,
    options?: CustomOptions<ProductDocument>,
  ): Promise<BaseQueryResult<any>> {
    console.log('Finding all products with filter:', filter);
    const result = await super.findAll(filter, {
      ...options,
    });

    if (!result.data.length) {
      return result;
    }

    const productIds = result.data.map((product: any) => product._id);

    const productItemsResult =
      await this.productItemService.findAllWithVariations(
        {
          productId: { $in: productIds },
        },
        null,
      );

    const productItemsByProductId = productItemsResult.data.reduce(
      (acc, item: any) => {
        const productId = item.productId._id;
        if (!acc[productId]) {
          acc[productId] = [];
        }
        acc[productId].push(item);
        return acc;
      },
      {},
    );

    const enrichedData = result.data.map((product: any) => {
      const items = productItemsByProductId[product._id] || [];

      const variationsMap = new Map();

      items.forEach((item: any) => {
        if (item.configurations) {
          item.configurations.forEach((config: any) => {
            const variation = config.variationOptionId?.variationId;
            const option = config.variationOptionId;

            if (variation && option) {
              const varId = variation._id;

              if (!variationsMap.has(varId)) {
                variationsMap.set(varId, {
                  _id: variation._id,
                  name: variation.name,
                  description: variation.description,
                  options: [],
                });
              }

              // Add unique options
              const varData = variationsMap.get(varId);
              const optionExists = varData.options.some(
                (opt: any) => opt._id === option._id,
              );

              if (!optionExists) {
                varData.options.push({
                  _id: option._id,
                  name: option.name,
                  value: option.value,
                });
              }
            }
          });
        }
      });

      // Get total stock
      const totalStock = items.reduce((sum: number, item: any) => {
        return sum + (item.qtyInStock || 0);
      }, 0);

      // Get first available price
      const price = items.length > 0 ? items[0].price : 0;

      return {
        _id: product._id,
        productName: product.productName,
        thumbnails: product.thumbnails || [],
        content: product.content,
        categoryId: product.categoryId,

        variations: Array.from(variationsMap.values()),

        price,

        totalStock,
        inStock: totalStock > 0,

        itemsCount: items.length,

        items: items.map((item: any) => ({
          _id: item._id,
          SKU: item.SKU,
          price: item.price,
          images: item.images || [],
          qtyInStock: item.qtyInStock || 0,
          inStock: (item.qtyInStock || 0) > 0,
          configurations:
            item.configurations?.map((config: any) => ({
              variationName: config.variationOptionId?.variationId?.name,
              optionValue: config.variationOptionId?.value,
              optionId: config.variationOptionId?._id,
            })) || [],
        })),
      };
    });

    return {
      ...result,
      data: enrichedData,
    };
  }

  async getProductByCategoryId(
    categoryId: string,
    options?: CustomOptions<ProductDocument>,
  ): Promise<{
    category: any;
    products: any[];
    totalProducts: number;
  }> {
    const category = await this.productCategoryService.findById(
      new Types.ObjectId(categoryId),
    );

    if (!category) {
      throw new NotFoundException(`Category with ID ${categoryId} not found`);
    }

    const productsResult = await this.findAll(
      { categoryId: new Types.ObjectId(categoryId) },
      {
        ...options,
        populate: ['categoryId'],
      },
    );

    console.log('Products result:', productsResult);

    return {
      category: {
        _id: category._id,
        name: category.categoryName,
      },
      products: productsResult.data,
      totalProducts: productsResult.total,
    };
  }

  async findById(
    id: Types.ObjectId,
    options?: CustomOptions<ProductDocument>,
  ): Promise<any> {
    const product = await super.findById(id, {
      ...options,
      populate: ['categoryId'],
    });

    if (!product) {
      return null;
    }

    const productItemsResult =
      await this.productItemService.findAllWithVariations(
        {
          productId: new Types.ObjectId(id),
        },
        null,
      );

    const items = productItemsResult.data || [];

    const variationsMap = new Map();
    items.forEach((item: any) => {
      if (item.configurations) {
        item.configurations.forEach((config: any) => {
          const variation = config.variationOptionId?.variationId;
          const option = config.variationOptionId;

          if (variation && option) {
            const varId = variation._id;

            if (!variationsMap.has(varId)) {
              variationsMap.set(varId, {
                _id: variation._id,
                name: variation.name,
                description: variation.description,
                options: [],
              });
            }

            // Add unique options
            const varData = variationsMap.get(varId);
            const optionExists = varData.options.some(
              (opt: any) => opt._id === option._id,
            );

            if (!optionExists) {
              varData.options.push({
                _id: option._id,
                name: option.name,
                value: option.value,
              });
            }
          }
        });
      }
    });

    const totalStock = items.reduce((sum: number, item: any) => {
      return sum + (item.qtyInStock || 0);
    }, 0);

    const price = items.length > 0 ? items[0].price : 0;

    return {
      _id: product._id,
      productName: product.productName,
      thumbnails: product.thumbnails || [],
      content: product.content,
      categoryId: product.categoryId,

      variations: Array.from(variationsMap.values()),
      price,
      totalStock,
      inStock: totalStock > 0,
      itemsCount: items.length,
      items: items.map((item: any) => ({
        _id: item._id,
        SKU: item.SKU,
        price: item.price,
        images: item.images || [],
        qtyInStock: item.qtyInStock || 0,
        inStock: (item.qtyInStock || 0) > 0,
        configurations:
          item.configurations?.map((config: any) => ({
            variationName: config.variationOptionId?.variationId?.name,
            optionValue: config.variationOptionId?.value,
            optionId: config.variationOptionId?._id,
          })) || [],
      })),
    };
  }

  async update(
    id: string,
    updateData: Partial<UpdateProductDto>,
  ): Promise<Product> {
    if (!id) {
      throw new BadRequestException('Product ID is required');
    }

    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid product ID format');
    }

    try {
      const updatedProduct = await this.productModel.findByIdAndUpdate(
        id,
        updateData,
        {
          new: true,
          runValidators: true,
          populate: 'categoryId',
        },
      );

      if (!updatedProduct) {
        throw new NotFoundException(`Product with ID ${id} not found`);
      }

      return updatedProduct;
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      console.error('Error updating product:', error);
      throw new BadRequestException('Failed to update product');
    }
  }

  async remove(id: string) {
    try {
      await this.productModel.deleteOne({ _id: id });
    } catch {
      throw new NotFoundException('Product not found');
    }
  }
}
