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
} from './dto/variation-option.dto';

@ApiBearerAuth()
@Controller('variation-option')
export class VariationOptionController {
  constructor(
    private readonly variationOptionService: VariationOptionService,
  ) {}

  @Roles('Admin')
  @Post()
  create(@Body() createVariationOptionDto: CreateVariationOptionDto) {
    return this.variationOptionService.create(createVariationOptionDto);
  }

  @Get()
  findAll() {
    return this.variationOptionService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.variationOptionService.findOne(id);
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
    return this.variationOptionService.remove(+id);
  }
}
