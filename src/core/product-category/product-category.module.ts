import { Module } from '@nestjs/common';
import { ProductCategoryService } from './product-category.service';
import { ProductCategoryController } from './product-category.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductService } from '../product/product.service';
import {
  ProductCategory,
  ProductCategorySchema,
} from './schemas/product-category.schema';
import { ProductModule } from '../product/product.module';
import { CloudinaryService } from 'src/shared/cloudinary.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ProductCategory.name, schema: ProductCategorySchema },
    ]),
    ProductModule,
  ],
  controllers: [ProductCategoryController],
  providers: [ProductCategoryService, CloudinaryService],
})
export class ProductCategoryModule {}
