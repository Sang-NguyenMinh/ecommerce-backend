import { Module } from '@nestjs/common';
import { PromotionProductService } from './promotion-product.service';
import { PromotionProductController } from './promotion-product.controller';

@Module({
  controllers: [PromotionProductController],
  providers: [PromotionProductService],
})
export class PromotionProductModule {}
