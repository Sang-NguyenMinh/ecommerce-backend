import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ProductCategory } from './schemas/product-category.schema';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import {
  CreateProductCategoryDto,
  UpdateProductCategoryDto,
} from './dto/product-category.dto';

@Injectable()
export class ProductCategoryService {
  constructor(
    @InjectModel(ProductCategory.name)
    private productCategoryModel: Model<ProductCategory>,
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

  async update(dto: UpdateProductCategoryDto): Promise<ProductCategory> {
    const { id, ...updateData } = dto;

    const updatedCategory = await this.productCategoryModel
      .findByIdAndUpdate(id, updateData, { new: true })
      .exec();

    if (!updatedCategory) {
      throw new NotFoundException('Product category does not exist');
    }

    return updatedCategory;
  }

  findAll() {
    return `This action returns all productCategory`;
  }

  remove(id: number) {
    return `This action removes a #${id} productCategory`;
  }
}
