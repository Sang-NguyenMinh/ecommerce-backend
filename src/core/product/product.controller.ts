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
} from '@nestjs/common';
import { ProductService } from './product.service';
import { ApiBearerAuth, ApiConsumes } from '@nestjs/swagger';
import { CreateProductDto, UpdateProductDto } from './dto/product.dto';
import { CloudinaryService } from 'src/shared/cloudinary.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { Roles } from 'src/decorators/customize';

@ApiBearerAuth()
@Controller('product')
export class ProductController {
  constructor(
    private readonly productService: ProductService,
    private cloudinaryService: CloudinaryService,
  ) {}

  @Roles('Admin')
  @ApiConsumes('multipart/form-data')
  @Post()
  @UseInterceptors(FileInterceptor('thumbnail'))
  async create(
    @Body() createProductDto: CreateProductDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const uploadedImage = await this.cloudinaryService.uploadImage(file);

    return this.productService.create({
      ...createProductDto,
      thumbnail: uploadedImage.secure_url,
    });
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
      updatedData.thumbnail = uploadedImage.secure_url;
    }
    return this.productService.update(updatedData);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productService.remove(+id);
  }
}
