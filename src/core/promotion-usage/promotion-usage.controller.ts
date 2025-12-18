import { Controller, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PromotionUsageService } from './promotion-usage.service';
import {
  CreatePromotionUsageDto,
  UpdatePromotionUsageDto,
} from './dto/promotion-usage.dto';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Roles } from 'src/decorators/customize';
import { BaseController } from '../base/base.controller';
import { PromotionUsageDocument } from './schemas/promotion-usage.schema';

@ApiBearerAuth()
@Controller('promotion-usage')
export class PromotionUsageController extends BaseController<
  PromotionUsageDocument,
  PromotionUsageService
> {
  constructor(private readonly promotionUsageService: PromotionUsageService) {
    super(promotionUsageService, 'promotion-usage');
  }

  @Roles('Admin')
  @Post()
  async create(@Body() createPromotionUsageDto: CreatePromotionUsageDto) {
    return this.promotionUsageService.create(createPromotionUsageDto);
  }
}
