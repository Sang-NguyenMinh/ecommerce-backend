import {
  Controller,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFiles,
  BadRequestException,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { ApiBearerAuth, ApiConsumes, ApiParam } from '@nestjs/swagger';
import { CreateProductDto, UpdateProductDto } from './dto/product.dto';
import { CloudinaryService } from 'src/shared/cloudinary.service';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { Roles } from 'src/decorators/customize';
import { Types } from 'mongoose';
import { BaseController } from '../base/base.controller';
import { ProductDocument } from './schemas/product.schema';

@ApiBearerAuth()
@Controller('product')
export class ProductController extends BaseController<
  ProductDocument,
  ProductService
> {
  constructor(
    private readonly productService: ProductService,
    private cloudinaryService: CloudinaryService,
  ) {
    super(productService, 'product');
  }

  @Post()
  @Roles('Admin')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FilesInterceptor('thumbnails'))
  async create(
    @Body() createProductDto: CreateProductDto,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    try {
      console.log(files);
      const uploadedImages = await Promise.all(
        (files ?? []).map((file) => this.cloudinaryService.uploadImage(file)),
      );

      return this.productService.create({
        ...createProductDto,
        thumbnails: uploadedImages.map((img) => img.secure_url),
      });
    } catch (error) {
      console.log(error);
    }
  }

  @UseInterceptors(FilesInterceptor('thumbnails', 10))
  @Roles('Admin')
  @ApiConsumes('multipart/form-data')
  @ApiParam({
    name: 'id',
    description: 'Product ID',
    example: '65f25a3d6e4b3b001c2d5a8e',
  })
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
    @UploadedFiles() files?: Express.Multer.File[],
  ) {
    console.log('Product ID from params:', id);
    console.log('Raw DTO:', updateProductDto);

    if (!id || !Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid product ID');
    }

    let updatedData = { ...updateProductDto };

    const newImageUrls: string[] = [];
    if (files && files.length > 0) {
      for (const file of files) {
        try {
          const uploadedImage = await this.cloudinaryService.uploadImage(file);
          newImageUrls.push(uploadedImage.secure_url);
        } catch (error) {
          console.error('Error uploading image:', error);
          throw new BadRequestException('Failed to upload image');
        }
      }
    }

    const existingUrls = updateProductDto.existingThumbnails || [];
    console.log('Existing URLs:', existingUrls);
    console.log('New URLs:', newImageUrls);

    const allThumbnails = [...existingUrls, ...newImageUrls];

    updatedData.thumbnails = allThumbnails;

    delete updatedData.existingThumbnails;

    console.log('Final update data:', {
      id: id,
      existingImages: existingUrls.length,
      newImages: newImageUrls.length,
      totalImages: allThumbnails.length,
      finalThumbnails: allThumbnails,
    });

    return this.productService.update(id, updatedData);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productService.remove(id);
  }
}
