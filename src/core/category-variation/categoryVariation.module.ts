import { Module } from '@nestjs/common';
import { CategoryVariationController } from './categoryVariation.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  CategoryVariation,
  CategoryVariationSchema,
} from './schemas/categoryVariation.schema';
import { CategoryVariationService } from './categoryVariation.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: CategoryVariation.name, schema: CategoryVariationSchema },
    ]),
  ],
  controllers: [CategoryVariationController],
  providers: [CategoryVariationService],
  exports: [CategoryVariationService],
})
export class CategoryVariationModule {}
