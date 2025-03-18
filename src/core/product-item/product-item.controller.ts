import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { ProductItemService } from './product-item.service';
import {
  CreateProductItemDto,
  UpdateProductItemDto,
} from './dto/product-item.dto';
import { Roles } from 'src/decorators/customize';
import { ApiBearerAuth, ApiConsumes } from '@nestjs/swagger';
import {
  FileFieldsInterceptor,
  FilesInterceptor,
} from '@nestjs/platform-express';
import { CloudinaryService } from 'src/shared/cloudinary.service';

@ApiBearerAuth()
@Controller('product-item')
export class ProductItemController {
  constructor(
    private readonly productItemService: ProductItemService,
    private cloudinaryService: CloudinaryService,
  ) {}

  @Roles('Admin')
  @ApiConsumes('multipart/form-data')
  @Post()
  @UseInterceptors(FileFieldsInterceptor([{ name: 'images', maxCount: 5 }]))
  async create(
    @Body() createProductItemDto: CreateProductItemDto,
    @UploadedFiles() files: { images?: Express.Multer.File[] },
  ) {
    const uploadedImages = await Promise.all(
      (files.images || []).map((file) =>
        this.cloudinaryService.uploadImage(file),
      ),
    );

    const imageUrls = uploadedImages.map((image) => image.secure_url);
    return this.productItemService.create({
      ...createProductItemDto,
      images: imageUrls,
    });
  }

  @Get()
  findAll() {
    return this.productItemService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productItemService.findOne(id);
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
    return this.productItemService.remove(+id);
  }
}
