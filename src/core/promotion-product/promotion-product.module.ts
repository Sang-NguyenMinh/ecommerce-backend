import { Module } from '@nestjs/common';
import { PromotionProductService } from './promotion-product.service';
import { PromotionProductController } from './promotion-product.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  PromotionProduct,
  PromotionProductSchema,
} from './schemas/promotion-product.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: PromotionProduct.name, schema: PromotionProductSchema },
    ]),
  ],
  controllers: [PromotionProductController],
  providers: [PromotionProductService],
})
export class PromotionProductModule {}
