import { forwardRef, Module } from '@nestjs/common';
import { CategoryVariationController } from './categoryVariation.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  CategoryVariation,
  CategoryVariationSchema,
} from './schemas/category-variation.schema';
import { CategoryVariationService } from './categoryVariation.service';
import {
  Variation,
  VariationSchema,
} from '../variation/schemas/variation.schema';
import { VariationModule } from '../variation/variation.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: CategoryVariation.name, schema: CategoryVariationSchema },
      { name: Variation.name, schema: VariationSchema },
    ]),
    forwardRef(() => VariationModule),
  ],
  controllers: [CategoryVariationController],
  providers: [CategoryVariationService],
  exports: [CategoryVariationService],
})
export class CategoryVariationModule {}
