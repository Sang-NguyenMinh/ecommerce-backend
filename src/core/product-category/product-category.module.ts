import { Module } from '@nestjs/common';
import { ProductCategoryService } from './product-category.service';
import { ProductCategoryController } from './product-category.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  ProductCategory,
  ProductCategorySchema,
} from './schemas/product-category.schema';
import { ProductModule } from '../product/product.module';
import { CloudinaryService } from 'src/shared/cloudinary.service';
import { CategoryVariationModule } from '../category-variation/categoryVariation.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ProductCategory.name, schema: ProductCategorySchema },
    ]),
    ProductModule,
    CategoryVariationModule,
  ],
  controllers: [ProductCategoryController],
  providers: [ProductCategoryService, CloudinaryService],
})
export class ProductCategoryModule {}
