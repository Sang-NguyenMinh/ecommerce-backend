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
import { UserAddressService } from './user-address.service';
import { ApiBearerAuth, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { BaseController } from '../base/base.controller';
import { UserAddressDocument } from './schemas/user-address.schema';
import {
  CreateUserAddressDto,
  UpdateUserAddressDto,
} from './dto/user-address.dto';
import { BaseQueryDto } from '../base/base.dto';
import { FilterQuery } from 'mongoose';
import { BaseQueryResult } from '../base/base.service';
import { CurrentUser } from 'src/decorators/customize';

@ApiTags('User Address')
@ApiBearerAuth()
@Controller('user-address')
export class UserAddressController extends BaseController<
  UserAddressDocument,
  UserAddressService
> {
  constructor(private readonly userAddressService: UserAddressService) {
    super(userAddressService, 'user-address', [
      'recipientName',
      'phoneNumber',
      'address',
      'district',
      'city',
    ]);
  }

  @Post()
  @ApiResponse({ status: 201, description: 'Address created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async create(@Body() createDto: CreateUserAddressDto) {
    return this.userAddressService.create(createDto);
  }

  @Get()
  @ApiResponse({ status: 200, description: 'Get all addresses successfully' })
  async findAll(
    @Query() queryDto: BaseQueryDto,
  ): Promise<BaseQueryResult<UserAddressDocument>> {
    const filter = this.buildFilter(queryDto);
    const options = this.buildOptions(queryDto);

    return await this.userAddressService.findAll(filter, options);
  }

  @ApiResponse({ status: 200, description: 'Get user addresses successfully' })
  async getAddressByUserId(@CurrentUser() req) {
    return this.userAddressService.getAddressByUserId(req._id);
  }

  @Patch(':id')
  @ApiParam({ name: 'id', description: 'Address ID' })
  @ApiResponse({ status: 200, description: 'Address updated successfully' })
  @ApiResponse({ status: 404, description: 'Address not found' })
  async update(
    @Param('id') id: string,
    @Body() updateDto: UpdateUserAddressDto,
  ) {
    return this.userAddressService.update(id, updateDto);
  }

  @Delete(':id')
  @ApiParam({ name: 'id', description: 'Address ID' })
  @ApiResponse({ status: 200, description: 'Address deleted successfully' })
  @ApiResponse({ status: 404, description: 'Address not found' })
  async remove(@Param('id') id: string) {
    return this.userAddressService.remove(id);
  }

  // Override buildFilter nếu cần thêm filter đặc biệt
  protected buildFilter(
    queryDto: BaseQueryDto,
  ): FilterQuery<UserAddressDocument> {
    const filter = super.buildFilter(queryDto);

    // Có thể thêm custom filters ở đây nếu cần
    // Ví dụ: filter theo userId, isDefault, etc.

    return filter;
  }
}
