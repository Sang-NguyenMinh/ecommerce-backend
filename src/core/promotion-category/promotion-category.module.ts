import { Module } from '@nestjs/common';
import { PromotionCategoryService } from './promotion-category.service';
import { PromotionCategoryController } from './promotion-category.controller';

@Module({
  controllers: [PromotionCategoryController],
  providers: [PromotionCategoryService],
})
export class PromotionCategoryModule {}
