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
import { ProductCategory } from '../product-category/schemas/product-category.schema';
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

    // Group product items by productId
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

    // Enrich products with their items and variations
    const enrichedData = result.data.map((product: any) => {
      const items = productItemsByProductId[product._id] || [];

      // Extract unique variations from all product items
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

        // Product variations (colors, sizes, etc.)
        variations: Array.from(variationsMap.values()),

        // Price information
        price,

        // Stock information
        totalStock,
        inStock: totalStock > 0,

        // Product items count
        itemsCount: items.length,

        // All product items (SKUs with specific color/size combinations)
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
    // Get category information
    const category = await this.productCategoryService.findById(
      new Types.ObjectId(categoryId),
    );

    if (!category) {
      throw new NotFoundException(`Category with ID ${categoryId} not found`);
    }

    // Get products by categoryId
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

    // Extract unique variations from all product items
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

      // Product variations (colors, sizes, etc.)
      variations: Array.from(variationsMap.values()),

      // Price information
      price,

      // Stock information
      totalStock,
      inStock: totalStock > 0,

      // Product items count
      itemsCount: items.length,

      // All product items (SKUs with specific color/size combinations)
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

      console.log('Product updated successfully:', {
        id: updatedProduct._id,
        thumbnailsCount: updatedProduct.thumbnails?.length || 0,
      });

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

[
  {
    _id: { $oid: '692560ccf27c4ebcb61be255' },
    productId: { $oid: '69247a91085b688c8783b39f' },
    SKU: 'Jogger-Thun-XL-DEN',
    price: 450000,
    images: [
      'https://res.cloudinary.com/ddrrh2cxt/image/upload/v1749778363/e-commerce/p2yg3vynjplsxioftrtp.jpg',
    ],
    qtyInStock: 30,
    __v: 0,
    createdAt: { $date: '2025-11-24T15:55:00.000Z' },
    updatedAt: { $date: '2025-11-24T15:55:00.000Z' },
  },
  {
    _id: { $oid: '692560ccf27c4ebcb61be256' },
    productId: { $oid: '69247a91085b688c8783b39f' },
    SKU: 'Jogger-Thun-L-XAM',
    price: 450000,
    images: [
      'https://res.cloudinary.com/ddrrh2cxt/image/upload/v1751349536/e-commerce/lw169t7cncnvu3ixkak8.webp',
    ],
    qtyInStock: 25,
    __v: 0,
    createdAt: { $date: '2025-11-24T15:55:30.000Z' },
    updatedAt: { $date: '2025-11-24T15:55:30.000Z' },
  },
  {
    _id: { $oid: '692560ccf27c4ebcb61be257' },
    productId: { $oid: '69247a91085b688c8783b39f' },
    SKU: 'Jogger-Thun-M-DEN',
    price: 450000,
    images: [
      'https://res.cloudinary.com/ddrrh2cxt/image/upload/v1749778709/e-commerce/ducru4zxomnk6cmfzyru.webp',
    ],
    qtyInStock: 35,
    __v: 0,
    createdAt: { $date: '2025-11-24T15:56:00.000Z' },
    updatedAt: { $date: '2025-11-24T15:56:00.000Z' },
  },
  {
    _id: { $oid: '692560ccf27c4ebcb61be258' },
    productId: { $oid: '69247a91085b688c8783b39e' },
    SKU: 'Thun-CoTim-XL-TRANG',
    price: 280000,
    images: [
      'https://res.cloudinary.com/ddrrh2cxt/image/upload/v1749778511/e-commerce/jlfe3apkjlmackxzxleu.webp',
    ],
    qtyInStock: 20,
    __v: 0,
    createdAt: { $date: '2025-11-24T15:56:30.000Z' },
    updatedAt: { $date: '2025-11-24T15:56:30.000Z' },
  },
  {
    _id: { $oid: '692560ccf27c4ebcb61be259' },
    productId: { $oid: '69247a91085b688c8783b39e' },
    SKU: 'Thun-CoTim-L-DEN',
    price: 280000,
    images: [
      'https://res.cloudinary.com/ddrrh2cxt/image/upload/v1749778709/e-commerce/ducru4zxomnk6cmfzyru.webp',
    ],
    qtyInStock: 28,
    __v: 0,
    createdAt: { $date: '2025-11-24T15:57:00.000Z' },
    updatedAt: { $date: '2025-11-24T15:57:00.000Z' },
  },
  {
    _id: { $oid: '692560ccf27c4ebcb61be25a' },
    productId: { $oid: '69247a91085b688c8783b39e' },
    SKU: 'Thun-CoTim-M-XANH',
    price: 280000,
    images: [
      'https://res.cloudinary.com/ddrrh2cxt/image/upload/v1751349536/e-commerce/lw169t7cncnvu3ixkak8.webp',
    ],
    qtyInStock: 32,
    __v: 0,
    createdAt: { $date: '2025-11-24T15:57:30.000Z' },
    updatedAt: { $date: '2025-11-24T15:57:30.000Z' },
  },
  {
    _id: { $oid: '692560ccf27c4ebcb61be25b' },
    productId: { $oid: '69247a91085b688c8783b39d' },
    SKU: 'Polo-Pique-XL-XAM',
    price: 390000,
    images: [
      'https://res.cloudinary.com/ddrrh2cxt/image/upload/v1749778630/e-commerce/phdwtkh7cyrbpmh8o4tv.webp',
    ],
    qtyInStock: 15,
    __v: 0,
    createdAt: { $date: '2025-11-24T15:58:00.000Z' },
    updatedAt: { $date: '2025-11-24T15:58:00.000Z' },
  },
  {
    _id: { $oid: '692560ccf27c4ebcb61be25c' },
    productId: { $oid: '69247a91085b688c8783b39d' },
    SKU: 'Polo-Pique-L-DO',
    price: 390000,
    images: [
      'https://res.cloudinary.com/ddrrh2cxt/image/upload/v1751349536/e-commerce/lw169t7cncnvu3ixkak8.webp',
    ],
    qtyInStock: 22,
    __v: 0,
    createdAt: { $date: '2025-11-24T15:58:30.000Z' },
    updatedAt: { $date: '2025-11-24T15:58:30.000Z' },
  },
  {
    _id: { $oid: '692560ccf27c4ebcb61be25d' },
    productId: { $oid: '69247a91085b688c8783b39d' },
    SKU: 'Polo-Pique-M-XAM',
    price: 390000,
    images: [
      'https://res.cloudinary.com/ddrrh2cxt/image/upload/v1749778709/e-commerce/ducru4zxomnk6cmfzyru.webp',
    ],
    qtyInStock: 18,
    __v: 0,
    createdAt: { $date: '2025-11-24T15:59:00.000Z' },
    updatedAt: { $date: '2025-11-24T15:59:00.000Z' },
  },
  {
    _id: { $oid: '692560ccf27c4ebcb61be25e' },
    productId: { $oid: '69247a91085b688c8783b39c' },
    SKU: 'Jeans-Dai-32-XANHDAM',
    price: 520000,
    images: [
      'https://res.cloudinary.com/ddrrh2cxt/image/upload/v1749778709/e-commerce/ducru4zxomnk6cmfzyru.webp',
    ],
    qtyInStock: 12,
    __v: 0,
    createdAt: { $date: '2025-11-24T15:59:30.000Z' },
    updatedAt: { $date: '2025-11-24T15:59:30.000Z' },
  },
  {
    _id: { $oid: '692560ccf27c4ebcb61be25f' },
    productId: { $oid: '69247a91085b688c8783b39c' },
    SKU: 'Jeans-Dai-30-XANHDEN',
    price: 520000,
    images: [
      'https://res.cloudinary.com/ddrrh2cxt/image/upload/v1749778363/e-commerce/p2yg3vynjplsxioftrtp.jpg',
    ],
    qtyInStock: 16,
    __v: 0,
    createdAt: { $date: '2025-11-24T16:00:00.000Z' },
    updatedAt: { $date: '2025-11-24T16:00:00.000Z' },
  },
  {
    _id: { $oid: '692560ccf27c4ebcb61be260' },
    productId: { $oid: '69247a91085b688c8783b39c' },
    SKU: 'Jeans-Dai-34-XANHDAM',
    price: 520000,
    images: [
      'https://res.cloudinary.com/ddrrh2cxt/image/upload/v1751349536/e-commerce/lw169t7cncnvu3ixkak8.webp',
    ],
    qtyInStock: 10,
    __v: 0,
    createdAt: { $date: '2025-11-24T16:00:30.000Z' },
    updatedAt: { $date: '2025-11-24T16:00:30.000Z' },
  },
  {
    _id: { $oid: '692560ccf27c4ebcb61be261' },
    productId: { $oid: '69247a91085b688c8783b39b' },
    SKU: 'Kaki-Dai-32-DEN',
    price: 480000,
    images: [
      'https://res.cloudinary.com/ddrrh2cxt/image/upload/v1749778363/e-commerce/p2yg3vynjplsxioftrtp.jpg',
    ],
    qtyInStock: 20,
    __v: 0,
    createdAt: { $date: '2025-11-24T16:01:00.000Z' },
    updatedAt: { $date: '2025-11-24T16:01:00.000Z' },
  },
  {
    _id: { $oid: '692560ccf27c4ebcb61be262' },
    productId: { $oid: '69247a91085b688c8783b39b' },
    SKU: 'Kaki-Dai-30-XANHDEN',
    price: 480000,
    images: [
      'https://res.cloudinary.com/ddrrh2cxt/image/upload/v1751349536/e-commerce/lw169t7cncnvu3ixkak8.webp',
    ],
    qtyInStock: 25,
    __v: 0,
    createdAt: { $date: '2025-11-24T16:01:30.000Z' },
    updatedAt: { $date: '2025-11-24T16:01:30.000Z' },
  },
  {
    _id: { $oid: '692560ccf27c4ebcb61be263' },
    productId: { $oid: '69247a91085b688c8783b39b' },
    SKU: 'Kaki-Dai-28-NAU',
    price: 480000,
    images: [
      'https://res.cloudinary.com/ddrrh2cxt/image/upload/v1749778709/e-commerce/ducru4zxomnk6cmfzyru.webp',
    ],
    qtyInStock: 30,
    __v: 0,
    createdAt: { $date: '2025-11-24T16:02:00.000Z' },
    updatedAt: { $date: '2025-11-24T16:02:00.000Z' },
  },
];
