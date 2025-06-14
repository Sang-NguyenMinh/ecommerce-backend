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
import { VariationService } from './variation.service';
import { CreateVariationDto, UpdateVariationDto } from './dto/variation.dto';
import { Roles } from 'src/decorators/customize';
import { ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { BaseController } from '../base/base.controller';
import { VariationDocument } from './schemas/variation.schema';
import { BaseQueryDto } from '../base/base.dto';
import { BaseQueryResult } from '../base/base.service';

@ApiBearerAuth()
@Controller('variation')
export class VariationController extends BaseController<
  VariationDocument,
  VariationService
> {
  constructor(private readonly variationService: VariationService) {
    super(variationService, 'variation', ['name']);
  }

  // @Get()
  // @ApiResponse({ status: 200, description: 'Success' })
  // async findAll(
  //   @Query() queryDto: BaseQueryDto,
  // ): Promise<BaseQueryResult<any>> {
  //   const filter = this.buildFilter(queryDto);
  //   const options = this.buildOptions(queryDto);

  //   return await this.variationService.findAllBasic(filter, options);
  // }

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
