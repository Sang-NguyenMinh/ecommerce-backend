import { Module } from '@nestjs/common';
import { VariationOptionService } from './variation_option.service';
import { VariationOptionController } from './variation_option.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  VariationOption,
  VariationOptionSchema,
} from './schemas/variation_option.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: VariationOption.name, schema: VariationOptionSchema },
    ]),
  ],
  controllers: [VariationOptionController],
  providers: [VariationOptionService],
})
export class VariationOptionModule {}
