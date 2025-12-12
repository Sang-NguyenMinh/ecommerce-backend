import { Controller, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { Roles } from 'src/decorators/customize';
import { ApiBearerAuth } from '@nestjs/swagger';
import { CategoryVariationService } from './categoryVariation.service';
import {
  CategoryVariationQueryDto,
  CreateCategoryVariationDto,
  UpdateCategoryVariationDto,
} from './dto/categoryVariation.dto';
import { BaseController } from '../base/base.controller';
import { CategoryVariationDocument } from './schemas/category-variation.schema';
import { FilterQuery, Types } from 'mongoose';

@ApiBearerAuth()
@Controller('category-variation')
export class CategoryVariationController extends BaseController<
  CategoryVariationDocument,
  CategoryVariationService
> {
  constructor(
    private readonly categoryVariationService: CategoryVariationService,
  ) {
    super(categoryVariationService, 'Category Variation', ['name', 'value']);
  }

  @Roles('Admin')
  @Post()
  create(@Body() createVariationDto: CreateCategoryVariationDto) {
    return this.categoryVariationService.create(createVariationDto);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateVariationDto: UpdateCategoryVariationDto,
  ) {
    return this.categoryVariationService.update(id, updateVariationDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.categoryVariationService.remove(id);
  }

  protected addCustomFilters(
    filter: any,
    queryDto: CategoryVariationQueryDto,
  ): FilterQuery<CategoryVariationDocument> {
    if (queryDto.categoryId) {
      filter.categoryId = new Types.ObjectId(queryDto.categoryId);
    }

    return filter;
  }
}
