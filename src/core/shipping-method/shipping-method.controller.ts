import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ShippingMethodService } from './shipping-method.service';
import {
  CreateShippingMethodDto,
  UpdateShippingMethodDto,
} from './dto/shipping-method.dto';
import { Roles } from 'src/decorators/customize';
import { ApiBearerAuth } from '@nestjs/swagger';

@ApiBearerAuth()
@Controller('shipping-method')
export class ShippingMethodController {
  constructor(private readonly shippingMethodService: ShippingMethodService) {}

  @Roles('Admin')
  @Post()
  create(@Body() createShippingMethodDto: CreateShippingMethodDto) {
    return this.shippingMethodService.create(createShippingMethodDto);
  }

  @Get()
  findAll() {
    return this.shippingMethodService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.shippingMethodService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateShippingMethodDto: UpdateShippingMethodDto,
  ) {
    return this.shippingMethodService.update(updateShippingMethodDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.shippingMethodService.remove(+id);
  }
}
