import { Controller, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PromotionProductService } from './promotion-product.service';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Roles } from 'src/decorators/customize';
import {
  CreatePromotionProductDto,
  UpdatePromotionProductDto,
} from './dto/promotion-product.dto';
import { BaseController } from '../base/base.controller';
import { PromotionProductDocument } from './schemas/promotion-product.schema';

@ApiBearerAuth()
@Controller('promotion-product')
export class PromotionProductController extends BaseController<
  PromotionProductDocument,
  PromotionProductService
> {
  constructor(
    private readonly promotionProductService: PromotionProductService,
  ) {
    super(promotionProductService, 'promotion-product', ['name']);
  }

  @Roles('Admin')
  @Post()
  create(@Body() createPromotionProductDto: CreatePromotionProductDto) {
    console.log(createPromotionProductDto);
    return this.promotionProductService.create(createPromotionProductDto);
  }
}
