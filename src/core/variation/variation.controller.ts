import { Controller, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { VariationService } from './variation.service';
import { CreateVariationDto, UpdateVariationDto } from './dto/variation.dto';
import { Roles } from 'src/decorators/customize';
import { ApiBearerAuth } from '@nestjs/swagger';
import { BaseController } from '../base/base.controller';
import { VariationDocument } from './schemas/variation.schema';

@ApiBearerAuth()
@Controller('variation')
export class VariationController extends BaseController<
  VariationDocument,
  VariationService
> {
  constructor(private readonly variationService: VariationService) {
    super(variationService, 'variation', ['name']);
  }

  @Roles('Admin')
  @Post()
  create(@Body() createVariationDto: CreateVariationDto) {
    return this.variationService.create(createVariationDto);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateVariationDto: UpdateVariationDto,
  ) {
    return this.variationService.update(id, updateVariationDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.variationService.remove(id);
  }
}
