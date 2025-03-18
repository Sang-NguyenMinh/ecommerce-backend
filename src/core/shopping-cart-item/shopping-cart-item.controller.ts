import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ShoppingCartItemService } from './shopping-cart-item.service';
import {
  CreateShoppingCartItemDto,
  UpdateShoppingCartItemDto,
} from './dto/shopping-cart-item.dto';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Roles } from 'src/decorators/customize';

@ApiBearerAuth()
@Controller('shopping-cart-item')
export class ShoppingCartItemController {
  constructor(
    private readonly shoppingCartItemService: ShoppingCartItemService,
  ) {}

  @Roles('Admin')
  @Post()
  create(@Body() createShoppingCartItemDto: CreateShoppingCartItemDto) {
    return this.shoppingCartItemService.create(createShoppingCartItemDto);
  }

  @Get()
  findAll() {
    return this.shoppingCartItemService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.shoppingCartItemService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateShoppingCartItemDto: UpdateShoppingCartItemDto,
  ) {
    return this.shoppingCartItemService.update(updateShoppingCartItemDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.shoppingCartItemService.remove(+id);
  }
}
