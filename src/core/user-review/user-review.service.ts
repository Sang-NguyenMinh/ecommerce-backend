import { Injectable, NotFoundException } from '@nestjs/common';
import { UserReview } from './schemas/user-review.schema';
import { InjectModel } from '@nestjs/mongoose';
import {
  CreateUserReviewDto,
  UpdateUserReviewDto,
} from './dto/user-review.dto';
import { Model } from 'mongoose';

@Injectable()
export class UserReviewService {
  constructor(
    @InjectModel(UserReview.name)
    private userReviewModel: Model<UserReview>,
  ) {}

  async create(createUserReviewDto: CreateUserReviewDto): Promise<UserReview> {
    const newUserReview = new this.userReviewModel(createUserReviewDto);
    return newUserReview.save();
  }

  async update(updateUserReviewDto: UpdateUserReviewDto): Promise<UserReview> {
    const { id, ...updateData } = updateUserReviewDto;
    const updatedUserReview = await this.userReviewModel.findByIdAndUpdate(
      id,
      updateData,
      { new: true },
    );
    if (!updatedUserReview) {
      throw new NotFoundException('User Review not found');
    }
    return updatedUserReview;
  }

  async findOne(id: string): Promise<UserReview> {
    const userReview = await this.userReviewModel
      .findById(id)
      .populate(['userId', 'orderedProductId']);
    if (!userReview) {
      throw new NotFoundException('User Review not found');
    }
    return userReview;
  }

  findAll() {
    return `This action returns all userReview`;
  }

  remove(id: number) {
    return `This action removes a #${id} userReview`;
  }
}
