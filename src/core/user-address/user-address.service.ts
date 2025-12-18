import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  UserAddress,
  UserAddressDocument,
} from './schemas/user-address.schema';
import { BaseService } from '../base/base.service';
import {
  CreateUserAddressDto,
  UpdateUserAddressDto,
} from './dto/user-address.dto';

@Injectable()
export class UserAddressService extends BaseService<UserAddressDocument> {
  constructor(
    @InjectModel(UserAddress.name)
    private userAddressModel: Model<UserAddressDocument>,
  ) {
    super(userAddressModel);
  }

  async create(createDto: CreateUserAddressDto): Promise<UserAddressDocument> {
    try {
      const created = new this.userAddressModel(createDto);
      return await created.save();
    } catch (error) {
      console.error('Error creating user address:', error);
      throw new HttpException(
        'Error creating address',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async update(
    id: string,
    updateDto: UpdateUserAddressDto,
  ): Promise<UserAddressDocument> {
    try {
      if (!Types.ObjectId.isValid(id)) {
        throw new HttpException('Invalid ID format', HttpStatus.BAD_REQUEST);
      }

      const updated = await this.userAddressModel.findByIdAndUpdate(
        id,
        updateDto,
        { new: true, lean: false },
      );

      if (!updated) {
        throw new HttpException('Address not found', HttpStatus.NOT_FOUND);
      }

      return updated;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.error('Error updating user address:', error);
      throw new HttpException(
        'Error updating address',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getAddressByUserId(userId: string) {
    try {
      return await this.findAll(
        { userId: userId, isActive: true },
        {
          sort: { createdAt: -1 },
          lean: true,
        },
      );
    } catch (error) {
      console.error('Error getting user addresses:', error);
    }
  }
}
