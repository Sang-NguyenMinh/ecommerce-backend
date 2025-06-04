import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Product } from './schemas/product.schema';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, Types } from 'mongoose';
import { CreateProductDto, UpdateProductDto } from './dto/product.dto';
import { CustomOptions } from 'src/config/types';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product.name)
    private productModel: Model<Product>,
  ) {}

  async create(createProductDto: CreateProductDto): Promise<Product> {
    const newProduct = new this.productModel(createProductDto);
    return newProduct.save();
  }

  async update(
    id: string,
    updateData: Partial<UpdateProductDto>,
  ): Promise<Product> {
    // Validation
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
          populate: 'categoryId', // Populate category nếu cần
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

  async findOne(id: string): Promise<Product> {
    const product = await this.productModel.findById(id).populate('categoryId');
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    return product;
  }

  async findAll(
    filter?: FilterQuery<Product>,
    options?: CustomOptions<Product>,
  ): Promise<{ products: Product[]; total: number }> {
    const total = await this.productModel.countDocuments({ ...filter });

    const products = await this.productModel
      .find({ ...filter }, { ...options })
      .populate('categoryId')
      .exec();

    return {
      products,
      total,
    };
  }

  async remove(id: string) {
    try {
      await this.productModel.deleteOne({ _id: id });
    } catch {
      throw new NotFoundException('Product not found');
    }
  }
}
