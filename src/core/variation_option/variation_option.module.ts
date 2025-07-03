import { Module } from '@nestjs/common';
import { VariationOptionService } from './variation_option.service';
import { VariationOptionController } from './variation_option.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  VariationOption,
  VariationOptionSchema,
} from './schemas/variation_option.schema';
import { CategoryVariationModule } from '../category-variation/categoryVariation.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: VariationOption.name, schema: VariationOptionSchema },
    ]),
    CategoryVariationModule,
  ],
  controllers: [VariationOptionController],
  providers: [VariationOptionService],
})
export class VariationOptionModule {}
