import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PromotionCategoryService } from './promotion-category.service';
import { CreatePromotionCategoryDto } from './dto/create-promotion-category.dto';
import { UpdatePromotionCategoryDto } from './dto/update-promotion-category.dto';

@Controller('promotion-category')
export class PromotionCategoryController {
  constructor(private readonly promotionCategoryService: PromotionCategoryService) {}

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
    return this.promotionCategoryService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePromotionCategoryDto: UpdatePromotionCategoryDto) {
    return this.promotionCategoryService.update(+id, updatePromotionCategoryDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.promotionCategoryService.remove(+id);
  }
}
