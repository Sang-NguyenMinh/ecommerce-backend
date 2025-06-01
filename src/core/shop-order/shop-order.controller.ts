import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ShopOrderService } from './shop-order.service';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Roles } from 'src/decorators/customize';
import { CreateShopOrderDto, UpdateShopOrderDto } from './dto/shop-order.dto';

@ApiBearerAuth()
@Controller('shop-order')
export class ShopOrderController {
  constructor(private readonly shopOrderService: ShopOrderService) {}

  @Roles('Admin')
  @Post()
  create(@Body() createShopOrderDto: CreateShopOrderDto) {
    return this.shopOrderService.create(createShopOrderDto);
  }

  @Get()
  findAll() {
    return this.shopOrderService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.shopOrderService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateShopOrderDto: UpdateShopOrderDto,
  ) {
    return this.shopOrderService.update(updateShopOrderDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.shopOrderService.remove(id);
  }
}
