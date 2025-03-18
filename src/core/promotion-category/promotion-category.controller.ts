import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { PromotionCategoryService } from './promotion-category.service';
import {
  CreatePromotionCategoryDto,
  UpdatePromotionCategoryDto,
} from './dto/promotion-category.dto';
import { Roles } from 'src/decorators/customize';
import { ApiBearerAuth } from '@nestjs/swagger';

@ApiBearerAuth()
@Controller('promotion-category')
export class PromotionCategoryController {
  constructor(
    private readonly promotionCategoryService: PromotionCategoryService,
  ) {}

  @Roles('Admin')
  @Post()
  create(@Body() createPromotionCategoryDto: CreatePromotionCategoryDto) {
    return this.promotionCategoryService.create(createPromotionCategoryDto);
  }

  @Get()
  findAll() {
    return this.promotionCategoryService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.promotionCategoryService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updatePromotionCategoryDto: UpdatePromotionCategoryDto,
  ) {
    return this.promotionCategoryService.update(updatePromotionCategoryDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.promotionCategoryService.delete(id);
  }
}
