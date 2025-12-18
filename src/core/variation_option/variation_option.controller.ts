import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { VariationOptionService } from './variation_option.service';
import { Roles } from 'src/decorators/customize';
import { ApiBearerAuth } from '@nestjs/swagger';
import {
  CreateVariationOptionDto,
  UpdateVariationOptionDto,
  VariationOptionQueryDto,
} from './dto/variation-option.dto';
import { VariationOptionDocument } from './schemas/variation_option.schema';
import { BaseController } from '../base/base.controller';
import { FilterQuery, Types } from 'mongoose';

@ApiBearerAuth()
@Controller('variation_option')
export class VariationOptionController extends BaseController<
  VariationOptionDocument,
  VariationOptionService
> {
  constructor(private readonly variationOptionService: VariationOptionService) {
    super(variationOptionService, 'Variation Option', ['name', 'value']);
  }

  @Roles('Admin')
  @Post()
  create(@Body() createVariationOptionDto: CreateVariationOptionDto) {
    return this.variationOptionService.create(createVariationOptionDto);
  }

  @Get('by_category/:id')
  getVariationOptionsByCategoryId(@Param('id') categoryId: string) {
    return this.variationOptionService.getVariationOptionsByCategoryId(
      categoryId,
    );
  }

  protected addCustomFilters(
    filter: any,
    queryDto: VariationOptionQueryDto,
  ): FilterQuery<VariationOptionDocument> {
    if (queryDto.variationId) {
      filter.variationId = queryDto.variationId;
    }
    return filter;
  }
}
