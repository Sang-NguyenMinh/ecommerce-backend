import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { UserAddress } from './schemas/user-address.schema';
import { Model } from 'mongoose';
import {
  CreateUserAddressDto,
  UpdateUserAddressDto,
} from './dto/user-address.dto';

@Injectable()
export class UserAddressService {
  constructor(
    @InjectModel(UserAddress.name)
    private userAddressModel: Model<UserAddress>,
  ) {}

  async create(
    createUserAddressDto: CreateUserAddressDto,
  ): Promise<UserAddress> {
    if (createUserAddressDto.isDefault) {
      await this.userAddressModel.updateMany(
        { userId: createUserAddressDto.userId },
        { isDefault: false },
      );
    }

    const newUserAddress = new this.userAddressModel(createUserAddressDto);
    return newUserAddress.save();
  }

  async update(
    updateUserAddressDto: UpdateUserAddressDto,
  ): Promise<UserAddress> {
    const { id, isDefault, ...updateData } = updateUserAddressDto;

    if (isDefault) {
      const existingAddress = await this.userAddressModel.findById(id);
      if (!existingAddress) {
        throw new NotFoundException('User Address not found');
      }

      await this.userAddressModel.updateMany(
        { userId: existingAddress.userId },
        { isDefault: false },
      );
    }

    const updatedUserAddress = await this.userAddressModel.findByIdAndUpdate(
      id,
      updateUserAddressDto,
      { new: true },
    );
    if (!updatedUserAddress) {
      throw new NotFoundException('User Address not found');
    }
    return updatedUserAddress;
  }

  async findOne(id: string): Promise<UserAddress> {
    const userAddress = await this.userAddressModel
      .findById(id)
      .populate('userId');
    if (!userAddress) {
      throw new NotFoundException('User Address not found');
    }
    return userAddress;
  }

  async findByUser(userId: string): Promise<UserAddress[]> {
    return this.userAddressModel.find({ userId }).sort({ isDefault: -1 });
  }
  findAll() {
    return `This action returns all userAddress`;
  }

  remove(id: number) {
    return `This action removes a #${id} userAddress`;
  }
}
