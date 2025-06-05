import { Module } from '@nestjs/common';
import { CategoryVariationController } from './variation.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  CategoryVariation,
  CategoryVariationSchema,
} from './schemas/variation.schema';
import { CategoryVariationService } from './variation.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: CategoryVariation.name, schema: CategoryVariationSchema },
    ]),
  ],
  controllers: [CategoryVariationController],
  providers: [CategoryVariationService],
})
export class CategoryVariationModule {}
