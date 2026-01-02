import {
  Controller,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFiles,
  Get,
  Query,
  HttpException,
} from '@nestjs/common';
import { ProductItemService } from './product-item.service';
import {
  CreateProductItemDto,
  ProductItemQueryDto,
  UpdateProductItemDto,
} from './dto/product-item.dto';
import { Public, Roles } from 'src/decorators/customize';
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiOperation,
  ApiParam,
  ApiResponse,
} from '@nestjs/swagger';
import { FilesInterceptor } from '@nestjs/platform-express';
import { CloudinaryService } from 'src/shared/cloudinary.service';
import { BaseController } from '../base/base.controller';
import { ProductItemDocument } from './schemas/product-item.schema';
import { FilterQuery, Types } from 'mongoose';

@ApiBearerAuth()
@Controller('product-item')
export class ProductItemController extends BaseController<
  ProductItemDocument,
  ProductItemService
> {
  constructor(
    private readonly productItemService: ProductItemService,
    private cloudinaryService: CloudinaryService,
  ) {
    super(productItemService, 'Product Item', ['SKU', 'productName']);
  }

  @Post()
  @Roles('Admin')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FilesInterceptor('images'))
  async create(
    @Body() createProductItemDto: CreateProductItemDto,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    try {
      if (
        createProductItemDto.configurations &&
        typeof createProductItemDto.configurations === 'string'
      ) {
        createProductItemDto.configurations = JSON.parse(
          createProductItemDto.configurations as string,
        );
      }
      const uploadedImages = await Promise.all(
        (files ?? []).map((file) => this.cloudinaryService.uploadImage(file)),
      );

      return this.productItemService.create({
        ...createProductItemDto,
        images: uploadedImages.map((img) => img.secure_url),
      });
    } catch (error) {
      console.log(error);
    }
  }

  @Get()
  @ApiOperation({ summary: 'Get all product items with variations' })
  @ApiResponse({ status: 200, description: 'Success' })
  @Public()
  async findAll(@Query() queryDto: ProductItemQueryDto) {
    const filter = this.buildProductItemFilter(queryDto);
    const options = this.buildOptions(queryDto);

    return await this.productItemService.findAllWithVariations(filter, options);
  }

  @Get(':id')
  @ApiParam({ name: 'id' })
  @ApiResponse({ status: 200, description: 'Success' })
  @ApiResponse({ status: 404, description: 'Not found' })
  @Public()
  async findOne(@Param('id') id: string): Promise<any> {
    const result = await this.productItemService.findByIdWithVariations(
      new Types.ObjectId(id),
      {
        errThrowing: false,
      },
    );

    return result;
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateProductItemDto: UpdateProductItemDto,
  ) {
    return this.productItemService.update(updateProductItemDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productItemService.remove(id);
  }

  protected buildProductItemFilter(
    queryDto: ProductItemQueryDto,
  ): FilterQuery<ProductItemDocument> {
    const filter: any = {};

    if (queryDto.search) {
      Object.assign(
        filter,
        this.productItemService['buildSearchFilter'](queryDto.search, ['SKU']),
      );
    }

    if (queryDto.productId) {
      filter.productId = queryDto.productId;
    }

    if (queryDto.minPrice !== undefined || queryDto.maxPrice !== undefined) {
      filter.price = {};
      if (queryDto.minPrice !== undefined) {
        filter.price.$gte = queryDto.minPrice;
      }
      if (queryDto.maxPrice !== undefined) {
        filter.price.$lte = queryDto.maxPrice;
      }
    }

    if (queryDto.includeOutOfStock === false) {
      filter.qtyInStock = { $gt: 0 };
    }

    return filter;
  }

  protected addCustomFilters(
    filter: any,
    queryDto: any,
  ): FilterQuery<ProductItemDocument> {
    return this.buildProductItemFilter(queryDto);
  }
}
