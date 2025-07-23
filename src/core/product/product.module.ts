import { forwardRef, Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Product, ProductSchema } from './schemas/product.schema';
import { CloudinaryService } from 'src/shared/cloudinary.service';
import {
  CategoryVariation,
  CategoryVariationSchema,
} from '../category-variation/schemas/categoryVariation.schema';
import { CategoryVariationModule } from '../category-variation/categoryVariation.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Product.name, schema: ProductSchema },
      { name: CategoryVariation.name, schema: CategoryVariationSchema },
    ]),
    forwardRef(() => CategoryVariationModule),
  ],
  controllers: [ProductController],
  providers: [ProductService, CloudinaryService],
  exports: [ProductService],
})
export class ProductModule {}
