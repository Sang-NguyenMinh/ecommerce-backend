import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PromotionUsageService } from './promotion-usage.service';
import {
  PromotionUsage,
  PromotionUsageSchema,
} from './schemas/promotion-usage.schema';
import { PromotionUsageController } from './promotion-usage.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: PromotionUsage.name, schema: PromotionUsageSchema },
    ]),
  ],
  controllers: [PromotionUsageController],
  providers: [PromotionUsageService],
})
export class PromotionUsageModule {}
