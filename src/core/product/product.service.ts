import { CloudinaryService } from './../../shared/cloudinary.service';
import { Injectable, NotFoundException } from '@nestjs/common';
import { Product } from './schemas/product.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateProductDto, UpdateProductDto } from './dto/product.dto';

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

  async update(updateProductDto: UpdateProductDto): Promise<Product> {
    const { id, ...updateData } = updateProductDto;
    const updatedProduct = await this.productModel.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true },
    );
    if (!updatedProduct) {
      throw new NotFoundException('Product not found');
    }
    return updatedProduct;
  }

  async findOne(id: string): Promise<Product> {
    const product = await this.productModel.findById(id).populate('categoryId');
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    return product;
  }

  findAll() {
    return `This action returns all product`;
  }

  remove(id: number) {
    return `This action removes a #${id} product`;
  }
}
