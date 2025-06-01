import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { ProductCategory } from './schemas/product-category.schema';
import { FilterQuery, Model, QueryOptions, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import {
  CreateProductCategoryDto,
  UpdateProductCategoryDto,
} from './dto/product-category.dto';
import { CustomOptions } from 'src/config/types';
import { ProductService } from '../product/product.service';

@Injectable()
export class ProductCategoryService {
  constructor(
    @InjectModel(ProductCategory.name)
    private productCategoryModel: Model<ProductCategory>,
    private productService: ProductService,
  ) {}

  async create(dto: CreateProductCategoryDto): Promise<ProductCategory> {
    const existingCategory = await this.productCategoryModel
      .findOne({ categoryName: dto.categoryName })
      .exec();
    if (existingCategory) {
      throw new BadRequestException('Category name already exists');
    }

    const newCategory = new this.productCategoryModel(dto);
    return newCategory.save();
  }

  async findOne(categoryId: string): Promise<ProductCategory> {
    const category = await this.productCategoryModel
      .findById(categoryId)
      .exec();
    if (!category) {
      throw new NotFoundException('Product category does not exist');
    }
    return category;
  }
  async update(
    id: string,
    dto: UpdateProductCategoryDto,
  ): Promise<ProductCategory> {
    const { ...updateData } = dto;

    const updatedCategory = await this.productCategoryModel
      .findByIdAndUpdate(id, updateData, { new: true })
      .exec();

    if (!updatedCategory) {
      throw new NotFoundException('Product category does not exist');
    }

    return updatedCategory;
  }

  async findAll(
    filter?: FilterQuery<ProductCategory>,
    options?: CustomOptions<ProductCategory>,
  ) {
    const total = await this.productCategoryModel.countDocuments({ ...filter });

    const categories = await this.productCategoryModel
      .find({ ...filter }, { ...options })
      .populate('parentCategory')
      .exec();

    return {
      categories,
      total,
    };
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
