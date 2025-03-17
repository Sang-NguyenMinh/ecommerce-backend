import { Module } from '@nestjs/common';
import { VariationService } from './variation.service';
import { VariationController } from './variation.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Variation, VariationSchema } from './schemas/variation.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Variation.name, schema: VariationSchema },
    ]),
  ],
  controllers: [VariationController],
  providers: [VariationService],
})
export class VariationModule {}
