import { forwardRef, Module } from '@nestjs/common';
import { VariationService } from './variation.service';
import { VariationController } from './variation.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Variation, VariationSchema } from './schemas/variation.schema';
import {
  CategoryVariation,
  CategoryVariationSchema,
} from '../category-variation/schemas/category-variation.schema';
import {
  VariationOption,
  VariationOptionSchema,
} from '../variation_option/schemas/variation_option.schema';
import { VariationOptionModule } from '../variation_option/variation_option.module';
import { CategoryVariationModule } from '../category-variation/categoryVariation.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Variation.name, schema: VariationSchema },
      { name: CategoryVariation.name, schema: CategoryVariationSchema },
      { name: VariationOption.name, schema: VariationOptionSchema },
    ]),
    forwardRef(() => CategoryVariationModule),
    forwardRef(() => VariationOptionModule),
  ],
  controllers: [VariationController],
  providers: [VariationService],
  exports: [VariationService],
})
export class VariationModule {}
