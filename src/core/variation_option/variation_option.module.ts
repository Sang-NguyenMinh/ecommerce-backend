import { forwardRef, Module } from '@nestjs/common';
import { VariationOptionService } from './variation_option.service';
import { VariationOptionController } from './variation_option.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  VariationOption,
  VariationOptionSchema,
} from './schemas/variation_option.schema';
import { CategoryVariationModule } from '../category-variation/categoryVariation.module';
import {
  CategoryVariation,
  CategoryVariationSchema,
} from '../category-variation/schemas/categoryVariation.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: VariationOption.name, schema: VariationOptionSchema },
      { name: CategoryVariation.name, schema: CategoryVariationSchema },
    ]),
    forwardRef(() => CategoryVariationModule),
  ],
  controllers: [VariationOptionController],
  providers: [VariationOptionService],
  exports: [VariationOptionService],
})
export class VariationOptionModule {}
