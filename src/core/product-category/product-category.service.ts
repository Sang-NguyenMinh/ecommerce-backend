import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import {
  ProductCategory,
  ProductCategoryDocument,
} from './schemas/product-category.schema';
import { FilterQuery, Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import {
  CreateProductCategoryDto,
  UpdateProductCategoryDto,
} from './dto/product-category.dto';
import { CustomOptions } from 'src/config/types';
import { ProductService } from '../product/product.service';
import { BaseService } from '../base/base.service';
import { CategoryVariationService } from '../category-variation/categoryVariation.service';

@Injectable()
export class ProductCategoryService extends BaseService<ProductCategoryDocument> {
  constructor(
    @InjectModel(ProductCategory.name)
    private productCategoryModel: Model<ProductCategoryDocument>,

    @Inject(forwardRef(() => ProductService))
    private productService: ProductService,
    @Inject(forwardRef(() => CategoryVariationService))
    private categoryVariationService: CategoryVariationService,
  ) {
    super(productCategoryModel);
  }

  async create(
    dto: CreateProductCategoryDto,
    thumbnailUrl?: string,
  ): Promise<ProductCategory> {
    const existingCategory = await this.productCategoryModel
      .findOne({ categoryName: dto.categoryName })
      .exec();
    if (existingCategory) {
      throw new BadRequestException('Category name already exists');
    }

    const categoryData = {
      ...dto,
      ...(thumbnailUrl && { thumbnail: thumbnailUrl }),
    };

    const newCategory = new this.productCategoryModel(categoryData);
    const savedCategory = await newCategory.save();

    const categoryVariations = dto?.variations?.map((variationId) => ({
      categoryId: savedCategory._id,
      variationId: new Types.ObjectId(variationId),
    }));

    await this.categoryVariationService.createMany(categoryVariations);

    return savedCategory;
  }

  async update(
    id: string,
    dto: UpdateProductCategoryDto,
    thumbnailUrl?: string,
  ): Promise<ProductCategory> {
    console.log(dto);
    const existingCategory = await this.productCategoryModel
      .findById(id)
      .exec();

    if (!existingCategory) {
      throw new NotFoundException('Product category does not exist');
    }

    if (
      dto.categoryName &&
      dto.categoryName !== existingCategory.categoryName
    ) {
      const duplicateCategory = await this.productCategoryModel
        .findOne({
          categoryName: dto.categoryName,
          _id: { $ne: id },
        })
        .exec();

      if (duplicateCategory) {
        throw new BadRequestException('Category name already exists');
      }
    }

    const updateData = {
      ...dto,
      ...(thumbnailUrl && { thumbnail: thumbnailUrl }),
    };

    const updatedCategory = await this.productCategoryModel
      .findByIdAndUpdate(id, updateData, { new: true })
      .exec();

    if (dto.variations) {
      await this.categoryVariationService.deleteByCategoryId(id);

      const categoryVariations = dto.variations.map((variationId) => ({
        categoryId: updatedCategory._id,
        variationId: new Types.ObjectId(variationId),
      }));

      await this.categoryVariationService.createMany(categoryVariations);
    }

    return updatedCategory;
  }

  async findAll(filter?: any, options?: any) {
    const defaultOptions = {
      ...options,
      populates: [
        { path: 'parentCategory', select: 'categoryName' },
        ...(options?.populates || []),
      ],
    };

    return super.findAll(filter, defaultOptions);
  }

  async findOne(
    filter: FilterQuery<ProductCategoryDocument>,
    options?: Omit<
      CustomOptions<ProductCategoryDocument>,
      'page' | 'pageSize' | 'limit'
    >,
  ): Promise<ProductCategoryDocument | null> {
    const defaultOptions = {
      ...options,
      populates: [
        { path: 'parentCategory', select: 'categoryName' },
        ...(options?.populates || []),
      ],
    };

    return super.findOne(filter, defaultOptions);
  }

  async remove(id: string) {
    const category = await this.productCategoryModel.findById(id).exec();
    if (!category) {
      throw new NotFoundException('Danh mục không tồn tại');
    }

    const subCategories = await this.productCategoryModel.countDocuments({
      parentCategory: id,
    });
    if (subCategories > 0) {
      throw new BadRequestException(
        'Không thể xóa vì có danh mục con tham chiếu tới danh mục này.',
      );
    }

    const { total: productsUsingCategory } = await this.productService.findAll({
      categoryId: id,
    });

    if (productsUsingCategory > 0) {
    }

    const deleted = await this.productCategoryModel
      .deleteOne({ _id: id })
      .exec();

    if (deleted.deletedCount === 0) {
      throw new InternalServerErrorException('Lỗi khi xóa danh mục sản phẩm');
    }
  }
}
