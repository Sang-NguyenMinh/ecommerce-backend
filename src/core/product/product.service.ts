import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Product, ProductDocument } from './schemas/product.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateProductDto, UpdateProductDto } from './dto/product.dto';
import { BaseService } from '../base/base.service';

@Injectable()
export class ProductService extends BaseService<ProductDocument> {
  constructor(
    @InjectModel(Product.name)
    private productModel: Model<ProductDocument>,
  ) {
    super(productModel);
  }

  async create(createProductDto: CreateProductDto): Promise<Product> {
    const newProduct = new this.productModel(createProductDto);
    return newProduct.save();
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
