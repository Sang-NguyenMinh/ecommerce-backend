import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  UploadedFiles,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { ApiBearerAuth, ApiConsumes } from '@nestjs/swagger';
import { CreateProductDto, UpdateProductDto } from './dto/product.dto';
import { CloudinaryService } from 'src/shared/cloudinary.service';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { Roles } from 'src/decorators/customize';

@ApiBearerAuth()
@Controller('product')
export class ProductController {
  constructor(
    private readonly productService: ProductService,
    private cloudinaryService: CloudinaryService,
  ) {}

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

  @Get()
  findAll() {
    return this.productService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productService.findOne(id);
  }

  @UseInterceptors(FileInterceptor('thumbnail'))
  @Roles('Admin')
  @ApiConsumes('multipart/form-data')
  @Patch()
  async update(
    @Body() updateProductDto: UpdateProductDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    let updatedData = { ...updateProductDto };

    if (file) {
      const uploadedImage = await this.cloudinaryService.uploadImage(file);
      updatedData.thumbnails = uploadedImage.secure_url;
    }
    return this.productService.update(updatedData);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productService.remove(+id);
  }
}
