import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { PromotionService } from './promotion.service';
import { CreatePromotionDto, UpdatePromotionDto } from './dto/promotion.dto';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Roles } from 'src/decorators/customize';
import { BaseController } from '../base/base.controller';
import { PromotionDocument } from './schemas/promotion.schema';

@ApiBearerAuth()
@Controller('promotion')
export class PromotionController extends BaseController<
  PromotionDocument,
  PromotionService
> {
  constructor(private readonly promotionService: PromotionService) {
    super(promotionService, 'promotion', ['name']);
  }

  @Roles('Admin')
  @Post()
  async create(@Body() createPromotionDto: CreatePromotionDto) {
    return this.promotionService.create(createPromotionDto);
  }

  @Patch()
  async update(@Body() updatePromotionDto: UpdatePromotionDto) {
    return this.promotionService.update(updatePromotionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.promotionService.remove(id);
  }
}
