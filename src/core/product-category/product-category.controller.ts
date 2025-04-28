import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { ProductCategoryService } from './product-category.service';
import {
  CreateProductCategoryDto,
  UpdateProductCategoryDto,
} from './dto/product-category.dto';
import { Types } from 'mongoose';
import { Public, Roles } from 'src/decorators/customize';
import { ApiBearerAuth } from '@nestjs/swagger';

@ApiBearerAuth()
@Controller('product-category')
export class ProductCategoryController {
  constructor(
    private readonly productCategoryService: ProductCategoryService,
  ) {}

  @Roles('Admin')
  @Post()
  create(@Body() createProductCategoryDto: CreateProductCategoryDto) {
    return this.productCategoryService.create(createProductCategoryDto);
  }

  @Public()
  @Get()
  findAll() {
    return this.productCategoryService.findAll();
  }

  @Public()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productCategoryService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateProductCategoryDto: UpdateProductCategoryDto,
  ) {
    return this.productCategoryService.update(id, {
      ...updateProductCategoryDto,
    });
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productCategoryService.remove(id);
  }
}
