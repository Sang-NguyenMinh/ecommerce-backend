import { Module } from '@nestjs/common';
import { VariationService } from './variation.service';
import { VariationController } from './variation.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Variation, VariationSchema } from './schemas/variation.schema';
import {
  CategoryVariation,
  CategoryVariationSchema,
} from '../category-variation/schemas/categoryVariation.schema';
import {
  VariationOption,
  VariationOptionSchema,
} from '../variation_option/schemas/variation_option.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Variation.name, schema: VariationSchema },
      { name: CategoryVariation.name, schema: CategoryVariationSchema },
      { name: VariationOption.name, schema: VariationOptionSchema },
    ]),
  ],
  controllers: [VariationController],
  providers: [VariationService],
})
export class VariationModule {}
