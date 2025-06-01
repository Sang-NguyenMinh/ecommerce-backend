import { Injectable, NotFoundException } from '@nestjs/common';
import { UserReview } from './schemas/user-review.schema';
import { InjectModel } from '@nestjs/mongoose';
import {
  CreateUserReviewDto,
  UpdateUserReviewDto,
} from './dto/user-review.dto';
import { FilterQuery, Model } from 'mongoose';
import { CustomOptions } from 'src/config/types';

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

  async findAll(
    filter?: FilterQuery<UserReview>,
    options?: CustomOptions<UserReview>,
  ): Promise<{ userReviews: UserReview[]; total: number }> {
    const total = await this.userReviewModel.countDocuments({ ...filter });

    const userReviews = await this.userReviewModel
      .find({ ...filter }, { ...options })
      .populate(['userId', 'orderedProductId'])
      .exec();

    return {
      userReviews,
      total,
    };
  }

  async remove(id: string): Promise<void> {
    const userReview = await this.userReviewModel.findByIdAndDelete(id);
    if (!userReview) {
      throw new NotFoundException('User Review not found');
    }
  }
}
