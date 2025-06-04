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
  BadRequestException,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { ApiBearerAuth, ApiConsumes, ApiParam } from '@nestjs/swagger';
import { CreateProductDto, UpdateProductDto } from './dto/product.dto';
import { CloudinaryService } from 'src/shared/cloudinary.service';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { Roles } from 'src/decorators/customize';
import { Types } from 'mongoose';

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

  @UseInterceptors(FilesInterceptor('thumbnails', 10))
  @Roles('Admin')
  @ApiConsumes('multipart/form-data')
  @ApiParam({
    name: 'id',
    description: 'Product ID',
    example: '65f25a3d6e4b3b001c2d5a8e',
  })
  @Patch(':id') // Changed from @Patch() to @Patch(':id')
  async update(
    @Param('id') id: string, // Get ID from URL params
    @Body() updateProductDto: UpdateProductDto,
    @UploadedFiles() files?: Express.Multer.File[],
  ) {
    console.log('Product ID from params:', id);
    console.log('Raw DTO:', updateProductDto);

    // Validate ID
    if (!id || !Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid product ID');
    }

    let updatedData = { ...updateProductDto };

    // Xử lý ảnh mới được upload
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

    // Lấy danh sách ảnh cũ được giữ lại
    const existingUrls = updateProductDto.existingThumbnails || [];
    console.log('Existing URLs:', existingUrls);
    console.log('New URLs:', newImageUrls);

    // Kết hợp ảnh cũ và ảnh mới
    const allThumbnails = [...existingUrls, ...newImageUrls];

    // Cập nhật thumbnails trong updatedData
    updatedData.thumbnails = allThumbnails;

    // Xóa existingThumbnails khỏi updatedData vì đã xử lý
    delete updatedData.existingThumbnails;

    console.log('Final update data:', {
      id: id,
      existingImages: existingUrls.length,
      newImages: newImageUrls.length,
      totalImages: allThumbnails.length,
      finalThumbnails: allThumbnails,
    });

    return this.productService.update(id, updatedData); // Pass ID separately
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productService.remove(id);
  }
}
