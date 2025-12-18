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
import { ShippingMethodService } from './shipping-method.service';
import { ApiBearerAuth, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { BaseController } from '../base/base.controller';
import {
  CreateShippingMethodDto,
  UpdateShippingMethodDto,
} from './dto/shipping-method.dto';
import { BaseQueryDto } from '../base/base.dto';
import { BaseQueryResult } from '../base/base.service';
import { ShippingMethodDocument } from './schemas/shipping-method.scheme';

@ApiTags('Shipping Method')
@ApiBearerAuth()
@Controller('shipping-method')
export class ShippingMethodController extends BaseController<
  ShippingMethodDocument,
  ShippingMethodService
> {
  constructor(private readonly shippingMethodService: ShippingMethodService) {
    // searchFields: tìm kiếm theo tên
    super(shippingMethodService, 'shipping-method', ['name']);
  }

  @Post()
  @ApiResponse({
    status: 201,
    description: 'Shipping method created successfully',
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async create(@Body() createDto: CreateShippingMethodDto) {
    return this.shippingMethodService.create(createDto);
  }

  @Get()
  @ApiResponse({
    status: 200,
    description: 'Get all shipping methods successfully',
  })
  async findAll(
    @Query() queryDto: BaseQueryDto,
  ): Promise<BaseQueryResult<ShippingMethodDocument>> {
    const filter = this.buildFilter(queryDto);
    const options = this.buildOptions(queryDto);

    return await this.shippingMethodService.findAll(filter, options);
  }

  @Patch(':id')
  @ApiParam({ name: 'id', description: 'Shipping method ID' })
  @ApiResponse({
    status: 200,
    description: 'Shipping method updated successfully',
  })
  @ApiResponse({ status: 404, description: 'Shipping method not found' })
  async update(
    @Param('id') id: string,
    @Body() updateDto: UpdateShippingMethodDto,
  ) {
    return this.shippingMethodService.update(id, updateDto);
  }
}
