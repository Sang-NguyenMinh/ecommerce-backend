import { ProductConfigurationDocument } from './schemas/product_configuration.schema';
import { Controller, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ProductConfigurationService } from './product_configuration.service';
import {
  CreateProductConfigurationDto,
  UpdateProductConfigurationDto,
} from './dto/product-configuration.dto';
import { Roles } from 'src/decorators/customize';
import { ApiBearerAuth } from '@nestjs/swagger';
import { BaseController } from '../base/base.controller';

@ApiBearerAuth()
@Controller('product-configuration')
export class ProductConfigurationController extends BaseController<
  ProductConfigurationDocument,
  ProductConfigurationService
> {
  constructor(
    private readonly productConfigurationService: ProductConfigurationService,
  ) {
    super(productConfigurationService, 'Product Configuration');
  }

  @Roles('Admin')
  @Post()
  create(@Body() createProductConfigurationDto: CreateProductConfigurationDto) {
    return this.productConfigurationService.create(
      createProductConfigurationDto,
    );
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateProductConfigurationDto: UpdateProductConfigurationDto,
  ) {
    return this.productConfigurationService.update(
      updateProductConfigurationDto,
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productConfigurationService.remove(id);
  }
}
