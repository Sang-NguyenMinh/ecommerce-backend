import { Module } from '@nestjs/common';
import { VariationService } from './variation.service';
import { VariationController } from './variation.controller';

@Module({
  controllers: [VariationController],
  providers: [VariationService],
})
export class VariationModule {}
