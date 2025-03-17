import { Module } from '@nestjs/common';
import { PromotionCategoryService } from './promotion-category.service';
import { PromotionCategoryController } from './promotion-category.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  PromotionCategory,
  PromotionCategorySchema,
} from './schemas/promotion-category.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: PromotionCategory.name, schema: PromotionCategorySchema },
    ]),
  ],
  controllers: [PromotionCategoryController],
  providers: [PromotionCategoryService],
})
export class PromotionCategoryModule {}
