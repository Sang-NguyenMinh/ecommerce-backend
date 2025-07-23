import { forwardRef, Module } from '@nestjs/common';
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
import { Product, ProductSchema } from '../product/schemas/product.schema';
import {
  CategoryVariation,
  CategoryVariationSchema,
} from '../category-variation/schemas/categoryVariation.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ProductCategory.name, schema: ProductCategorySchema },
      { name: Product.name, schema: ProductSchema },
      { name: CategoryVariation.name, schema: CategoryVariationSchema },
    ]),
    forwardRef(() => CategoryVariationModule),
    forwardRef(() => ProductModule),
  ],
  controllers: [ProductCategoryController],
  providers: [ProductCategoryService, CloudinaryService],
})
export class ProductCategoryModule {}
