import { Module } from '@nestjs/common';
import { VariationOptionService } from './variation_option.service';
import { VariationOptionController } from './variation_option.controller';

@Module({
  controllers: [VariationOptionController],
  providers: [VariationOptionService],
})
export class VariationOptionModule {}
