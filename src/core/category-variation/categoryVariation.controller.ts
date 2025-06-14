import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { Roles } from 'src/decorators/customize';
import { ApiBearerAuth } from '@nestjs/swagger';
import { CategoryVariationService } from './categoryVariation.service';
import {
  CreateCategoryVariationDto,
  UpdateCategoryVariationDto,
} from './dto/categoryVariation.dto';

@ApiBearerAuth()
@Controller('category-variation')
export class CategoryVariationController {
  constructor(
    private readonly categoryVariationService: CategoryVariationService,
  ) {}

  @Roles('Admin')
  @Post()
  create(@Body() createVariationDto: CreateCategoryVariationDto) {
    return this.categoryVariationService.create(createVariationDto);
  }

  @Get()
  findAll() {
    return this.categoryVariationService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.categoryVariationService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateVariationDto: UpdateCategoryVariationDto,
  ) {
    return this.categoryVariationService.update(id, updateVariationDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.categoryVariationService.remove(id);
  }
}
