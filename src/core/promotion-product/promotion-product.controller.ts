import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { PromotionProductService } from './promotion-product.service';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Roles } from 'src/decorators/customize';
import {
  CreatePromotionProductDto,
  UpdatePromotionProductDto,
} from './dto/promotion-product.dto';

@ApiBearerAuth()
@Controller('promotion-product')
export class PromotionProductController {
  constructor(
    private readonly promotionProductService: PromotionProductService,
  ) {}

  @Roles('Admin')
  @Post()
  create(@Body() createPromotionProductDto: CreatePromotionProductDto) {
    return this.promotionProductService.create(createPromotionProductDto);
  }

  @Get()
  findAll() {
    return this.promotionProductService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.promotionProductService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updatePromotionProductDto: UpdatePromotionProductDto,
  ) {
    return this.promotionProductService.update(updatePromotionProductDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.promotionProductService.remove(+id);
  }
}
