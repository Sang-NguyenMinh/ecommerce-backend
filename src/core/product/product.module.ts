import { forwardRef, Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Product, ProductSchema } from './schemas/product.schema';
import { CloudinaryService } from 'src/shared/cloudinary.service';
import {
  CategoryVariation,
  CategoryVariationSchema,
} from '../category-variation/schemas/category-variation.schema';
import { CategoryVariationModule } from '../category-variation/categoryVariation.module';
import { ProductItemSchema } from '../product-item/schemas/product-item.schema';
import { ProductItemModule } from '../product-item/product-item.module';
import { ProductCategoryModule } from '../product-category/product-category.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Product.name, schema: ProductSchema },
      { name: CategoryVariation.name, schema: CategoryVariationSchema },
    ]),
    forwardRef(() => CategoryVariationModule),
    forwardRef(() => ProductItemModule),
    forwardRef(() => ProductCategoryModule),
  ],
  controllers: [ProductController],
  providers: [ProductService, CloudinaryService],
  exports: [ProductService],
})
export class ProductModule {}
