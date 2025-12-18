import { Controller, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PromotionCategoryService } from './promotion-category.service';
import {
  CreatePromotionCategoryDto,
  UpdatePromotionCategoryDto,
} from './dto/promotion-category.dto';
import { Roles } from 'src/decorators/customize';
import { ApiBearerAuth } from '@nestjs/swagger';
import { BaseController } from '../base/base.controller';
import { PromotionCategoryDocument } from './schemas/promotion-category.schema';

@ApiBearerAuth()
@Controller('promotion-category')
export class PromotionCategoryController extends BaseController<
  PromotionCategoryDocument,
  PromotionCategoryService
> {
  constructor(
    private readonly promotionCategoryService: PromotionCategoryService,
  ) {
    super(promotionCategoryService, 'promotion-category', ['name']);
  }
}
