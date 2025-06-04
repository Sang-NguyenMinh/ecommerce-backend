import { Get, Query, Param, HttpException, HttpStatus } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { Document, FilterQuery, Types } from 'mongoose';
import { BaseService, BaseQueryResult, BaseSelectOption } from './base.service';
import { BaseQueryDto } from './base.dto';

export abstract class BaseController<
  T extends Document,
  S extends BaseService<T>,
> {
  constructor(
    protected readonly service: S,
    protected readonly entityName: string,
    protected readonly searchFields: string[] = ['name'],
  ) {}

  @Get()
  @ApiResponse({ status: 200, description: 'Success' })
  async findAll(@Query() queryDto: BaseQueryDto): Promise<BaseQueryResult<T>> {
    const filter = this.buildFilter(queryDto);
    const options = this.buildOptions(queryDto);

    return await this.service.findAll(filter, options);
  }

  @Get('select-options')
  async getSelectOptions(
    @Query('search') search?: string,
    @Query('limit') limit?: number,
    @Query('valueField') valueField?: string,
    @Query('labelField') labelField?: string,
  ): Promise<BaseSelectOption[]> {
    const filter = search
      ? this.service['buildSearchFilter'](search, this.searchFields)
      : {};

    return this.service.findForSelect(filter, {
      valueField: valueField || '_id',
      labelField: labelField || 'name',
      limit: limit || 50,
    });
  }

  @Get('count')
  async count(@Query() queryDto: BaseQueryDto): Promise<{ count: number }> {
    const filter = this.buildFilter(queryDto);
    const count = await this.service.count(filter);

    return { count };
  }

  @Get('exists/:id')
  @ApiParam({ name: 'id' })
  async exists(@Param('id') id: string): Promise<{ exists: boolean }> {
    if (!Types.ObjectId.isValid(id)) {
      throw new HttpException('Invalid ID format', HttpStatus.BAD_REQUEST);
    }

    const exists = await this.service.exists({ _id: id } as FilterQuery<T>);
    return { exists };
  }

  @Get(':id')
  @ApiParam({ name: 'id' })
  @ApiResponse({ status: 200, description: 'Success' })
  @ApiResponse({ status: 404, description: 'Not found' })
  async findOne(@Param('id') id: string): Promise<T> {
    const result = await this.service.findById(id, {
      errThrowing: true,
      errMessage: `${this.entityName} not found`,
    });

    if (!result) {
      throw new HttpException(
        `${this.entityName} not found`,
        HttpStatus.NOT_FOUND,
      );
    }

    return result;
  }

  // Protected methods that can be overridden by child classes
  protected buildFilter(queryDto: BaseQueryDto): FilterQuery<T> {
    const filter: any = {};

    // Text search
    if (queryDto.search) {
      Object.assign(
        filter,
        this.service['buildSearchFilter'](queryDto.search, this.searchFields),
      );
    }

    // Date range filter
    if (queryDto.dateFrom || queryDto.dateTo) {
      Object.assign(
        filter,
        this.service['buildDateRangeFilter'](
          queryDto.dateFrom,
          queryDto.dateTo,
          queryDto.dateField || 'createdAt',
        ),
      );
    }

    // Status filter (if exists)
    if (queryDto.isActive !== undefined) {
      filter.isActive = queryDto.isActive;
    }

    // Custom filters can be added by overriding this method
    return this.addCustomFilters(filter, queryDto);
  }

  protected buildOptions(queryDto: BaseQueryDto) {
    return {
      page: queryDto.page,
      pageSize: queryDto.pageSize,
      limit: queryDto.limit,
      fields: queryDto.fields,
      populate: queryDto.populate,
      sort: queryDto.sort,
      lean: queryDto.lean,
      exclude: queryDto.exclude
        ? this.service['convertToObjectIds'](queryDto.exclude)
        : undefined,
      errThrowing: true,
    };
  }

  // Override this method in child classes to add custom filters
  protected addCustomFilters(
    filter: any,
    queryDto: BaseQueryDto,
  ): FilterQuery<T> {
    return filter;
  }
}
