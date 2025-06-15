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
import { VariationOptionService } from './variation_option.service';
import { Roles } from 'src/decorators/customize';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import {
  CreateVariationOptionDto,
  UpdateVariationOptionDto,
  VariationOptionQueryDto,
} from './dto/variation-option.dto';
import { extend } from 'dayjs';
import { VariationOptionDocument } from './schemas/variation_option.schema';
import { BaseController } from '../base/base.controller';
import { BaseQueryResult } from '../base/base.service';

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

  @Get()
  @ApiOperation({ summary: 'Get all variation options with filtering' })
  @ApiResponse({ status: 200, description: 'Success' })
  async findAll(
    @Query() queryDto: VariationOptionQueryDto,
  ): Promise<BaseQueryResult<VariationOptionDocument>> {
    return this.variationOptionService.getAll({
      variationId: queryDto?.variationId ?? undefined,
      filter: this.buildFilter(queryDto),
      options: this.buildOptions(queryDto),
    });
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateVariationOptionDto: UpdateVariationOptionDto,
  ) {
    return this.variationOptionService.update(updateVariationOptionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.variationOptionService.remove(id);
  }
}
