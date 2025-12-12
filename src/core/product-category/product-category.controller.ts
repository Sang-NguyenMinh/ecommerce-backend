import {
  Controller,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { ProductCategoryService } from './product-category.service';
import {
  CreateProductCategoryDto,
  UpdateProductCategoryDto,
} from './dto/product-category.dto';
import { Roles } from 'src/decorators/customize';
import { ApiBearerAuth, ApiBody, ApiConsumes } from '@nestjs/swagger';
import { BaseController } from '../base/base.controller';
import { ProductCategoryDocument } from './schemas/product-category.schema';
import { FileInterceptor } from '@nestjs/platform-express';
import { CloudinaryService } from 'src/shared/cloudinary.service';

@ApiBearerAuth()
@Controller('product-category')
export class ProductCategoryController extends BaseController<
  ProductCategoryDocument,
  ProductCategoryService
> {
  constructor(
    private readonly productCategoryService: ProductCategoryService,

    private readonly cloudinaryService: CloudinaryService,
  ) {
    super(productCategoryService, 'Product Category', [
      'categoryName',
      'description',
    ]);
  }

  @Post()
  @Roles('Admin')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        categoryName: {
          type: 'string',
          example: 'Jeans',
          description: 'Product category name',
        },
        parentCategory: {
          type: 'string',
          example: '65f25a3d6e4b3b001c2d5a8e',
          description: 'Parent category ID (if any)',
        },
        status: {
          type: 'boolean',
          example: true,
          description: 'Status of the product category',
        },
        thumbnail: {
          type: 'string',
          format: 'binary',
          description: 'Thumbnail image file',
        },
      },
      required: ['categoryName'],
    },
  })
  @UseInterceptors(FileInterceptor('thumbnail'))
  async create(
    @Body() createProductCategoryDto: CreateProductCategoryDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    try {
      if (
        createProductCategoryDto.variations &&
        typeof createProductCategoryDto.variations === 'string'
      ) {
        createProductCategoryDto.variations = JSON.parse(
          createProductCategoryDto.variations as string,
        );
      }
      let thumbnailUrl: string | undefined;

      console.log('Uploaded file:', createProductCategoryDto);
      if (file) {
        const uploadedImage = await this.cloudinaryService.uploadImage(file);
        thumbnailUrl = uploadedImage.secure_url;
      }

      return this.productCategoryService.create(
        createProductCategoryDto,
        thumbnailUrl,
      );
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  @Patch(':id')
  @Roles('Admin')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        categoryName: {
          type: 'string',
          example: 'Smartphones',
          description: 'New category name (if you want to update)',
        },
        parentCategory: {
          type: 'string',
          example: '65f25a3d6e4b3b001c2d5a8e',
          description: 'New parent category ID (if you want to update)',
        },
        status: {
          type: 'boolean',
          example: true,
          description: 'Status of the product category',
        },
        thumbnail: {
          type: 'string',
          format: 'binary',
          description: 'Thumbnail image file',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('thumbnail'))
  async update(
    @Param('id') id: string,
    @Body() updateProductCategoryDto: UpdateProductCategoryDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    try {
      if (
        updateProductCategoryDto.variations &&
        typeof updateProductCategoryDto.variations === 'string'
      ) {
        updateProductCategoryDto.variations = JSON.parse(
          updateProductCategoryDto.variations as string,
        );
      }

      let thumbnailUrl: string | undefined;

      if (file) {
        const uploadedImage = await this.cloudinaryService.uploadImage(file);
        thumbnailUrl = uploadedImage.secure_url;
      }

      return this.productCategoryService.update(
        id,
        updateProductCategoryDto,
        thumbnailUrl,
      );
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  @Roles('Admin')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productCategoryService.remove(id);
  }
}
