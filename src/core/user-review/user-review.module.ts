import { Module } from '@nestjs/common';
import { UserReviewService } from './user-review.service';
import { UserReviewController } from './user-review.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { UserReview, UserReviewSchema } from './schemas/user-review.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: UserReview.name, schema: UserReviewSchema },
    ]),
  ],
  controllers: [UserReviewController],
  providers: [UserReviewService],
})
export class UserReviewModule {}
