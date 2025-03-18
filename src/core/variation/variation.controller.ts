import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { VariationService } from './variation.service';
import { CreateVariationDto, UpdateVariationDto } from './dto/variation.dto';
import { Roles } from 'src/decorators/customize';
import { ApiBearerAuth } from '@nestjs/swagger';

@ApiBearerAuth()
@Controller('variation')
export class VariationController {
  constructor(private readonly variationService: VariationService) {}

  @Roles('Admin')
  @Post()
  create(@Body() createVariationDto: CreateVariationDto) {
    return this.variationService.create(createVariationDto);
  }

  @Get()
  findAll() {
    return this.variationService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.variationService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateVariationDto: UpdateVariationDto,
  ) {
    return this.variationService.update(updateVariationDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.variationService.remove(+id);
  }
}
